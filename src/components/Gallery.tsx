import { useCallback, useEffect, useMemo } from "react";
import { useUnsplashImages, useInstantImages } from "@/hooks/useImages";
import { ImageCard } from "./ImageCard";
import { useStore } from "@/lib/store";
import { db, id, type Image } from "@/lib/instantdb";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function Gallery() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useUnsplashImages();
  const { images: instantImages } = useInstantImages();
  const setSelectedImage = useStore((state) => state.setSelectedImage);

  // Create a map of instant images by unsplashId
  const instantImagesMap = useMemo(() => {
    return new Map(instantImages.map((img: Image) => [img.unsplashId, img]));
  }, [instantImages]);

  // Sync Unsplash images to InstantDB
  useEffect(() => {
    if (!data?.pages) return;

    const syncImages = async () => {
      const allImages = data.pages.flat();
      
      for (const unsplashImage of allImages) {
        // Check if image already exists in InstantDB by unsplashId
        const exists = Array.from(instantImagesMap.values()).some(
          (img: Image) => img.unsplashId === unsplashImage.id
        );
        
        if (!exists) {
          // Add to InstantDB
          const imageId = id();
          await db.transact(
            (db.tx as any).images[imageId].update({
              unsplashId: unsplashImage.id,
              url: unsplashImage.urls.regular,
              thumbUrl: unsplashImage.urls.thumb,
              description: unsplashImage.description || unsplashImage.alt_description,
              author: unsplashImage.user.name,
              createdAt: Date.now(),
            })
          );
        }
      }
    };

    syncImages();
  }, [data, instantImagesMap]);

  // Get all images (combine Unsplash and InstantDB data)
  const allImages = useMemo(() => {
    if (!data?.pages) return [];
    
    const unsplashImages = data.pages.flat();
    return unsplashImages.map((unsplashImg) => {
      // Find InstantDB image by unsplashId
      const instantImg = Array.from(instantImagesMap.values()).find(
        (img: Image) => img.unsplashId === unsplashImg.id
      );
      return {
        id: instantImg?.id || unsplashImg.id, // Use unsplashId as fallback
        unsplashId: unsplashImg.id,
        url: unsplashImg.urls.regular,
        thumbUrl: unsplashImg.urls.thumb,
        description: unsplashImg.description || unsplashImg.alt_description,
        author: unsplashImg.user.name,
      };
    });
  }, [data, instantImagesMap]);

  const handleImageClick = useCallback(
    (image: { id: string; url: string; thumbUrl: string; description: string | null; author: string; unsplashId: string }) => {
      // Find the InstantDB image if it exists
      const instantImg = Array.from(instantImagesMap.values()).find(
        (img: Image) => img.unsplashId === image.unsplashId
      );
      const finalId = instantImg?.id || image.id;
      setSelectedImage(finalId, {
        id: finalId,
        unsplashId: image.unsplashId,
        url: image.url,
        thumbUrl: image.thumbUrl,
        description: image.description,
        author: image.author,
      });
    },
    [setSelectedImage, instantImagesMap]
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allImages.map((image) => (
          <ImageCard
            key={image.id}
            imageId={image.id}
            thumbUrl={image.thumbUrl}
            description={image.description}
            author={image.author}
            onClick={() => handleImageClick(image)}
          />
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center py-6">
          <Button
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
            variant="outline"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

