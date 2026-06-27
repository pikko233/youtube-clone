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
  onSuccess?: () => void;
}

export const CommentForm = ({ videoId, onSuccess }: CommentFormProps) => {
  const { user } = useUser();
  const clerk = useClerk();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const create = useMutation(
    trpc.comments.create.mutationOptions({
      onSuccess: () => {
        toast.success("评论发送成功～");
        form.reset();
        void queryClient.invalidateQueries(
          trpc.comments.getMany.queryFilter({ videoId }),
        );
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          toast.info("请先登录");
          clerk.openSignIn();
        }
      },
    }),
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoId,
      value: "",
    },
  });

  const handleSubmit = (value: FormValues) => {
    create.mutate(value);
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
                  placeholder="添加一条评论..."
                  className="resize-none bg-transparent overflow-hidden h-10 max-h-10"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="flex justify-end mt-2">
          <Button type="submit" size="lg" disabled={create.isPending}>
            发送
          </Button>
        </div>
      </div>
    </form>
  );
};
