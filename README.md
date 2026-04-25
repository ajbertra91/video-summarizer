# YouTube Note-Taking Agent

CLI agent harness using AI SDK + Ollama (Llama 3.2) to generate markdown notes from YouTube videos.

## Features

- 🎬 Fetch YouTube video transcripts
- 🧠 Local LLM inference (Ollama + Llama 3.2)
- 📝 Generate structured markdown notes
- 🔌 MCP server display (future integration)
- 💾 Stateless CLI design
- ♻️ Retry logic on failures

## Setup

### Prerequisites

- **Node.js** 18+
- **Ollama** running locally with `llama3.2:latest`

### Install Ollama + Model

```bash
# Download Ollama: https://ollama.ai
ollama pull llama3.2:latest
ollama serve  # Start Ollama (default: http://localhost:11434)
```

### Install Dependencies

```bash
npm install
npm run build
```

## Usage

### Quick Start

```bash
# With URL as argument
npm start https://www.youtube.com/watch?v=VIDEO_ID

# Interactive prompt (no URL arg)
npm start
```

### Configuration

Set Ollama endpoint via env var or CLI flag:

```bash
# Env var (used by default)
export OLLAMA_URL=http://localhost:11434
export OLLAMA_MODEL=llama3.2:latest
npm start <url>

# CLI flags (override env vars)
npm start --ollama-url http://localhost:11434 --model llama3.2:latest <url>
```

## Project Structure

```
src/
  ├─ main.ts      # CLI entry point, MCP display
  ├─ agent.ts     # Agent harness, createNotes() function
  ├─ tools.ts     # YouTube transcript tool
dist/             # Compiled JavaScript
package.json      # Dependencies + scripts
tsconfig.json     # TypeScript config
```

## Example

```bash
$ npm start https://www.youtube.com/watch?v=dQw4w9WgXcQ

🎬 YouTube Note-Taking Agent
📍 Ollama: http://localhost:11434
🧠 Model: llama3.2:latest

=== Connected MCP Servers ===
  (none currently)
=============================

📥 Processing: https://www.youtube.com/watch?v=dQw4w9WgXcQ
Generating notes...

📝 Generated Notes:

---
## Topic Overview
- Key point 1
- Key point 2

## Key Takeaways
- Takeaway A
- Takeaway B
---
```

## Development

### Dev Mode (with hot-reload)

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Future: MCP Integration

- Display connected MCP servers in CLI
- Feed MCP tools into agent
- Extensible tool ecosystem

## Troubleshooting

### Ollama connection fails

```bash
# Check Ollama is running
curl http://localhost:11434/api/tags

# Override endpoint
OLLAMA_URL=http://YOUR_IP:11434 npm start <url>
```

### Model not found

```bash
# List available models
ollama list

# Pull model if missing
ollama pull llama3.2:latest
```

### YouTube transcript unavailable

- Verify video has captions enabled
- Check youtube-transcript library is installed: `npm list youtube-transcript`
- Some videos restrict transcript access

## License

ISC
