import { QueryClient, isServer } from "@tanstack/react-query";

// Function to create a new QueryClient
function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false, retry: 1,
      },
    },
  });
}

// Singleton for browser query client
let browserQueryClient: QueryClient | undefined;

/**
 * Returns a QueryClient instance
 * - Creates a new one on the server
 * - Reuses the singleton on the client
 */
export function getQueryClient(): QueryClient {
  if (isServer) {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}
