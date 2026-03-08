"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function LikeButton({
  promptId,
  initialCount,
  initialLiked = false,
}: {
  promptId: string;
  initialCount: number;
  initialLiked?: boolean;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  async function toggleLike() {
    // Optimistic update
    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);

    // TODO: call Supabase to insert/delete like
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLike}
      className="gap-1.5"
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-colors",
          liked && "fill-red-500 text-red-500"
        )}
      />
      <span className="text-xs">{count}</span>
    </Button>
  );
}
