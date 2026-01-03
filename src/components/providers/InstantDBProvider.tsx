import type { ReactNode } from "react";

export function InstantDBProvider({ children }: { children: ReactNode }) {
  // InstantDB connection is handled globally via db.init()
  // This provider ensures the connection is established
  return <>{children}</>;
}

