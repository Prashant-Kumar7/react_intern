import { useMemo, useEffect, useRef } from "react";
import { useAllInteractions } from "@/hooks/useImages";
import { useInstantImages } from "@/hooks/useImages";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStore } from "@/lib/store";
import { Heart } from "lucide-react";
import type { Image, Reaction, Comment } from "@/lib/instantdb";

export function Feed() {
  const { reactions, comments } = useAllInteractions();
  const { images } = useInstantImages();
  const setSelectedImage = useStore((state) => state.setSelectedImage);
  const previousInteractionIds = useRef<Set<string>>(new Set());
  const isInitialMount = useRef(true);

  const imagesMap = useMemo(() => {
    return new Map(images.map((img: Image) => [img.id, img]));
  }, [images]);

  // Combine and sort all interactions by timestamp
  const allInteractions = useMemo(() => {
    const items: Array<{
      type: "reaction" | "comment";
      id: string;
      timestamp: number;
      userId: string;
      userName?: string;
      userColor?: string;
      emoji?: string;
      text?: string;
      imageId: string;
    }> = [];

    reactions.forEach((reaction: Reaction) => {
      items.push({
        type: "reaction",
        id: reaction.id,
        timestamp: reaction.createdAt,
        userId: reaction.userId,
        userName: (reaction as any).userName || undefined,
        userColor: (reaction as any).userColor || undefined,
        emoji: reaction.emoji,
        imageId: reaction.imageId,
      });
    });

    comments.forEach((comment: Comment) => {
      items.push({
        type: "comment",
        id: comment.id,
        timestamp: comment.createdAt,
        userId: comment.userId,
        userName: comment.userName,
        userColor: comment.userColor,
        text: comment.text,
        imageId: comment.imageId,
      });
    });

    return items.sort((a, b) => b.timestamp - a.timestamp);
  }, [reactions, comments]);

  // Track new items for animation
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousInteractionIds.current = new Set(allInteractions.map((item) => item.id));
      return;
    }
    
    const currentIds = new Set(allInteractions.map((item) => item.id));
    previousInteractionIds.current = currentIds;
  }, [allInteractions]);

  const handleImageClick = (imageId: string) => {
    const image = imagesMap.get(imageId);
    if (image) {
      setSelectedImage(imageId, {
        id: image.id,
        unsplashId: image.unsplashId,
        url: image.url,
        thumbUrl: image.thumbUrl,
        description: image.description,
        author: image.author,
      });
    } else {
      setSelectedImage(imageId);
    }
  };

  if (allInteractions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground text-center">
            No activity yet. Start interacting with images to see the feed!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Activity Feed</h2>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-3">
            {allInteractions.map((interaction, index) => {
              const image = imagesMap.get(interaction.imageId);
              const imageDescription =
                image?.description || `Image ${interaction.imageId.slice(0, 8)}`;
              // Animate items that are likely new (first few or recently added)
              const shouldAnimate = index < 5 || 
                (interaction.timestamp && Date.now() - interaction.timestamp < 5000);

              return (
                <div
                  key={interaction.id}
                  className={`flex gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer ${
                    shouldAnimate ? "animate-feed-item" : ""
                  }`}
                  onClick={() => handleImageClick(interaction.imageId)}
                  style={{
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  <div className="flex-shrink-0">
                    {interaction.type === "reaction" ? (
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Heart className="h-5 w-5 text-primary" />
                      </div>
                    ) : (
                      <Avatar
                        style={{
                          backgroundColor:
                            interaction.userColor || "#3b82f6",
                        }}
                        className="h-10 w-10"
                      >
                        <AvatarFallback className="text-xs text-white">
                          {interaction.userName
                            ? interaction.userName.charAt(0).toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      {interaction.type === "reaction" ? (
                        <>
                          <span
                            className="font-medium"
                            style={{ color: interaction.userColor || "#3b82f6" }}
                          >
                            {interaction.userName || "Someone"}
                          </span>{" "}
                          reacted <span className="text-lg">{interaction.emoji}</span> to{" "}
                          <span className="font-medium">{imageDescription}</span>
                        </>
                      ) : (
                        <>
                          <span
                            className="font-medium"
                            style={{ color: interaction.userColor }}
                          >
                            {interaction.userName}
                          </span>{" "}
                          commented on{" "}
                          <span className="font-medium">{imageDescription}</span>
                          <div className="mt-1 text-muted-foreground">
                            {interaction.text}
                          </div>
                        </>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(interaction.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

