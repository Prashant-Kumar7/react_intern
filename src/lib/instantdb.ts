import { init, id } from "@instantdb/react";

// InstantDB schema
export type Schema = {
  images: {
    id: string;
    unsplashId: string;
    url: string;
    thumbUrl: string;
    description: string | null;
    author: string;
    createdAt: number;
  };
  reactions: {
    id: string;
    imageId: string;
    userId: string;
    userName?: string;
    userColor?: string;
    emoji: string;
    createdAt: number;
  };
  comments: {
    id: string;
    imageId: string;
    userId: string;
    userName: string;
    userColor: string;
    text: string;
    createdAt: number;
  };
};

// Initialize InstantDB
// Note: Replace with your actual InstantDB app ID
// Get it from https://instantdb.com after creating an app
const APP_ID = import.meta.env.VITE_INSTANTDB_APP_ID || "";

export const db = init<Schema>({ appId: APP_ID });
export { id };

