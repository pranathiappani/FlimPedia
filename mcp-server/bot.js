import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});
async function runBot() {
    console.log("Starting MCP Client...");
    const transport = new StdioClientTransport({
        command: "node",
        args: ["index.js"],
        env: {
            ...process.env,
            TMDB_API_KEY: process.env.TMDB_API_KEY || ""
        }
    });
    const mcpClient = new Client({ name: "FlimpediaBot", version: "1.0.0" }, { capabilities: {} });
    await mcpClient.connect(transport);
    console.log("Connected to Flimpedia MCP Server!");
    const toolsResponse = await mcpClient.listTools();
    // We add ": any[]" to stop TypeScript from complaining about strict types
    const aiTools = toolsResponse.tools.map(tool => ({
        type: "function",
        function: {
            name: tool.name,
            description: tool.description || "", // Added fallback for undefined
            parameters: tool.inputSchema,
        }
    }));
    console.log("Asking the AI: 'Search for the movie The Matrix and give me a summary.'");
    const messages = [
        { role: "system", content: "You are a helpful movie assistant with live access to TMDB. You MUST use your tools to answer questions. Never say you don't have real-time information." },
        { role: "user", content: "Suggest me some best thriller movies" }
    ];
    const response = await openai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: messages,
        tools: aiTools,
    });
    // Treat as 'any' to bypass strict object checks
    const responseMessage = response.choices[0]?.message;
    if (responseMessage?.tool_calls) {
        messages.push(responseMessage);
        for (const toolCall of responseMessage.tool_calls) {
            console.log(`\n=> AI decided to call your tool: ${toolCall.function.name}`);
            // If the AI provides no arguments, default to an empty object {}
            const args = JSON.parse(toolCall.function.arguments || "{}") || {};
            const toolResult = await mcpClient.callTool({
                name: toolCall.function.name,
                arguments: args
            });
            console.log("=> Tool executed successfully. Here is the raw data from your MCP Server:");
            console.log(JSON.stringify(toolResult.content, null, 2));
            console.log("=> Sending TMDB data back to AI...");
            messages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: JSON.stringify(toolResult.content),
            });
        }
        console.log("\nWaiting for AI to read the data and answer...\n");
        const finalResponse = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: messages,
        });
        console.log("🤖 FINAL ANSWER:");
        console.log("-----------------------------------------");
        console.log(finalResponse.choices[0]?.message?.content);
        console.log("-----------------------------------------");
    }
}
runBot().catch(console.error);
//# sourceMappingURL=bot.js.map