"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { UploadDropzone } from "@/lib/uploadthing";
import { useTRPC } from "@/trpc/client";
import { useQueryClient } from "@tanstack/react-query";

interface BannerUploadModalProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BannerUploadModal = ({
  userId,
  open,
  onOpenChange,
}: BannerUploadModalProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const onUploadComplete = async () => {
    await queryClient.invalidateQueries(
      trpc.users.getOne.queryFilter({ id: userId }),
    );
    onOpenChange(false);
  };
  return (
    <ResponsiveModal
      title="上传一张背景图片"
      open={open}
      onOpenChange={onOpenChange}
    >
      <UploadDropzone
        endpoint="bannerUploader"
        onClientUploadComplete={onUploadComplete}
        content={{
          label: "拖拽文件到此处或点击上传",
          allowedContent: "支持 PNG、JPG、GIF，最大 4MB",
          button: ({ ready, isUploading, uploadProgress, files }) => {
            if (!ready) return "准备中...";
            if (isUploading) return `上传中 ${uploadProgress}%`;
            if (files.length > 0) return "开始上传"; // 已选择文件，等待点击上传
            return "点击选择图片"; // 还没选文件
          },
        }}
      />
    </ResponsiveModal>
  );
};
