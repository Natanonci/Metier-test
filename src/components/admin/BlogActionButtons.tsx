"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Trash2, Edit, Eye, RefreshCw, Loader2 } from "lucide-react";
import { deleteBlog, restoreBlog, hardDeleteBlog } from "@/app/actions/admin";
import { toast } from "sonner";
import Link from "next/link";
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

export function BlogActionButtons({ id, slug, isDeleted }: { id: string, slug: string, isDeleted: boolean }) {
  const { isPending, loadingAction, startAction } = useTableAction();

  const handleSoftDelete = () => {
    startAction(`softDelete-${id}`, async () => {
      const result = await deleteBlog(id);
      if (!result.success) {
        toast.error(result.error || "เกิดข้อผิดพลาดในการลบข้อมูล");
      } else {
        toast.error("ลบบทความเรียบร้อยแล้ว");
      }
    });
  };

  const handleRestore = () => {
    startAction(`restore-${id}`, async () => {
      const result = await restoreBlog(id);
      if (!result.success) {
        toast.error(result.error || "เกิดข้อผิดพลาดในการกู้คืน");
      } else {
        toast.success("กู้คืนข้อมูลสำเร็จ");
      }
    });
  };

  const handleHardDelete = () => {
    startAction(`hardDelete-${id}`, async () => {
      const result = await hardDeleteBlog(id);
      if (!result.success) {
        toast.error(result.error || "เกิดข้อผิดพลาดในการลบข้อมูลถาวร");
      } else {
        toast.error("ลบบทความเรียบร้อยแล้ว");
      }
    });
  };

  if (isDeleted) {
    return (
      <div className="flex items-center justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={handleRestore} disabled={isPending} className="h-8 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100">
          {loadingAction === `restore-${id}` ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          {loadingAction === `restore-${id}` ? "กำลังกู้คืน..." : "Restore"}
        </Button>
        <AlertDialog>
          <AlertDialogTrigger render={
            <Button variant="outline" size="sm" disabled={isPending} className="h-8 text-destructive border-red-200 bg-red-50 hover:bg-red-100">
              <Trash2 className="h-4 w-4 mr-2" /> Permanently Delete
            </Button>
          } />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>คุณแน่ใจหรือไม่ที่จะลบบทความนี้ถาวร?</AlertDialogTitle>
              <AlertDialogDescription>
                การกระทำนี้ไม่สามารถยกเลิกได้ ข้อมูลบทความจะถูกลบออกจากระบบอย่างถาวร
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleHardDelete} disabled={isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                {loadingAction === `hardDelete-${id}` && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loadingAction === `hardDelete-${id}` ? "กำลังลบ..." : "Confirm"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end space-x-2">
      <Link href={`/blog/${slug}`} target="_blank" className={buttonVariants({ variant: "ghost", size: "icon" })}>
        <Eye className="h-4 w-4" />
      </Link>
      <Link href={`/admin/blogs/${id}`} className={buttonVariants({ variant: "ghost", size: "icon" })}>
        <Edit className="h-4 w-4" />
      </Link>
      <AlertDialog>
        <AlertDialogTrigger render={
          <Button variant="ghost" size="icon" disabled={isPending} className="text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        } />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>คุณแน่ใจหรือไม่ที่จะลบบทความนี้?</AlertDialogTitle>
            <AlertDialogDescription>
              บทความนี้จะถูกย้ายไปยังถังขยะ คุณสามารถกู้คืนได้ในภายหลัง
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSoftDelete} disabled={isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {loadingAction === `softDelete-${id}` && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loadingAction === `softDelete-${id}` ? "กำลังลบ..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
