import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  color: string;
}

interface ImageData {
  id: string;
  unsplashId: string;
  url: string;
  thumbUrl: string;
  description: string | null;
  author: string;
}

interface AppState {
  user: User | null;
  setUser: (user: User) => void;
  selectedImageId: string | null;
  selectedImageData: ImageData | null;
  setSelectedImage: (id: string | null, data?: ImageData) => void;
}

// Generate a random color for the user
const generateUserColor = (): string => {
  const colors = [
    "#ef4444", // red
    "#f97316", // orange
    "#eab308", // yellow
    "#22c55e", // green
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#06b6d4", // cyan
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Generate a random username
const generateUserName = (): string => {
  const adjectives = ["Cool", "Swift", "Bright", "Bold", "Quick", "Sharp", "Neat", "Calm"];
  const nouns = ["Tiger", "Eagle", "Wolf", "Fox", "Lion", "Bear", "Hawk", "Falcon"];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 1000);
  return `${adj}${noun}${num}`;
};

export const useStore = create<AppState>((set) => {
  // Initialize user from localStorage or create new one
  const storedUser = localStorage.getItem("gallery_user");
  let user: User;
  
  if (storedUser) {
    user = JSON.parse(storedUser);
  } else {
    user = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: generateUserName(),
      color: generateUserColor(),
    };
    localStorage.setItem("gallery_user", JSON.stringify(user));
  }

  return {
    user,
    setUser: (newUser) => {
      localStorage.setItem("gallery_user", JSON.stringify(newUser));
      set({ user: newUser });
    },
    selectedImageId: null,
    selectedImageData: null,
    setSelectedImage: (id, data) => {
      set({ 
        selectedImageId: id,
        selectedImageData: data || null,
      });
    },
  };
});

