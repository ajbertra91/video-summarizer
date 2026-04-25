#!/usr/bin/env node

import { createNotes, getMCPServers } from "./agent.js";
import { fetchTranscript } from "./tools.js";
import * as readline from "readline";

const DEFAULT_OLLAMA_URL = "http://localhost:11434";
const DEFAULT_MODEL = "llama3.2:latest";

interface CLIConfig {
  ollamaUrl: string;
  model: string;
}

function getConfig(): CLIConfig {
  const ollamaUrl = process.env.OLLAMA_URL || DEFAULT_OLLAMA_URL;
  const model = process.env.OLLAMA_MODEL || DEFAULT_MODEL;

  // CLI flags override env vars
  const urlIndex = process.argv.indexOf("--ollama-url");
  const modelIndex = process.argv.indexOf("--model");

  const config: CLIConfig = {
    ollamaUrl: urlIndex !== -1 ? process.argv[urlIndex + 1] : ollamaUrl,
    model: modelIndex !== -1 ? process.argv[modelIndex + 1] : model,
  };

  return config;
}

function displayMCPServers(): void {
  const servers = getMCPServers();
  console.log("\n=== Connected MCP Servers ===");

  if (servers.length === 0) {
    console.log("  (none currently)");
  } else {
    servers.forEach((server) => {
      const status = server.status === "connected" ? "✓" : "✗";
      console.log(`  ${status} ${server.name}`);
      if (server.description) {
        console.log(`     ${server.description}`);
      }
    });
  }
  console.log("=============================\n");
}

async function promptForURL(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question("Enter YouTube URL: ", (url) => {
      rl.close();
      resolve(url.trim());
    });
  });
}

async function main(): Promise<void> {
  const config = getConfig();

  console.log("🎬 YouTube Note-Taking Agent");
  console.log(`📍 Ollama: ${config.ollamaUrl}`);
  console.log(`🧠 Model: ${config.model}\n`);

  displayMCPServers();

  // Get URL from CLI arg or prompt
  let youtubeUrl = "";

  if (process.argv[2] && !process.argv[2].startsWith("--")) {
    youtubeUrl = process.argv[2];
  } else {
    youtubeUrl = await promptForURL();
  }

  if (!youtubeUrl) {
    console.error("❌ No URL provided");
    process.exit(1);
  }

  console.log(`📥 Processing: ${youtubeUrl}\n`);
  console.log("⏳ Fetching transcript...\n");

  try {
    const transcript = await fetchTranscript(youtubeUrl);
    console.log("✓ Transcript fetched\n");
    console.log("Generating notes...\n");

    const notes = await createNotes(transcript, config);
    console.log("📝 Generated Notes:\n");
    console.log("---");
    console.log(notes);
    console.log("---\n");
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Error: ${error.message}`);
    } else {
      console.error("❌ Unknown error occurred");
    }

    console.error("\n💡 Troubleshooting:");
    console.error(
      `  • Verify Ollama is running: ${config.ollamaUrl}/api/tags`
    );
    console.error(`  • Verify model available: ollama list`);
    console.error(
      "  • Check YouTube URL is valid and has captions available"
    );

    process.exit(1);
  }
}

main().catch(console.error);
