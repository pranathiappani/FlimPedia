import express from "express";
import cors from "cors";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import OpenAI from "openai";
import dotenv from "dotenv";
import process from "node:process";

dotenv.config();
// Fix for Windows SSL "UNABLE_TO_VERIFY_LEAF_SIGNATURE" error when fetching TMDB
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

let mcpClient: Client | null = null;
let aiTools: any[] = [];

// Initialize MCP Client once when the server starts
async function initMcp() {
    console.log("Starting MCP Client...");
    const transport = new StdioClientTransport({
        command: "node",
        args: ["index.js"],
        env: {
            ...process.env,
            TMDB_API_KEY: process.env.TMDB_API_KEY || ""
        } as Record<string, string>
    });

    mcpClient = new Client({ name: "FlimpediaBot", version: "1.0.0" }, { capabilities: {} });
    await mcpClient.connect(transport);
    console.log("Connected to Flimpedia MCP Server!");

    const toolsResponse = await mcpClient.listTools();
    aiTools = toolsResponse.tools.map(tool => ({
        type: "function",
        function: {
            name: tool.name,
            description: tool.description || "",
            parameters: tool.inputSchema,
        }
    }));
}

// The Chat Endpoint
app.post("/chat", async (req, res) => {
    try {
        const userMessages = req.body.messages || [];
        
        const messages = [
            { role: "system", content: "You are a helpful movie assistant with live access to TMDB. If the user asks about movies, you MUST use your tools to answer. If the user just says hello or greets you, simply greet them back politely without using any tools. Format answers cleanly. CRITICAL RULE: NEVER mention technical errors, tool failures, or say things like 'let me try again'. If a search fails, smoothly transition to a helpful conversational response without apologizing for the system." },
            ...userMessages
        ];

        console.log("Sending request to Groq...");
        const response = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: messages,
            tools: aiTools,
        });

        const responseMessage: any = response.choices[0]?.message;

        // If AI decides to use a tool
        if (responseMessage?.tool_calls) {
            messages.push(responseMessage);

            for (const toolCall of responseMessage.tool_calls) {
                console.log(`=> AI is calling tool: ${toolCall.function.name}`);
                
                const args = JSON.parse(toolCall.function.arguments || "{}") || {};
                const toolResult = await mcpClient!.callTool({
                    name: toolCall.function.name,
                    arguments: args
                });

                messages.push({
                    role: "tool",
                    tool_call_id: toolCall.id,
                    content: JSON.stringify(toolResult.content),
                });
            }

            console.log("=> Waiting for AI to read tool data...");
            const finalResponse: any = await openai.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: messages,
            });

            res.json({ reply: finalResponse.choices[0]?.message?.content });
        } else {
            // If AI just answered normally
            res.json({ reply: responseMessage.content });
        }
    } catch (error) {
        console.error("Chat error:", error);
        res.status(500).json({ error: "Failed to generate response." });
    }
});

const PORT = 3001;
app.listen(PORT, async () => {
    await initMcp();
    console.log(`Flimpedia API is running on http://localhost:${PORT}`);
});
