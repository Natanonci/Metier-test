"use client";

import { Button } from "@/components/ui/button";
import { Check, X, Trash2, RefreshCw, Loader2 } from "lucide-react";
import { updateCommentStatus, deleteComment, hardDeleteComment } from "@/app/actions/comment";
import { CommentStatus } from "@prisma/client";
import { toast } from "sonner";
import { useTableAction } from "@/components/admin/TableActionProvider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function CommentActionButtons({ commentId, status }: { commentId: string; status: string }) {
  const { isPending, loadingAction, startAction } = useTableAction();

  const handleUpdateStatus = (newStatus: CommentStatus) => {
    startAction(`updateStatus-${newStatus}-${commentId}`, async () => {
      const res = await updateCommentStatus(commentId, newStatus);
      if (res && !res.success) {
        toast.error("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
      } else {
        if (newStatus === "APPROVED") toast.success("ยืนยันคอมเมนต์เรียบร้อยแล้ว");
        else if (newStatus === "REJECTED") toast.error("ปฏิเสธคอมเมนต์แล้ว");
        else if (newStatus === "PENDING") toast.success("กู้คืนคอมเมนต์เรียบร้อยแล้ว");
      }
    });
  };

  const handleDelete = () => {
    startAction(`delete-${commentId}`, async () => {
      const res = await deleteComment(commentId);
      if (res && !res.success) {
        toast.error("เกิดข้อผิดพลาดในการลบข้อมูล");
      } else {
        toast.error("ลบคอมเมนต์เรียบร้อยแล้ว");
      }
    });
  };

  const handleHardDelete = () => {
    startAction(`hardDelete-${commentId}`, async () => {
      const res = await hardDeleteComment(commentId);
      if (res && !res.success) {
        toast.error("เกิดข้อผิดพลาดในการลบข้อมูลถาวร");
      } else {
        toast.error("ลบคอมเมนต์เรียบร้อยแล้ว");
      }
    });
  };

  return (
    <div className="flex items-center justify-end space-x-2">
      {status === "DELETED" ? (
        <>
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => handleUpdateStatus("PENDING")}
            className="h-8 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100"
          >
            {loadingAction === `updateStatus-PENDING-${commentId}` ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />} 
            {loadingAction === `updateStatus-PENDING-${commentId}` ? "กำลังกู้คืน..." : "Restore"}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger render={
              <Button
                variant="outline"
                size="sm"
                disabled={isPending}
                className="h-8 text-destructive border-red-200 bg-red-50 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Permanently Delete
              </Button>
            } />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>คุณแน่ใจหรือไม่ที่จะลบคอมเมนต์นี้ถาวร?</AlertDialogTitle>
                <AlertDialogDescription>
                  การกระทำนี้ไม่สามารถยกเลิกได้ คอมเมนต์นี้จะถูกลบออกจากระบบอย่างถาวร
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleHardDelete} disabled={isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  {loadingAction === `hardDelete-${commentId}` && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loadingAction === `hardDelete-${commentId}` ? "กำลังลบ..." : "Confirm"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : (
        <>
          {status !== "APPROVED" && (
            <Button
              variant="outline"
              size="icon"
              disabled={isPending}
              onClick={() => handleUpdateStatus("APPROVED")}
              className="h-8 w-8 text-green-600 border-green-200 bg-green-50 hover:bg-green-100"
            >
              {loadingAction === `updateStatus-APPROVED-${commentId}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            </Button>
          )}
          {status !== "REJECTED" && (
            <Button
              variant="outline"
              size="icon"
              disabled={isPending}
              onClick={() => handleUpdateStatus("REJECTED")}
              className="h-8 w-8 text-destructive border-red-200 bg-red-50 hover:bg-red-100"
            >
              {loadingAction === `updateStatus-REJECTED-${commentId}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger render={
              <Button
                variant="outline"
                size="icon"
                disabled={isPending}
                className="h-8 w-8 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
              >
                {loadingAction === `delete-${commentId}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </Button>
            } />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>คุณแน่ใจหรือไม่ที่จะลบคอมเมนต์นี้?</AlertDialogTitle>
                <AlertDialogDescription>
                  คอมเมนต์จะถูกซ่อนจากหน้าเว็บและย้ายไปอยู่ในสถานะลบ (สามารถกู้คืนได้)
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  {loadingAction === `delete-${commentId}` && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loadingAction === `delete-${commentId}` ? "กำลังลบ..." : "Confirm"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
