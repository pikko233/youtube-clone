"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";

interface ThumbnailGenerateModalProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  prompt: z.string().min(10),
});

export const ThumbnailGenerateModal = ({
  videoId,
  open,
  onOpenChange,
}: ThumbnailGenerateModalProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const generateThumbnail = useMutation(
    trpc.video.generateThumbnail.mutationOptions({
      onSuccess: async () => {
        toast.success("正在生成封面图片～", {
          description: "可能需要等待一段时间",
        });
        form.reset();
        onOpenChange(false);
        await queryClient.invalidateQueries(trpc.studio.getOne.queryFilter());
        await queryClient.invalidateQueries(trpc.studio.getMany.queryFilter());
      },
      onError: (error) => {
        toast.error(error.message ?? "操作异常");
      },
    }),
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    generateThumbnail.mutate({
      prompt: values.prompt,
      id: videoId,
    });
  };
  return (
    <ResponsiveModal
      title="使用AI生成封面"
      open={open}
      onOpenChange={onOpenChange}
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FieldGroup>
          <Controller
            name="prompt"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>提示词</FieldLabel>
                <Textarea
                  {...field}
                  className="resize-none"
                  cols={30}
                  rows={5}
                  placeholder="请描述你想要的封面图"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <div className="flex justify-end">
          <Button type="submit" disabled={generateThumbnail.isPending}>
            生成
          </Button>
        </div>
      </form>
    </ResponsiveModal>
  );
};
