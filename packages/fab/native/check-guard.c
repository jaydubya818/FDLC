#define _XOPEN_SOURCE 700
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/wait.h>
#include <unistd.h>
#include <signal.h>
#include <poll.h>
#include <fcntl.h>
#include <ftw.h>
#include <errno.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <limits.h>

// The agent owns stdin's write end. EOF proves parent loss even after SIGKILL.
// This helper has no credential environment and supervises exactly one sandboxed
// process. The sandbox denies forks; it cannot create an unowned daemon tree.
static volatile sig_atomic_t stopped = 0;
static void stop(int signal_number) { stopped = signal_number; }
static int remove_entry(const char *name, const struct stat *info, int type, struct FTW *walk) {
  (void)info; (void)type; (void)walk;
  return remove(name);
}
int main(int argc, char **argv) {
  if (argc < 4 || argc > 40) return 125;
  const char *directory = argv[1];
  char canonical[PATH_MAX]; struct stat info;
  if (strncmp(directory, "/private/tmp/fab-check-", 23) != 0
    || !realpath(directory, canonical) || strcmp(directory, canonical) != 0
    || lstat(directory, &info) != 0 || !S_ISDIR(info.st_mode)
    || info.st_uid != getuid() || (info.st_mode & 077) != 0) return 125;
  struct sigaction action; memset(&action, 0, sizeof(action)); action.sa_handler = stop;
  sigaction(SIGTERM, &action, NULL); sigaction(SIGINT, &action, NULL);
  pid_t child = fork();
  if (child == 0) {
    signal(SIGTERM, SIG_DFL); signal(SIGINT, SIG_DFL);
    int empty = open("/dev/null", O_RDONLY);
    if (empty < 0 || dup2(empty, STDIN_FILENO) < 0) _exit(125);
    if (empty != STDIN_FILENO) close(empty);
    char *command[43]; command[0] = "/usr/bin/sandbox-exec"; command[1] = "-f";
    for (int i = 2; i < argc; i++) command[i] = argv[i];
    command[argc] = NULL;
    execv(command[0], command); _exit(125);
  }
  if (child < 0) return 125;
  int status = 0;
  for (;;) {
    pid_t ended = waitpid(child, &status, WNOHANG);
    if (ended == child) break;
    if (ended < 0 && errno != EINTR) { stopped = SIGTERM; break; }
    struct pollfd parent = { .fd = STDIN_FILENO, .events = POLLIN | POLLHUP | POLLERR };
    int ready = poll(&parent, 1, 50);
    if (ready < 0 && errno != EINTR) stopped = SIGTERM;
    // No input is part of the protocol. EOF or unexpected data fails closed.
    if (ready > 0) stopped = SIGTERM;
    if (stopped) {
      kill(child, SIGKILL);
      while (waitpid(child, &status, 0) < 0 && errno == EINTR) {}
      break;
    }
  }
  // No symlink traversal. Cleanup is independent of the agent's finally block.
  if (nftw(directory, remove_entry, 16, FTW_DEPTH | FTW_PHYS) != 0) return 125;
  if (stopped) return 125;
  if (WIFEXITED(status)) return WEXITSTATUS(status);
  if (WIFSIGNALED(status)) { signal(WTERMSIG(status), SIG_DFL); raise(WTERMSIG(status)); }
  return 125;
}
