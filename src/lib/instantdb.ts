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

// Type helpers
export type Image = Schema["images"];
export type Reaction = Schema["reactions"];
export type Comment = Schema["comments"];

// Initialize InstantDB
// Note: Replace with your actual InstantDB app ID
// Get it from https://instantdb.com after creating an app
const APP_ID = import.meta.env.VITE_INSTANTDB_APP_ID || "";

// @ts-expect-error - InstantDB's init function expects a different schema format internally,
// but our Schema type correctly represents the data structure we're using
export const db = init<Schema>({ appId: APP_ID } as any);
export { id };

