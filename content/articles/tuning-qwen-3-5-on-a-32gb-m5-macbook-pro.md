---
title: 'Tuning Qwen 3.5 on a 32GB M5 MacBook Pro'
date: '2026-05-16'
excerpt: 'A practical, source-backed guide to running and tuning Qwen 3.5 locally with llama.cpp or LM Studio, optimized for token efficiency and dev workflows in OpenCode and Copilot CLI.'
tags: ['LLM', 'Qwen', 'llama.cpp', 'LM Studio', 'Macbook Pro']
---

## Introduction

If you want strong local coding assistance without cloud token costs, a 32GB unified-memory MacBook Pro is a very workable setup for Qwen 3.5. The key is to tune for **memory fit first**, then optimize context size and batching for speed.

In this guide, I’ll show a practical setup for:

- Running Qwen 3.5 with `llama.cpp` (CLI + local API server)
- Running the same model in LM Studio (GUI + local API server)
- Connecting OpenCode and Copilot CLI to your local endpoint
- Reducing token usage while preserving coding quality

I’ll keep this focused on what works for day-to-day engineering, not benchmark theater.

## What matters most on a 32GB M5 MacBook Pro

On Apple Silicon, `llama.cpp` is optimized for ARM/Accelerate/Metal, and Apple Silicon is treated as a first-class target in the project docs.[3] That matters because unified memory means your model weights, KV cache, and app overhead all come from the same pool.

For local coding workloads, I recommend:

1. Start with a Q4/Q5 GGUF variant of a Qwen 3.5 model.
2. Keep context conservative initially (for example 8k–16k).
3. Increase only one variable at a time (context, batch, or cache precision).

Qwen’s documentation includes `llama.cpp` local-run guidance and GGUF workflows, including conversion/quantization paths when needed.[1] Hugging Face model cards for Qwen 3.5 variants also expose important context-window details you should verify per model before tuning.[2]

> The fastest way to crash local inference is trying to run a bigger context and higher quantization at the same time before confirming memory headroom.

## Option 1: Tune with llama.cpp

### Build or install llama.cpp

Use the official install/build docs (brew, binaries, or source).[3]

```bash
brew install llama.cpp
```

Or run from source:

```bash
git clone https://github.com/ggml-org/llama.cpp
cd llama.cpp
cmake -B build
cmake --build build --config Release -j
```

### Run a Qwen GGUF model with a safe starter profile

`llama.cpp` supports a wide range of quantizations and can run Qwen models in GGUF format.[3][1]

```bash
llama-cli \
  -hf Qwen/Qwen3.5-9B-GGUF:UD-Q4_K_XL \
  --ctx-size 8192 \
  --n-gpu-layers 999 \
  --ubatch-size 256 \
  --cache-type-k q8_0 \
  --cache-type-v q8_0
```

Why this is a good baseline:

- `UD-Q4_K_XL` is a strong quality/perf tradeoff for local coding on 32GB Apple Silicon.
- `--ctx-size 8192` avoids overcommitting memory early.
- `--n-gpu-layers 999` effectively pushes as much as possible to Metal-backed acceleration on Mac.
- `q8_0` KV cache is a balanced starting point before trying more aggressive cache compression.

Then iterate:

1. If generation is stable and memory is healthy, try `--ctx-size 12288` or `16384`.
2. If prompt ingestion is slow, test `--ubatch-size 384` or `512`.
3. If you hit memory pressure, lower context first, then reduce batch.

### Expose llama.cpp as an OpenAI-compatible local API

`llama-server` provides an OpenAI-compatible API server, which is perfect for editor/CLI tools.[3]

```bash
llama-server \
  -hf Qwen/Qwen3.5-9B-GGUF:UD-Q4_K_XL \
  --ctx-size 8192 \
  --n-gpu-layers 999 \
  --host 127.0.0.1 \
  --port 1234
```

Now your local endpoint is available at `http://127.0.0.1:1234/v1`.

## Option 2: Tune with LM Studio

LM Studio exposes OpenAI-compatible endpoints (chat/completions/models) so you can treat it like a local OpenAI server in downstream tools.[4]

### Load model with explicit context length

The LM Studio CLI supports explicit context settings during model load.[5]

```bash
lms load "Qwen3.5-9B-GGUF:UD-Q4_K_XL" --context-length 8192
```

You can confirm model capabilities through its REST endpoints and avoid setting context above model limits.[5]

### Run local server

In LM Studio, start the local server and confirm:

- Base URL: `http://127.0.0.1:1234/v1`
- Model appears in `/v1/models`
- Chosen context fits memory for your active workload

