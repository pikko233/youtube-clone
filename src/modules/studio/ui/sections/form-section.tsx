"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CopyCheckIcon,
  CopyIcon,
  Globe2Icon,
  ImagePlusIcon,
  LockIcon,
  MoreVerticalIcon,
  RotateCcwIcon,
  SparkleIcon,
  Trash2Icon,
} from "lucide-react";
import { videoUpdateSchema } from "@/db/schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { VideoPlayer } from "@/modules/video/ui/components/video-player";
import Link from "next/link";
import {
  getMuxStatusLabel,
  getVisibilityLabel,
  snakeCaseToTitle,
} from "@/lib/utils";
import Image from "next/image";
import { THUMBNAIL_FALLBACK } from "@/modules/video/constants";
import { ThumbnailUploadModal } from "../components/thumbnail-upload-model";

interface FormSectionProps {
  videoId: string;
}

export const FormSection = ({ videoId }: FormSectionProps) => {
  return (
    <Suspense fallback={<FormSkeletion />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <FormSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

export const FormSkeletion = () => {
  return <div>loading...</div>;
};

export const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
  const router = useRouter();
  const [thumbnailModelOpen, setThumbnailModalOpen] = useState(false);
  const trpc = useTRPC();
  const { data: video } = useSuspenseQuery(
    trpc.studio.getOne.queryOptions({ id: videoId }),
  );
  const { data: categories } = useSuspenseQuery(
    trpc.categories.getMany.queryOptions(),
  );

  const queryClient = useQueryClient();

  const update = useMutation(
    trpc.video.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.studio.getMany.queryFilter());
        await queryClient.invalidateQueries(
          trpc.studio.getOne.queryFilter({ id: videoId }),
        );
        toast.success("修改成功");
        router.refresh(); // 清掉nextjs的路由缓存，不然返回上一页数据不会更新
        router.back();
      },
      onError: (error) => {
        toast.error(error.message ?? "操作异常");
      },
    }),
  );

  const remove = useMutation(
    trpc.video.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.studio.getMany.queryFilter());
        toast.success("删除成功");
        router.refresh(); // 清掉nextjs的路由缓存，不然返回上一页数据不会更新
        router.push("/studio");
      },
      onError: (error) => {
        toast.error(error.message ?? "操作异常");
      },
    }),
  );

  const restoreThumbnail = useMutation(
    trpc.video.restoreThumbnail.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.studio.getMany.queryFilter());
        await queryClient.invalidateQueries(trpc.studio.getOne.queryFilter());
        toast.success("封面重置成功");
      },
      onError: (error) => {
        toast.error(error.message ?? "操作异常");
      },
    }),
  );

  const form = useForm<z.infer<typeof videoUpdateSchema>>({
    resolver: zodResolver(videoUpdateSchema),
    defaultValues: video,
  });

  const onSubmit = (data: z.infer<typeof videoUpdateSchema>) => {
    update.mutate(data);
  };

  const fullUrl = `${process.env.VERCEL_URL || "http://localhost:3000"}/videos/${videoId}`;
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <>
      <ThumbnailUploadModal
        open={thumbnailModelOpen}
        onOpenChange={setThumbnailModalOpen}
        videoId={videoId}
      />
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between p-6 pr-20">
          <div>
            <h1 className="text-2xl font-bold">视频详情</h1>
            <p className="text-xs text-muted-foreground">管理你的视频信息</p>
          </div>
          <div className="flex items-center gap-x-2">
            <Button type="submit" disabled={update.isPending}>
              保存
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <MoreVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => remove.mutate({ id: videoId })}
                >
                  <Trash2Icon className="size-4 mr-2" />
                  <span>删除</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 pl-6 pr-20">
          <div className="flex flex-col gap-y-8 lg:col-span-3">
            <FieldGroup>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>标题</FieldLabel>
                    <Input {...field} placeholder="为你的视频添加标题" />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>描述</FieldLabel>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      rows={10}
                      className="resize-none pr-10 min-h-60"
                      autoComplete="off"
                      placeholder="为你的视频添加描述"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="thumbnailUrl"
                control={form.control}
                render={() => (
                  <Field>
                    <FieldLabel>视频封面</FieldLabel>
                    <div className="p-0.5 border border-dashed border-neutral-400 relative h-[84px] w-[153px] max-w-40 group">
                      <Image
                        src={video.thumbnailUrl ?? THUMBNAIL_FALLBACK}
                        className="object-cover"
                        fill
                        alt="视频封面"
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            size="icon"
                            className="bg-black/50 hover:bg-black/80 absolute top-1 right-1 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 duration-300 size-7"
                          >
                            <MoreVerticalIcon className="text-white" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" side="right">
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              onClick={() => setThumbnailModalOpen(true)}
                            >
                              <ImagePlusIcon className="size-4 mr-1" />
                              选择图片
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <SparkleIcon className="size-4 mr-1" />
                              AI生成
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                restoreThumbnail.mutate({ id: videoId })
                              }
                            >
                              <RotateCcwIcon className="size-4 mr-1" />
                              重置
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Field>
                )}
              />
              <Controller
                name="categoryId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>分类</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="请选择分类" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
          <div className="flex flex-col gap-y-8 lg:col-span-2">
            <div className="flex flex-col gap-4 bg-[#f9f9f9] rounded-xl overflow-hidden h-fit">
              <div className="aspect-video overflow-hidden relative">
                <VideoPlayer
                  playbackId={video.muxPlaybackId}
                  thumbnailUrl={video.thumbnailUrl}
                />
              </div>
              <div className="p-4 flex flex-col gap-y-6">
                <div className="flex justify-between items-center gap-x-2">
                  <div className="flex flex-col gap-y-1">
                    <p className="text-muted-foreground text-xs">视频链接</p>
                    <div className="flex items-center gap-x-2">
                      <Link href={`/videos/${video.id}`}>
                        <p className="line-clamp-1 text-sm text-blue-500">
                          {fullUrl}
                        </p>
                      </Link>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={onCopy}
                        disabled={isCopied}
                      >
                        {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-y-1">
                    <p className="text-muted-foreground text-xs">视频状态</p>
                    <p>{getMuxStatusLabel(video.muxStatus || "preparing")}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-y-1">
                    <p className="text-muted-foreground text-xs">字幕状态</p>
                    <p>{getMuxStatusLabel(video.muxTrackStatus)}</p>
                  </div>
                </div>
              </div>
            </div>

            <FieldGroup>
              <Controller
                name="visibility"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>是否可见</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="请选择分类" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="public">
                            <Globe2Icon />
                            {getVisibilityLabel("public")}
                          </SelectItem>
                          <SelectItem value="private">
                            <LockIcon />
                            {getVisibilityLabel("private")}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
        </div>
      </form>
    </>
  );
};
