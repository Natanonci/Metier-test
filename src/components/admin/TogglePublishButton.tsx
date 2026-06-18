"use client";

import { Switch } from "@/components/ui/switch";
import { togglePublish } from "@/app/actions/admin";
import { toast } from "sonner";
import { useTableAction } from "@/components/admin/TableActionProvider";

export function TogglePublishButton({ id, isPublished }: { id: string; isPublished: boolean }) {
  const { isPending, startAction } = useTableAction();

  return (
    <Switch
      checked={isPublished}
      disabled={isPending}
      onCheckedChange={(checked) => {
        startAction(`publish-${id}`, async () => {
          const res = await togglePublish(id, checked);
          if (res && !res.success) {
            toast.error("เกิดข้อผิดพลาดในการเปลี่ยนสถานะ");
          } else {
            toast.success(checked ? "เผยแพร่บทความแล้ว" : "ยกเลิกการเผยแพร่บทความแล้ว");
          }
        });
      }}
    />
  );
}