If interactive coding responses become choppy:

1. Lower context before switching model.
2. Use a lighter quantized file for routine coding.
3. Keep a heavier profile only for “deep reasoning” prompts.

## Connect local Qwen to OpenCode

OpenCode supports custom providers using OpenAI-compatible adapters and a provider `baseURL`.[6]

`~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "local-qwen": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Local Qwen via llama.cpp",
      "options": {
        "baseURL": "http://127.0.0.1:1234/v1"
      },
      "models": {
        "Qwen3.5-9B-GGUF:UD-Q4_K_XL": {
          "name": "Qwen 3.5 9B UD-Q4_K_XL"
        }
      }
    }
  },
  "model": "local-qwen/Qwen3.5-9B-GGUF:UD-Q4_K_XL",
  "small_model": "local-qwen/Qwen3.5-9B-GGUF:UD-Q4_K_XL"
}
```

If you maintain two local profiles, set:

- `small_model` to your fast model for routine file edits
- `model` to a larger profile for architecture and refactor prompts

This alone cuts local token churn because the heavy model is only used when needed.

## Connect local Qwen to Copilot CLI

Copilot CLI now supports BYOK/custom providers (including local OpenAI-compatible endpoints).[7]

```bash
export COPILOT_PROVIDER_TYPE=openai
export COPILOT_PROVIDER_BASE_URL=http://127.0.0.1:1234/v1
export COPILOT_MODEL=Qwen3.5-9B-GGUF:UD-Q4_K_XL
export COPILOT_OFFLINE=true
copilot
```

Important constraints from the docs:

- Your selected model must support tool calling and streaming.
- A large context window is recommended for best Copilot CLI behavior.[7]

## Token-efficiency patterns that actually help

I’ve found these changes have the biggest practical impact on local workflows:

### 1) Use two prompt tiers

- **Fast tier**: short prompts for edits, tests, and lint fixes.
- **Deep tier**: longer prompts only for design-level changes.

### 2) Constrain repo context manually

Ask for targeted files first, then pass only those files into the next prompt. Don’t dump the whole repository for every request.

### 3) Force concise output formats

For coding tasks, ask for:

- unified diff
- bullet-point rationale (max 5 bullets)
- no repeated code unless changed

### 4) Limit conversational carryover

On local models, long back-and-forth sessions silently tax KV cache and latency. Start fresh sessions for unrelated tasks.

### 5) Keep a “known-good” launch preset

Store two scripts and switch quickly:

```bash
#!/usr/bin/env bash
# fast-local.sh
llama-server -hf Qwen/Qwen3.5-9B-GGUF:UD-Q4_K_XL --ctx-size 8192 --ubatch-size 256 --port 1234
```

```bash
#!/usr/bin/env bash
# deep-local.sh
llama-server -hf Qwen/Qwen3.5-14B-GGUF:UD-Q5_K_M --ctx-size 16384 --ubatch-size 256 --port 1234
```

This avoids ad hoc tuning drift and keeps performance predictable.

## Common pitfalls

1. **Maxing context immediately**: causes memory pressure before you understand baseline throughput.
2. **Using one model profile for everything**: wastes cycles on simple tasks.
3. **Ignoring tool compatibility**: Copilot CLI requires model capabilities (tool calling + streaming) to function correctly.[7]
4. **Trusting a model card alone**: always validate runtime settings in your actual engine/server and hardware.

## Conclusion

For an M5 MacBook Pro with 32GB unified RAM, the best strategy is a disciplined baseline:

1. Start with a Q4/Q5 Qwen 3.5 GGUF profile.
2. Keep context conservative until latency and memory are stable.
3. Run through an OpenAI-compatible local endpoint.
4. Route OpenCode and Copilot CLI to that endpoint with separate fast/deep model profiles.

Do this, and you’ll get a reliable local coding assistant while sharply reducing cloud token dependence.

## References

1. [Qwen Docs — Run Locally with llama.cpp](https://qwen.readthedocs.io/en/latest/run_locally/llama.cpp.html)
2. [Hugging Face — Qwen 3.5 Model Cards](https://huggingface.co/Qwen)
3. [llama.cpp GitHub README](https://github.com/ggml-org/llama.cpp)
4. [LM Studio Docs — OpenAI Compatibility](https://lmstudio.ai/docs/developer/openai-compat)
5. [LM Studio Docs — CLI Load / Context / REST Endpoints](https://lmstudio.ai/docs/cli/local-models/load)
6. [OpenCode Docs — Providers](https://opencode.ai/docs/providers/)
7. [GitHub Docs — Using your own LLM models in Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/use-byok-models)
