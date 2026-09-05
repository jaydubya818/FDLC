# Fab Phase 2 execution plan

2026-09-05. Continue the existing `codex/fab` foundation. Experimental throughout.

1. Add native macOS Keychain enrollment via a bounded Security.framework stdin bridge; keep explicit environment configuration. Test with an isolated synthetic keychain only.
2. Harden redaction and provider cancellation; add deliberate protocol qualification with exact model IDs and explicit live opt-in. No live credentials have been supplied.
3. Integrate with the current MC generic harness and registry. Fresh source audit confirms MC remains at `07a96ac3623c8a6772455fcf4c9cdf4ca78e6d2f`. The main MC checkout is on unrelated branch `codex/github-app-multi-repo-installations`; use isolated worktree `/private/tmp/fab-mission-control` on its new `codex/fab` branch.
4. Reuse MC claims/renewals/reporting, candidate capture, separate verifier attempts, approval and publication. Add only execution context/linkage and adapter seams required by Fab. Fail closed on lost authority and uncertain replay. Never claim whole-agent OS read isolation from Fab's file guards.
5. Prove deterministic governed execution using real Fab edits/checks and MC lifecycle code. External authority/publishing transports remain fixtures. Keep live providers, deployed MC persistence and actual remote publication as separate gates.
6. Record exact test counts, source commits and remaining limits. Preserve all pre-existing site/MC files, and do not push or merge.

Native credential API references: [Apple generic password items](https://developer.apple.com/documentation/security/ksecclassgenericpassword), [SecItemCopyMatching](https://developer.apple.com/documentation/security/secitemcopymatching(_:_:)), [macOS keychain implementations](https://developer.apple.com/documentation/technotes/tn3137-on-mac-keychains). The local helper uses the macOS file-based Keychain implementation and a Fab-only service name; it is not an iCloud or hosted secret store.
