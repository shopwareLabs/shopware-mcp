import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

interface ShopwareDocResult {
  id: string;
  similarity: number;
  content: string;
}

const server = new McpServer({
  name: "shopware-mcp",
  version: require("../package.json").version
});

server.tool("search_shopware_docs", { query: z.string().describe("Query to search in Shopware Documentation") }, async ({ query }) => {
    const rawResponse = await fetch('https://copilot.swag-infra.com/search?limit=3&query=' + encodeURIComponent(query));
    const results = await rawResponse.json() as ShopwareDocResult[];

    const text = results.map(result => result.content).join("\n\n");
    return { content: [{ type: "text", text }] };
});

const transport = new StdioServerTransport();
await server.connect(transport);