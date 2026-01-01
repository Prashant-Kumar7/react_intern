import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { fetchUnsplashImages } from "@/lib/unsplash";
import { db } from "@/lib/instantdb";

export function useUnsplashImages() {
  return useInfiniteQuery({
    queryKey: ["unsplash-images"],
    queryFn: ({ pageParam = 1 }) => fetchUnsplashImages(pageParam, 20),
    getNextPageParam: (lastPage, allPages) => {
      // Continue fetching if we got results
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
}

export function useInstantImages() {
  const { data, isLoading } = db.useQuery({
    images: {},
  });

  return {
    images: (data?.images || []).sort((a, b) => b.createdAt - a.createdAt),
    isLoading,
  };
}

export function useImageReactions(imageId: string) {
  const { data, isLoading } = db.useQuery({
    reactions: {},
  });

  const filteredReactions = (data?.reactions || [])
    .filter((r) => r.imageId === imageId)
    .sort((a, b) => b.createdAt - a.createdAt);

  // Debug logging
  if (imageId && filteredReactions.length > 0) {
    console.log(`Reactions for image ${imageId}:`, filteredReactions);
  }

  return {
    reactions: filteredReactions,
    isLoading,
  };
}

export function useImageComments(imageId: string) {
  const { data, isLoading } = db.useQuery({
    comments: {},
  });

  return {
    comments: (data?.comments || [])
      .filter((c) => c.imageId === imageId)
      .sort((a, b) => a.createdAt - b.createdAt),
    isLoading,
  };
}

export function useAllInteractions() {
  const { data, isLoading } = db.useQuery({
    reactions: {},
    comments: {},
  });

  return {
    reactions: (data?.reactions || []).sort((a, b) => b.createdAt - a.createdAt),
    comments: (data?.comments || []).sort((a, b) => b.createdAt - a.createdAt),
    isLoading,
  };
}

