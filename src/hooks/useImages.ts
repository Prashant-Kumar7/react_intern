import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchUnsplashImages } from "@/lib/unsplash";
import { db, type Image, type Reaction, type Comment } from "@/lib/instantdb";

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
  } as any) as { data?: { images?: Image[] }; isLoading: boolean };

  return {
    images: ((data?.images || []) as Image[]).sort((a, b) => b.createdAt - a.createdAt),
    isLoading,
  };
}

export function useImageReactions(imageId: string) {
  const { data, isLoading } = db.useQuery({
    reactions: {},
  } as any) as { data?: { reactions?: Reaction[] }; isLoading: boolean };

  const filteredReactions = ((data?.reactions || []) as Reaction[])
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
  } as any) as { data?: { comments?: Comment[] }; isLoading: boolean };

  return {
    comments: ((data?.comments || []) as Comment[])
      .filter((c) => c.imageId === imageId)
      .sort((a, b) => a.createdAt - b.createdAt),
    isLoading,
  };
}

export function useAllInteractions() {
  const { data, isLoading } = db.useQuery({
    reactions: {},
    comments: {},
  } as any) as { data?: { reactions?: Reaction[]; comments?: Comment[] }; isLoading: boolean };

  return {
    reactions: ((data?.reactions || []) as Reaction[]).sort((a, b) => b.createdAt - a.createdAt),
    comments: ((data?.comments || []) as Comment[]).sort((a, b) => b.createdAt - a.createdAt),
    isLoading,
  };
}

