import { db, id } from "@/lib/instantdb";
import { useStore } from "@/lib/store";

export function useImageActions() {
  const user = useStore((state) => state.user);

  const addReaction = async (imageId: string, emoji: string) => {
    if (!user) {
      console.warn("No user found, cannot add reaction");
      return;
    }
    console.log("addReaction called:", { imageId, emoji, userId: user.id });

    // Check if user already reacted with this emoji
    const existingReactions = await db.query({
      reactions: {},
    });

    const userReaction = existingReactions.data?.reactions?.find(
      (r) => r.imageId === imageId && r.userId === user.id && r.emoji === emoji
    );

    if (userReaction) {
      // Remove existing reaction
      await db.transact(db.tx.reactions[userReaction.id].delete());
    } else {
      // Add new reaction with user info for feed display
      const reactionId = id();
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
        } catch (retryError) {
          console.error("Failed to add reaction after retry", retryError);
        }
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
    if (!user) return;

    // Verify ownership before deleting
    const comments = await db.query({
      comments: {},
    });

    const comment = comments.data?.comments?.find((c) => c.id === commentId);

    if (comment && comment.userId === user.id) {
      await db.transact(db.tx.comments[commentId].delete());
    }
  };

  const deleteReaction = async (reactionId: string) => {
    if (!user) {
      console.warn("No user found, cannot delete reaction");
      return;
    }

    console.log("deleteReaction called:", { reactionId, userId: user.id });

    // Verify ownership before deleting
    const reactions = await db.query({
      reactions: {},
    });

    const reaction = reactions.data?.reactions?.find((r) => r.id === reactionId);

    if (reaction && reaction.userId === user.id) {
      console.log("Deleting reaction:", reactionId);
      await db.transact(db.tx.reactions[reactionId].delete());
    } else {
      console.warn("Cannot delete reaction - not owned by user", {
        reactionUserId: reaction?.userId,
        currentUserId: user.id,
      });
    }
  };

  return {
    addReaction,
    addComment,
    deleteComment,
    deleteReaction,
  };
}

