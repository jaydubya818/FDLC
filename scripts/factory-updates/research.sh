#!/usr/bin/env bash
set -euo pipefail

# Public, immutable inputs. Neither the model nor the inference process receives credentials.
work=$(mktemp -d "${RUNNER_TEMP:-/tmp}/fdlc-research.XXXXXX")
server_pid=
cleanup() {
  if [[ -n "$server_pid" ]]; then kill "$server_pid" 2>/dev/null || true; fi
}
trap cleanup EXIT
fetch_verified() {
  local url=$1 file=$2 sha=$3
  curl --fail --silent --show-error --location --proto '=https' --proto-redir '=https' \
    --retry 3 --retry-all-errors --max-time 420 "$url" -o "$file"
  printf '%s  %s\n' "$sha" "$file" | sha256sum --check --status
}
binary=llama-b12833
weights=85e4a5b7b8ef0e48af0e8658f5aaab9c2324c76c1641493f4d1e25fce54b18b9
echo "Checking the inference engine and public model checksums"
fetch_verified "https://github.com/ggml-org/llama.cpp/releases/download/b12833/$binary-bin-ubuntu-x64.tar.gz" \
  "$work/llama.tar.gz" 92627825b3d5bf50f47d140019bf71b3ba2bcfe67b6ff1b541fb9c49c31588cd
fetch_verified "https://registry.ollama.ai/v2/library/qwen3/blobs/sha256:$weights" "$work/research.gguf" "$weights"
tar -xzf "$work/llama.tar.gz" -C "$work"
env -i PATH="$PATH" LD_LIBRARY_PATH="$work/$binary" "$work/$binary/llama-server" \
  --model "$work/research.gguf" --host 127.0.0.1 --port 8091 --ctx-size 16384 --parallel 1 \
  --threads "$(nproc)" --n-gpu-layers 0 > "$work/server.log" 2>&1 &
server_pid=$!
for _ in {1..90}; do
  if curl --fail --silent http://127.0.0.1:8091/health >/dev/null; then break; fi
  if ! kill -0 "$server_pid" 2>/dev/null; then tail -n 15 "$work/server.log"; exit 1; fi
  sleep 2
done
curl --fail --silent http://127.0.0.1:8091/health >/dev/null
echo "Hosted inference is ready"
node scripts/factory-updates/research.mjs "$1"
