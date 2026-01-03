import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";

interface EmojiPickerButtonProps {
  onEmojiClick: (emoji: string) => void;
  className?: string;
}

// Define the emoji data type based on emoji-picker-react's callback
// Note: This interface is kept for documentation but not used directly
// as emoji-picker-react types may vary

export function EmojiPickerButton({ onEmojiClick, className }: EmojiPickerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiClick = (emojiData: any, event?: any) => {
    console.log("Emoji clicked - full data:", emojiData);
    console.log("Event:", event);
    
    // emoji-picker-react v4+ returns emojiObject with emoji property
    // Handle both old and new API formats
    let emoji: string | undefined;
    
    if (typeof emojiData === 'string') {
      emoji = emojiData;
    } else if (emojiData?.emoji) {
      emoji = emojiData.emoji;
    } else if (emojiData?.unified) {
      // Convert unified code to emoji if needed
      emoji = String.fromCodePoint(...emojiData.unified.split('-').map((hex: string) => parseInt(hex, 16)));
    }
    
    if (emoji) {
      console.log("Extracted emoji:", emoji);
      onEmojiClick(emoji);
      setIsOpen(false);
    } else {
      console.error("No emoji found in data:", emojiData);
      // Try to extract from any property
      const allProps = Object.keys(emojiData || {});
      console.error("Available properties:", allProps);
      console.error("Full object:", JSON.stringify(emojiData, null, 2));
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

