interface AgentConfig {
  ollamaUrl: string;
  model: string;
}

export async function createNotes(
  transcript: string,
  config: AgentConfig
): Promise<string> {
  const systemPrompt = `You are a note-taking assistant. Your job is to:
1. Analyze the provided YouTube video transcript
2. Extract key concepts and main ideas
3. Generate comprehensive markdown bullet-point notes that capture all key concepts and details

The user should fully understand the topic after reading your notes.

Always format your output as markdown with:
- H2 heading for main topics
- Bullet points with clear hierarchy
- Key takeaways section at the end`;

  const userMessage = `Please analyze this YouTube video transcript and generate comprehensive markdown notes:

---TRANSCRIPT START---
${transcript}
---TRANSCRIPT END---

Generate detailed, structured markdown notes that cover all main topics and key points.`;

  try {
    // Call Ollama's OpenAI-compatible chat endpoint directly
    const chatUrl = `${config.ollamaUrl}/v1/chat/completions`;

    const response = await fetch(chatUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Ollama API error (${response.status}): ${errorBody}`
      );
    }

    const data = (await response.json()) as {
      choices: Array<{ message: { content: string } }>;
    };

    if (data.choices?.[0]?.message?.content) {
      return data.choices[0].message.content;
    } else {
      throw new Error("Ollama returned unexpected response format");
    }
  } catch (error) {
    console.error("Agent error:", error);
    throw error;
  }
}

export interface MCPServer {
  name: string;
  description?: string;
  status: "connected" | "disconnected";
}

export function getMCPServers(): MCPServer[] {
  // Placeholder for future MCP integration
  // This will be expanded as MCPs are connected
  return [];
}
