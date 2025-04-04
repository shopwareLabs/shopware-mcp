import { MCPTool } from "mcp-framework";
import { z } from "zod";

// Define the structure of a single search result
interface ShopwareDocResult {
  id: string;
  similarity: number;
  content: string;
}

interface SearchDocsInput {
  query: string;
}

class SearchDocs extends MCPTool<SearchDocsInput> {
  name = "search_shopware_docs";
  description = "Search in Shopware Documentation";

  schema = {
    query: {
      type: z.string(),
      description: "Query to search in Shopware Documentation",
    },
  };

  async execute(input: SearchDocsInput) {
    try {
      // Use a two-step fetch approach to handle the response safely
      const rawResponse = await fetch('https://copilot.swag-infra.com/search?limit=3&query=' + encodeURIComponent(input.query));
      const results = await rawResponse.json() as ShopwareDocResult[];

      const text = results.map(result => result.content).join("\n\n");
      return text;
    } catch (error) {
      console.error('Error searching Shopware docs:', error);
      throw new Error(`Failed to search Shopware docs: ${error}`);
    }
  }
}

export default SearchDocs;