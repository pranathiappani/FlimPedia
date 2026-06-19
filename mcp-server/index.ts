import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import process from "node:process";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
if (!TMDB_API_KEY) {
  // We use console.error for logging because console.log is strictly reserved for the AI's data stream!
  console.error("Please provide TMDB_API_KEY in your .env file.");
  process.exit(1);
}

// 1. Initialize the MCP Server
const server = new McpServer({
  name: "Flimpedia Server",
  version: "1.0.0"
});

// 2. Define a Tool for the AI
// The AI will see this description and know it can use this to search for movies.
server.tool(
  "search_movies",
  "Search for movies using the TMDB API",
  {
    // We use Zod to strictly define that the AI MUST provide a string called 'query'
    query: z.string().describe("The search query for the movie title (e.g., 'Inception')"),
  },
  async ({ query }) => {
    console.error(`AI triggered search_movies with query: ${query}`);

    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1&api_key=${TMDB_API_KEY}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          accept: 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok || !data.results) {
        console.error("TMDB API Error Data:", JSON.stringify(data, null, 2));
        return {
          content: [{ type: "text", text: `TMDB API Request Failed: ${data.status_message || JSON.stringify(data)}` }],
          isError: true
        };
      }

      // Format the results to give the AI a clean, readable text response
      const results = data.results.slice(0, 5).map((movie: any) => ({
        title: movie.title,
        release_date: movie.release_date,
        overview: movie.overview
      }));

      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }]
      };
    } catch (error) {
      console.error("TMDB API Error:", error);
      return {
        content: [{ type: "text", text: `Error: ${error}` }],
        isError: true
      };
    }
  }
);

// Tool 2: Get Trending Movies
server.tool(
  "get_trending_movies",
  "Get the top trending movies of the day",
  {}, // Note: This tool doesn't require the AI to provide any input!
  async () => {
    console.error(`AI triggered get_trending_movies`);
    const url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_API_KEY}`;

    try {
      const response = await fetch(url, { headers: { accept: 'application/json' } });
      const data = await response.json();

      if (!response.ok || !data.results) {
        return { content: [{ type: "text", text: `Error: ${JSON.stringify(data)}` }], isError: true };
      }

      const results = data.results.slice(0, 5).map((movie: any) => ({
        title: movie.title,
        release_date: movie.release_date,
        overview: movie.overview
      }));

      return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error}` }], isError: true };
    }
  }
);

// Tool 3: Get Movie Details
server.tool(
  "get_movie_details",
  "Get detailed information about a specific movie (runtime, rating, genres)",
  {
    movie_id: z.number().describe("The TMDB Movie ID (e.g., 27205)"),
  },
  async ({ movie_id }) => {
    console.error(`AI triggered get_movie_details for ID: ${movie_id}`);
    const url = `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${TMDB_API_KEY}&language=en-US`;
    
    try {
      const response = await fetch(url, { headers: { accept: 'application/json' } });
      const data = await response.json();
      
      if (!response.ok) {
        return { content: [{ type: "text", text: `Error: ${data.status_message}` }], isError: true };
      }

      const details = {
        title: data.title,
        runtime: `${data.runtime} minutes`,
        vote_average: data.vote_average,
        genres: data.genres?.map((g: any) => g.name).join(", "),
        tagline: data.tagline
      };

      return { content: [{ type: "text", text: JSON.stringify(details, null, 2) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error}` }], isError: true };
    }
  }
);

// Tool 4: Get Movie Recommendations
server.tool(
  "get_movie_recommendations",
  "Get a list of recommended movies based on a specific movie",
  {
    movie_id: z.number().describe("The TMDB Movie ID of the movie they liked (e.g., 27205)"),
  },
  async ({ movie_id }) => {
    console.error(`AI triggered get_movie_recommendations for ID: ${movie_id}`);
    const url = `https://api.themoviedb.org/3/movie/${movie_id}/recommendations?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
    
    try {
      const response = await fetch(url, { headers: { accept: 'application/json' } });
      const data = await response.json();
      
      if (!response.ok || !data.results) {
        return { content: [{ type: "text", text: `Error: ${data.status_message}` }], isError: true };
      }

      const results = data.results.slice(0, 5).map((movie: any) => ({
        title: movie.title,
        overview: movie.overview
      }));

      return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error}` }], isError: true };
    }
  }
);

// 3. Start the Server
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Flimpedia MCP Server is up and running!");
}

run().catch(console.error);