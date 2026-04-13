# pi-paperhub-compat

Compatibility extension package for using PaperHub with pi.

Currently it patches provider requests for the `paperhub` provider so thinking mode is sent as:

```json
{
  "reasoning": {
    "enabled": true
  }
}
```

instead of OpenAI-style reasoning payloads that PaperHub does not accept.

## Install

```bash
pi install https://github.com/waqiju/pi-paperhub-compat
```

For a pinned version:

```bash
pi install https://github.com/waqiju/pi-paperhub-compat@v0.1.0
```

## PaperHub model config

Add your PaperHub provider to `~/.pi/agent/models.json`:

```json
{
  "providers": {
    "paperhub": {
      "baseUrl": "https://tc-paperhub.diezhi.net/v1",
      "api": "openai-completions",
      "apiKey": "YOUR_PAPERHUB_API_KEY",
      "compat": {
        "supportsDeveloperRole": false,
        "supportsReasoningEffort": false
      },
      "models": [
        {
          "id": "glm-5",
          "name": "GLM-5",
          "reasoning": true,
          "input": ["text"],
          "contextWindow": 198000,
          "maxTokens": 16000
        },
        {
          "id": "qwen3.6-plus",
          "name": "Qwen3.6 Plus",
          "reasoning": true,
          "input": ["text", "image"],
          "contextWindow": 1000000,
          "maxTokens": 64000
        }
      ]
    }
  }
}
```

## Notes

- The extension activates only for the `paperhub` provider.
- If thinking is `off`, it does not inject `reasoning.enabled`.
- Future PaperHub-specific request compatibility patches can live in the same package.
