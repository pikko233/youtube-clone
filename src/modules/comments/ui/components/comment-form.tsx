"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { useClerk, useUser } from "@clerk/nextjs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { commentInsertSchema } from "@/db/schema";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const formSchema = commentInsertSchema.omit({ userId: true });
type FormValues = z.infer<typeof formSchema>;

interface CommentFormProps {
  videoId: string;
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  variant?: "reply" | "comment";
}

export const CommentForm = ({
  videoId,
  parentId,
  onSuccess,
  onCancel,
  variant = "comment",
}: CommentFormProps) => {
  const { user } = useUser();
  const clerk = useClerk();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const create = useMutation(
    trpc.comments.create.mutationOptions({
      onSuccess: () => {
        toast.success("评论发送成功～");
        form.reset();
        onSuccess?.();
        void queryClient.invalidateQueries(
          trpc.comments.getMany.infiniteQueryFilter({ videoId }),
        );
        void queryClient.invalidateQueries(
          trpc.comments.getMany.infiniteQueryFilter({ videoId, parentId }),
        );
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          toast.info("请先登录");
          clerk.openSignIn();
        } else {
          toast.info(error.message || "操作失败，请稍后再试～");
        }
      },
    }),
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentId,
      videoId,
      value: "",
    },
  });

  const handleSubmit = (value: FormValues) => {
    create.mutate(value);
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // 阻止textarea默认换行行为
      form.handleSubmit(handleSubmit)();
    }
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <form
      className="flex gap-4 group mt-6"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <UserAvatar
        size="lg"
        imageUrl={user?.imageUrl || "/user-placeholder.svg"}
        name={user?.username || "User"}
      />
      <div className="flex-1">
        <div>
          <Controller
            control={form.control}
            name="value"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Textarea
                  {...field}
                  placeholder={
                    variant === "comment"
                      ? "添加一条评论..."
                      : "回复这条评论..."
                  }
                  className="resize-none bg-transparent overflow-hidden h-10 max-h-10"
                  onKeyDown={(e) => handleTextareaKeyDown(e)}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="flex justify-end mt-2 gap-2">
          {variant === "reply" && (
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={handleCancel}
              disabled={create.isPending}
            >
              取消
            </Button>
          )}
          <Button type="submit" size="lg" disabled={create.isPending}>
            {variant === "comment" ? "评论" : "回复"}
          </Button>
        </div>
      </div>
    </form>
  );
};
