import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useImageReactions, useImageComments } from "@/hooks/useImages";
import { useImageActions } from "@/hooks/useImageActions";
import { useStore } from "@/lib/store";
import { useInstantImages } from "@/hooks/useImages";
import { EmojiPickerButton } from "./EmojiPicker";
import { Trash2, Send } from "lucide-react";
import type { Image, Reaction, Comment } from "@/lib/instantdb";

interface ImageModalProps {
  imageId: string | null;
  onClose: () => void;
}

export function ImageModal({ imageId, onClose }: ImageModalProps) {
  const [commentText, setCommentText] = useState("");
  const commentInputRef = useRef<HTMLInputElement>(null);
  const { reactions } = useImageReactions(imageId || "");
  const { comments } = useImageComments(imageId || "");
  const { addReaction, addComment, deleteComment, deleteReaction } =
    useImageActions();
  const user = useStore((state) => state.user);
  const { images } = useInstantImages();

  // Find image by ID or unsplashId (for images not yet synced)
  const selectedImageData = useStore((state) => state.selectedImageData);
  const image = images.find((img: Image) => img.id === imageId || img.unsplashId === imageId);
  
  // Use selectedImageData if available, otherwise use InstantDB image
  const displayImage = selectedImageData || image;

  // Group reactions by emoji
  const reactionGroups = reactions.reduce((acc: Record<string, Reaction[]>, reaction: Reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = [];
    }
    acc[reaction.emoji].push(reaction);
    return acc;
  }, {} as Record<string, Reaction[]>);

  const handleEmojiClick = async (emoji: string) => {
    if (!imageId || !user) return;

    // Check if user already has this reaction
    const existingReaction = reactions.find(
      (r: Reaction) => r.userId === user.id && r.emoji === emoji
    );

    if (existingReaction) {
      // Toggle off - remove reaction
      await addReaction(imageId, emoji, existingReaction.id);
    } else {
      // Add new reaction
      await addReaction(imageId, emoji);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && imageId) {
      addComment(imageId, commentText);
      setCommentText("");
    }
  };

  // Auto-scroll to bottom when new comments arrive
  const commentsEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  if (!displayImage) {
    return null;
  }

  return (
    <Dialog open={!!imageId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col">
        <div className="grid md:grid-cols-2 gap-0 h-full max-h-[90vh]">
          {/* Image Section */}
          <div className="relative bg-black/5 flex items-center justify-center min-h-[300px] md:min-h-0">
            <img
              src={displayImage.url}
              alt={displayImage.description || "Gallery image"}
              className="max-w-full max-h-[70vh] object-contain"
            />
          </div>

          {/* Interactions Section */}
          <div className="flex flex-col h-full max-h-[90vh] border-l">
            <DialogHeader className="p-4 border-b">
              <DialogTitle className="text-lg">
                {displayImage.description || "Image"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">by {displayImage.author}</p>
            </DialogHeader>

            {/* Reactions */}
            <div className="p-4 border-b space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                {Object.entries(reactionGroups).map(([emoji, emojiReactions]) => {
                  const isUserReaction = emojiReactions.some(
                    (r: Reaction) => r.userId === user?.id
                  );
                  const userReaction = emojiReactions.find(
                    (r: Reaction) => r.userId === user?.id
                  );
                  return (
                    <div key={emoji} className="flex items-center gap-1">
                      <Button
                        variant={isUserReaction ? "default" : "outline"}
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => handleEmojiClick(emoji)}
                      >
                        <span>{emoji}</span>
                        <span className="ml-1">{emojiReactions.length}</span>
                      </Button>
                      {userReaction && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-70 hover:opacity-100"
                          onClick={() => deleteReaction(userReaction.id)}
                          title="Delete your reaction"
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      )}
                    </div>
                  );
                })}
                <EmojiPickerButton
                  onEmojiClick={handleEmojiClick}
                  className="h-8 w-8"
                />
              </div>
            </div>

            {/* Comments */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  comments.map((comment: Comment) => (
                    <div
                      key={comment.id}
                      className="flex gap-3 animate-in fade-in slide-in-from-bottom-2"
                    >
                      <Avatar
                        style={{ backgroundColor: comment.userColor }}
                        className="h-8 w-8"
                      >
                        <AvatarFallback className="text-xs text-white">
                          {comment.userName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-sm font-medium"
                            style={{ color: comment.userColor }}
                          >
                            {comment.userName}
                          </span>
                          {comment.userId === user?.id && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 opacity-70 hover:opacity-100"
                              onClick={() => deleteComment(comment.id)}
                              title="Delete your comment"
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          )}
                        </div>
                        <p className="text-sm">{comment.text}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={commentsEndRef} />
              </div>
            </ScrollArea>

            {/* Comment Input */}
            <div className="p-4 border-t">
              <form onSubmit={handleCommentSubmit} className="flex gap-2">
                <Input
                  ref={commentInputRef}
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!commentText.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

