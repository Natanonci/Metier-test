"use client";

import { useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { togglePublish } from "@/app/actions/admin";

export function TogglePublishButton({ id, isPublished }: { id: string; isPublished: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Switch
      checked={isPublished}
      disabled={isPending}
      onCheckedChange={(checked) => {
        startTransition(async () => {
          await togglePublish(id, checked);
        });
      }}
    />
  );
}
