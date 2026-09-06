# Fab Bedrock continuation

Fab remains Experimental. This source change adds the Bedrock text/tool protocol
boundary and read-only CLI session inspection. It does not qualify a live model,
grant AWS credentials, reserve money, or establish deployed Mission Control
lineage. Earlier Phase 3 receipts retain their original source and package IDs.

The approved protocol is InvokeModel using the Anthropic Messages body, Sonnet
4.6 and its US inference profile in us-east-1. Configuration binds the exact
account/profile ARN and a broker reference. There is no AWS credential search,
HTTP fallback, streaming, extended thinking, cache configuration or retry path.

Before dispatch, Fab awaits durable request intent and checks the broker identity.
Returned evidence binds the request digest and exactly one physical attempt.
Provider request identity must be a bounded string. Observed model and usage
survive policy rejection; a complete HTTP response remains response-received
even when its payload is rejected. Unknown usage and cost stay unknown.
Observation and transport share the same cancellation/timeout deadline, and
failure to persist success cannot return a successful model result.

The host broker must independently verify the enrolled AWS identity, CountTokens
for the exact frozen body, current canonical Attempt/lease authority, the exact
route, and durable input-plus-maximum-output liability before invocation. An
unknown provider effect retains its full reservation. Fab's callback interface
does not implement or grant those controls. Mission Control's existing qualified
route/profile admission checks remain required; an Experimental configuration
cannot promote itself.

Local validation: 80 native tests passed with zero skips, including 20 Bedrock
protocol regressions and one built-CLI broker-session regression. TypeScript and
lint passed. Independent security, data-integrity, architecture, simplicity and
documentation review cleared this bounded offline implementation. No live model
requests were made. Live broker implementation, the five real engineering
families, deployed lineage and controlled qualification publication remain open.

The qualification environment and dedicated GitHub repository/App scope must be
resolved before inference. Whole-agent containment remains UNQUALIFIED; the
existing native project-check boundary is unchanged.
