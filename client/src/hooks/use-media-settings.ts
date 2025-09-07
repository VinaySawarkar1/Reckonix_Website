import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface MediaSettings {
  heroVideo: string;
  homeAboutImage: string;
  aboutPageImage: string;
  updatedAt?: string;
}

export function useMediaSettings() {
  return useQuery<MediaSettings>({
    queryKey: ['mediaSettings'],
    queryFn: async () => {
      const response = await fetch('/api/media/settings');
      if (!response.ok) throw new Error('Failed to fetch media settings');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}
