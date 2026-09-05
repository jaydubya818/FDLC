# Fab security design

Phase D, 2026-09-05. Local experimental boundary; not a general-purpose hardened hostile-code sandbox certification. Implementation and measured limits belong in `FAB-QUALIFICATION.md`.

## Assets and authority

Protect user provider credentials, unrelated local files, repository integrity, operator consent and honest evidence. The developer grants one local task scope. Repository content, tool output and model output are untrusted. They cannot modify policy, enroll credentials, run arbitrary commands, publish, merge, deploy or accept their own changes. MC retains governed authority.

## Credential ownership and storage

Use opaque references with explicit owner, provider and tagged scope: user, organization, repository or execution. The initial local binding is a single actor/repository/provider; it does not simulate enterprise tenant authorization. Only provider transport resolves the bound credential. File/check tools have no credential API. Never spread environment into children or use standard cloud/SDK discovery chains.

Environment variables are an explicit opt-in mechanism, not encrypted storage. Only a named Fab-specific variable is read when selected; no `.env` loader and no fallback to host model tokens. Metadata may report configured/missing and an opaque reference; it never reports the value. CLI enrollment and OS Keychain/Secret Service/Credential Manager are designed follow-ups. Use native APIs or secure IPC/masked input; never put enrollment secrets in process arguments. Unsupported secure stores fail closed, with explicit headless environment configuration as a separate choice.

Hosted store is **designed only**: authenticated user/org ownership, server-side authorization on every use, KMS-backed envelope encryption, tenant/reference/purpose associated data, scoped short-lived execution grants, revocation, rotation and deletion receipts. Browser receives metadata only. No localStorage/API-key URLs. Do not claim encryption-at-rest for the environment provider.

## Redaction and privacy

Register only the explicitly selected credential in an in-memory redactor. Cover exact value and common encoded forms, generic provider token formats, secret assignments and private keys. Apply before model transmission, event persistence, error reporting, tool observations, candidate artifacts and terminal display. Redact whole bounded buffers before truncating so chunk boundaries do not split a secret. Prefer metadata-only provider errors; never include HTTP response bodies or headers in exceptions.

Redaction cannot prove arbitrary repository text contains no unknown secret, nor detect all semantic/encoded exfiltration. Minimize source context, reject secret filenames/config internals, deny symlinks/hard links and require users to choose appropriate repositories. Source sent to a selected model leaves the machine under that user's provider account and data terms. No separate Fab analytics service in the preview.

## File and command boundary

Only explicit relative files are writable. Reject traversal, absolute paths, control characters, symlink components, hard-linked files, `.git`, credential files and oversized/binary content. Bind every edit to the content read earlier to avoid overwriting concurrent edits. Start clean at a committed baseline. No automatic stash/reset/commit/push. Detect candidate drift and reject stale consent/checks.

Approved command strings are not a sandbox. Check IDs resolve to fixed executable/argument arrays from operator configuration; the model cannot change argv. Run against a disposable filtered snapshot with no secret files, no Git directory, no inherited HOME/environment and no provider credential. Enforce network denial, filesystem isolation, timeout, output limits and process-tree cleanup where implemented. Capture actual exit/signal and candidate digest. If the platform cannot enforce the boundary, record a blocked check. Do not reinterpret a failed sandbox launch as permission to run directly on the host.

Native filesystem tools are process-local guards, not protection against a malicious same-UID process racing the filesystem. The local pilot assumes an operator-controlled checkout with no concurrent adversary. Governed/hostile repositories require MC-admitted OS/container isolation for the entire worker, with independent verification; local guards cannot claim `WORKSPACE_ONLY` OS read containment for the entire agent process.

## Persistence and recovery

Store local sessions outside readable repository scope, in owner-only directories with private atomic files. Persist references only. Prevent concurrent session writers; interrupted writes/commands must not be blindly replayed. Record intent before action and observation after; an interrupted action remains uncertain until repository state is reconciled. Preserve candidate changes on failure. Local hashes provide integrity checks, not immutable external authority. MC owns durable governed storage and retention.

## Attack scenarios and required tests

| Attack | Enforcement and expected evidence |
| --- | --- |
| README requests a home-directory credential | No privileged instruction promotion; read denied, credential tool absent |
| Tool calls `../other-repo/file` or absolute path | Reject before opening/writing |
| Symlink/hard link points outside scope | Reject all linked file access |
| Model rewrites config/`.git`/`.env` | Reserved path denial even if allowlisted |
| Model invents shell/check ID | Strict dispatch denial; no shell interpolation |
| Test script reads home or sends network traffic | OS boundary denies; test proves denial |
| Test spawns daemon or floods output | Process group termination/output cap; no success |
| Secret in model text/error/tool output | Redacted before persistence/display; provider bodies discarded |
| Changed HEAD/content/config after consent | Drift blocks execution or candidate status |
| Tests pass before a later edit | Old test evidence invalidated; rerun current candidate |
| Interrupted tool call followed by resume | Conservative reconciliation; no duplicate ambiguous mutation |
| Model says impossible task is complete | No-change/check/structured-completion gates; explicit incomplete status |
| Local JSON claims independent verification | No acceptance authority; MC independently recomputes evidence |
| Wrong hosted user references another key | Future server ownership check denies before decrypt; unavailable in local preview |

## Explicit exclusions

No remote worker registration, browser bridge, deployment credentials, source-control tokens, package installation, dependency lifecycle execution or hosted secret store in the pilot. No owner credential migration. Extending these boundaries requires implementation, attack tests and qualification, not a documentation-only permission flag.
