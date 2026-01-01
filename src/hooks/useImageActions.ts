import { db, id } from "@/lib/instantdb";
import { useStore } from "@/lib/store";

export function useImageActions() {
  const user = useStore((state) => state.user);

  const addReaction = async (imageId: string, emoji: string, existingReactionId?: string) => {
    if (!user) {
      console.warn("No user found, cannot add reaction");
      return;
    }
    console.log("addReaction called:", { imageId, emoji, userId: user.id, existingReactionId });

    // If existingReactionId is provided, remove it (toggle off)
    if (existingReactionId) {
      console.log("Removing existing reaction:", existingReactionId);
      try {
        await db.transact(db.tx.reactions[existingReactionId].delete());
        console.log("Reaction removed successfully");
      } catch (error) {
        console.error("Failed to remove reaction:", error);
      }
      return;
    }

    // Add new reaction with user info for feed display
    const reactionId = id();
    try {
      console.log("Attempting to add reaction:", {
        reactionId,
        imageId,
        userId: user.id,
        emoji,
      });
      
      const transaction = db.tx.reactions[reactionId].update({
        imageId,
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        emoji,
        createdAt: Date.now(),
      });
      
      console.log("Transaction object:", transaction);
      const result = await db.transact(transaction);
      
      console.log("Reaction added successfully:", result);
    } catch (error) {
      // Conflict handling: retry once if transaction fails
      console.error("Failed to add reaction, retrying...", error);
      try {
        await db.transact(
          db.tx.reactions[reactionId].update({
            imageId,
            userId: user.id,
            userName: user.name,
            userColor: user.color,
            emoji,
            createdAt: Date.now(),
          })
        );
        console.log("Reaction added successfully on retry");
      } catch (retryError) {
        console.error("Failed to add reaction after retry", retryError);
      }
    }
  };

  const addComment = async (imageId: string, text: string) => {
    if (!user) return;

    const commentId = id();
    try {
      await db.transact(
        db.tx.comments[commentId].update({
          imageId,
          userId: user.id,
          userName: user.name,
          userColor: user.color,
          text: text.trim(),
          createdAt: Date.now(),
        })
      );
    } catch (error) {
      // Conflict handling: retry once if transaction fails
      console.error("Failed to add comment, retrying...", error);
      try {
        await db.transact(
          db.tx.comments[commentId].update({
            imageId,
            userId: user.id,
            userName: user.name,
            userColor: user.color,
            text: text.trim(),
            createdAt: Date.now(),
          })
        );
      } catch (retryError) {
        console.error("Failed to add comment after retry", retryError);
      }
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!user) {
      console.warn("No user found, cannot delete comment");
      return;
    }

    console.log("deleteComment called:", { commentId, userId: user.id });
    
    // Delete directly - InstantDB will handle permissions if configured
    // Components should verify ownership before calling this
    try {
      await db.transact(db.tx.comments[commentId].delete());
      console.log("Comment deleted successfully");
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const deleteReaction = async (reactionId: string) => {
    if (!user) {
      console.warn("No user found, cannot delete reaction");
      return;
    }

    console.log("deleteReaction called:", { reactionId, userId: user.id });

    // Delete directly - InstantDB will handle permissions if configured
    // Components should verify ownership before calling this
    try {
      await db.transact(db.tx.reactions[reactionId].delete());
      console.log("Reaction deleted successfully");
    } catch (error) {
      console.error("Failed to delete reaction:", error);
    }
  };

  return {
    addReaction,
    addComment,
    deleteComment,
    deleteReaction,
  };
}

