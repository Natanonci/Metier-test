"use client";

import { useEffect } from "react";
import { incrementViewCount } from "@/app/actions/blog";

export function ViewTracker({ id }: { id: string }) {
  useEffect(() => {
    incrementViewCount(id);
  }, [id]);

  return null;
}
