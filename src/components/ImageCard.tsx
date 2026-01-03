import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useImageReactions } from "@/hooks/useImages";
import { useImageActions } from "@/hooks/useImageActions";
import { useStore } from "@/lib/store";
import { EmojiPickerButton } from "./EmojiPicker";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Reaction } from "@/lib/instantdb";

interface ImageCardProps {
  imageId: string;
  thumbUrl: string;
  description: string | null;
  author: string;
  onClick: () => void;
}

export const ImageCard = memo(function ImageCard({
  imageId,
  thumbUrl,
  description,
  author,
  onClick,
}: ImageCardProps) {
  const { reactions } = useImageReactions(imageId);
  const { addReaction, deleteReaction } = useImageActions();
  const user = useStore((state) => state.user);

  // Debug: Log reactions
  console.log(`ImageCard ${imageId} - Reactions:`, reactions);

  // Group reactions by emoji
  const reactionGroups = reactions.reduce((acc: Record<string, Reaction[]>, reaction: Reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = [];
    }
    acc[reaction.emoji].push(reaction);
    return acc;
  }, {} as Record<string, Reaction[]>);

  const handleEmojiClick = async (emoji: string) => {
    console.log("Adding reaction:", emoji, "to image:", imageId, "user:", user?.id);
    if (!emoji || !imageId || !user) {
      console.warn("Missing data:", { emoji, imageId, user: !!user });
      return;
    }

    // Check if user already has this reaction
    const existingReaction = reactions.find(
      (r: Reaction) => r.userId === user.id && r.emoji === emoji
    );

    if (existingReaction) {
      // Toggle off - remove reaction
      console.log("Toggling off reaction:", existingReaction.id);
      await addReaction(imageId, emoji, existingReaction.id);
    } else {
      // Add new reaction
      try {
        await addReaction(imageId, emoji);
        console.log("Reaction added, waiting for update...");
      } catch (error) {
        console.error("Error adding reaction:", error);
      }
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="relative aspect-square overflow-hidden" onClick={onClick}>
        <img
          src={thumbUrl}
          alt={description || "Gallery image"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </div>
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 flex-wrap gap-y-1">
            {Object.entries(reactionGroups).map(([emoji, emojiReactions]) => {
              const isUserReaction = emojiReactions.some((r: Reaction) => r.userId === user?.id);
              const userReaction = emojiReactions.find((r: Reaction) => r.userId === user?.id);
              return (
                <div key={emoji} className="flex items-center gap-1">
                  <Button
                    variant={isUserReaction ? "default" : "outline"}
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEmojiClick(emoji);
                    }}
                  >
                    <span>{emoji}</span>
                    <span className="ml-1">{emojiReactions.length}</span>
                  </Button>
                  {userReaction && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-70 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteReaction(userReaction.id);
                      }}
                      title="Delete your reaction"
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
          <EmojiPickerButton
            onEmojiClick={handleEmojiClick}
            className="h-7 w-7"
          />
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
            {description}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">by {author}</p>
      </CardContent>
    </Card>
  );
});

