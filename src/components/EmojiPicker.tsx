import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";

interface EmojiPickerButtonProps {
  onEmojiClick: (emoji: string) => void;
  className?: string;
}

// Define the emoji data type based on emoji-picker-react's callback
interface EmojiData {
  emoji: string;
  unified: string;
  originalUnified?: string;
  names?: string[];
  activeSkinTone?: string;
}

export function EmojiPickerButton({ onEmojiClick, className }: EmojiPickerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiClick = (emojiData: EmojiData) => {
    console.log("Emoji clicked:", emojiData);
    if (emojiData?.emoji) {
      onEmojiClick(emojiData.emoji);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative inline-block">
      <Button
        variant="outline"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={className}
        type="button"
      >
        <Smile className="h-4 w-4" />
      </Button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            style={{ backgroundColor: "transparent" }}
          />
          <div 
            className="absolute bottom-full right-0 mb-2 z-[100]"
            style={{ position: "absolute" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-background rounded-lg shadow-lg border p-1">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width={350}
                height={400}
                previewConfig={{ showPreview: false }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

