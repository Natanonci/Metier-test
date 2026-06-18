"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBlog, updateBlog } from "@/app/actions/admin";
import { type BlogInput, blogSchema } from "@/lib/validations/blog";
import { Blog } from "@prisma/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface BlogFormProps {
  initialData?: Blog;
}

export function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slug, setSlug] = useState<string>(initialData?.slug || "");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const generatedSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9\u0E00-\u0E7F\s-]/g, "")
      .replace(/\s+/g, "-");
    setSlug(generatedSlug);
  };

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const rawData = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      summary: formData.get("summary") as string,
      content: formData.get("content") as string,
      isPublished: formData.get("isPublished") === "on",
      images: images,
    };

    setErrors({});
    const validated = blogSchema.safeParse(rawData);
    if (!validated.success) {
      const fieldErrors: Record<string, string> = {};
      validated.error.issues.forEach(issue => {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      setIsPending(false);
      return;
    }

    try {
      let result;
      if (initialData) {
        result = await updateBlog(initialData.id, validated.data);
      } else {
        result = await createBlog(validated.data);
      }

      if (result && result.success === false) {
        toast.error(result.error || "เกิดข้อผิดพลาดในการบันทึก");
      } else if (result && result.success) {
        toast.success("อัปเดตบทความสำเร็จ");
        router.push("/admin/blogs");
        router.refresh();
      }
    } catch (error: any) {
      if (error && error.digest && error.digest.startsWith("NEXT_REDIRECT")) {
        toast.success(initialData ? "อัปเดตบทความสำเร็จ" : "สร้างบทความสำเร็จ");
        throw error;
      }
      console.error(error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setIsPending(false);
    }
  }

  const addImage = () => {
    if (images.length >= 7) return;
    setImages([...images, ""]);
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <form action={handleSubmit} className="space-y-8">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={initialData?.title} required onChange={handleTitleChange} />
              {errors.title && <span className="text-sm text-red-500">{errors.title}</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (Unique URL)</Label>
              <Input id="slug" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="my-blog-post" />
              {errors.slug && <span className="text-sm text-red-500">{errors.slug}</span>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea id="summary" name="summary" defaultValue={initialData?.summary} required rows={2} />
            {errors.summary && <span className="text-sm text-red-500">{errors.summary}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Full Content</Label>
            <Textarea id="content" name="content" defaultValue={initialData?.content} required rows={10} />
            {errors.content && <span className="text-sm text-red-500">{errors.content}</span>}
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="isPublished" name="isPublished" defaultChecked={initialData?.isPublished} />
            <Label htmlFor="isPublished">Publish immediately</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <Label>Images (Max 7)</Label>
            <Button type="button" variant="outline" size="sm" onClick={addImage} disabled={images.length >= 7}>
              Add Image URL
            </Button>
          </div>
          <div className="space-y-4">
            {images.map((url, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={url}
                  onChange={(e) => updateImage(index, e.target.value)}
                  required
                />
                <Button type="button" variant="destructive" size="icon" onClick={() => removeImage(index)}>
                  ×
                </Button>
              </div>
            ))}
            {images.length === 0 && <p className="text-sm text-muted-foreground italic">No images added.</p>}
            {errors.images && <span className="text-sm text-red-500 block mt-2">{errors.images}</span>}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? (initialData ? "กำลังอัปเดต..." : "กำลังสร้าง...") : initialData ? "อัปเดตบทความ" : "สร้างบทความ"}
        </Button>
      </div>
    </form>
  );
}
