# Fab OpenRouter active route

Fab is ready when at least one explicitly selected provider route has passed the
current qualification. Provider readiness is evaluated per route; an unavailable
optional route does not block another qualified route.

The initial active route is fixed to:

- provider: `openrouter`
- endpoint: `https://openrouter.ai/api/v1/chat/completions`
- protocol: `openrouter-chat-completions/non-streaming`
- model: `openai/gpt-5.1-codex-mini`
- retries: `0`
- fallback: disabled
- streaming: disabled

Mission Control supplies an attempt-scoped OpenRouter key from its credential
broker. The key has a dollar limit and expiry, is kept in memory, and is revoked
after the attempt. Fab records the requested and returned model, request identity,
token usage, latency, and provider-reported cost for every physical request.

Bedrock remains supported as a separate route. Its current operational state is
`EXTERNAL_WAIT` with reason `AWS_QUOTA`; it is optional for Fab readiness and is
not silently selected when OpenRouter fails.

Live qualification uses only a synthetic repository and a bounded engineering
task. A producer Attempt may create an unpublished candidate. Acceptance requires
a separate verifier Attempt against the exact candidate revision. Neither Fab nor
the provider can publish, merge, or accept its own candidate.
