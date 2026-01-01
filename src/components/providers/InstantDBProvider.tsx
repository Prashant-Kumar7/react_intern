import { ReactNode } from "react";
import { db } from "@/lib/instantdb";

export function InstantDBProvider({ children }: { children: ReactNode }) {
  // InstantDB connection is handled globally via db.init()
  // This provider ensures the connection is established
  return <>{children}</>;
}

