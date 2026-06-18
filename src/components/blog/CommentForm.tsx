"use client";

import { useTransition, useState } from "react";
import { submitComment } from "@/app/actions/comment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ActionResponse } from "@/types";

const formSchema = z.object({
  senderName: z.string().min(1, "กรุณากรอกชื่อ").regex(/^[ก-๙0-9\s]+$/, "กรุณากรอกภาษาไทยและตัวเลขเท่านั้น"),
  message: z.string().min(1, "กรุณากรอกข้อความ").regex(/^[ก-๙0-9\s]+$/, "กรุณากรอกภาษาไทยและตัวเลขเท่านั้น"),
});

type FormValues = z.infer<typeof formSchema>;

export function CommentForm({ blogId }: { blogId: string }) {
  const [isPending, startTransition] = useTransition();
  const [submitResult, setSubmitResult] = useState<ActionResponse | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      senderName: "",
      message: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("senderName", data.senderName);
      formData.append("message", data.message);
      formData.append("blogId", blogId);

      const result = await submitComment(null, formData);
      setSubmitResult(result);
      if (result.success) {
        reset();
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave a Comment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="senderName">Name</Label>
            <Input id="senderName" disabled={isPending} {...register("senderName")} />
            {errors.senderName && (
              <p className="text-xs text-destructive">{errors.senderName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message (Thai only)</Label>
            <Textarea
              id="message"
              placeholder="พิมพ์ข้อความที่นี่..."
              rows={4}
              disabled={isPending}
              {...register("message")}
            />
            {errors.message && (
              <p className="text-xs text-destructive">{errors.message.message}</p>
            )}
          </div>
          {submitResult?.success && (
            <p className="text-sm text-green-600 font-medium">{submitResult.message}</p>
          )}
          {submitResult?.error && (
            <p className="text-sm text-destructive font-medium">{submitResult.error}</p>
          )}
          <Button type="submit" disabled={isPending || !isValid}>
            {isPending ? "Submitting..." : "Post Comment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
