"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { UploadDropzone } from "@/lib/uploadthing";
import { useTRPC } from "@/trpc/client";
import { useQueryClient } from "@tanstack/react-query";
import { file } from "zod";

interface ThumbnailUploadModalProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ThumbnailUploadModal = ({
  videoId,
  open,
  onOpenChange,
}: ThumbnailUploadModalProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const onUploadComplete = async () => {
    onOpenChange(false);

    await queryClient.invalidateQueries(trpc.studio.getOne.queryFilter());
    await queryClient.invalidateQueries(trpc.studio.getMany.queryFilter());
  };
  return (
    <ResponsiveModal
      title="上传一张封面"
      open={open}
      onOpenChange={onOpenChange}
    >
      <UploadDropzone
        endpoint="thumbnailUploader"
        input={{ videoId }}
        onClientUploadComplete={onUploadComplete}
        content={{
          label: "拖拽文件到此处或点击上传",
          allowedContent: "支持 PNG、JPG、GIF，最大 4MB",
          button: ({ ready, isUploading, uploadProgress, files }) => {
            if (!ready) return "准备中...";
            if (isUploading) return `上传中 ${uploadProgress}%`;
            if (files.length > 0) return "上传封面"; // 已选择文件，等待点击上传
            return "请先选择图片"; // 还没选文件
          },
        }}
      />
    </ResponsiveModal>
  );
};
