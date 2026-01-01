import { useCallback } from "react";
import { Gallery } from "@/components/Gallery";
import { Feed } from "@/components/Feed";
import { ImageModal } from "@/components/ImageModal";
import { useStore } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Images, Activity } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

function App() {
  const selectedImageId = useStore((state) => state.selectedImageId);
  const setSelectedImage = useStore((state) => state.setSelectedImage);
  const user = useStore((state) => state.user);

  const handleCloseModal = useCallback(() => {
    setSelectedImage(null);
  }, [setSelectedImage]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Real-Time Gallery</h1>
            <div className="flex items-center gap-4">
              <ModeToggle />
              {user && (
                <div className="flex items-center gap-2">
                  <Avatar
                    style={{ backgroundColor: user.color }}
                    className="h-8 w-8"
                  >
                    <AvatarFallback className="text-xs text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="gallery" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Images className="h-4 w-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="feed" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activity Feed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="mt-0">
            <Gallery />
          </TabsContent>

          <TabsContent value="feed" className="mt-0">
            <Feed />
          </TabsContent>
        </Tabs>
      </main>

      {/* Image Modal */}
      <ImageModal imageId={selectedImageId} onClose={handleCloseModal} />
    </div>
  );
}

export default App;
