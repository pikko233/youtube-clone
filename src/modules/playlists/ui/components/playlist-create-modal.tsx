"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "@/lib/zod-config";
import z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldError,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PlaylistCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(1),
});

export const PlaylistCreateModal = ({
  open,
  onOpenChange,
}: PlaylistCreateModalProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const create = useMutation(
    trpc.playlists.create.mutationOptions({
      onSuccess: async () => {
        form.reset();
        onOpenChange(false);
        toast.success("列表创建成功~");
        queryClient.invalidateQueries(
          trpc.playlists.getMany.infiniteQueryFilter(),
        );
      },
      onError: (error) => {
        toast.error(error.message ?? "操作异常");
      },
    }),
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    create.mutate({
      name: values.name,
    });
  };
  return (
    <ResponsiveModal
      title="创建播放列表"
      open={open}
      onOpenChange={onOpenChange}
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>播放列表名称</FieldLabel>
                <Input {...field} placeholder="请输入播放列表名称" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <div className="flex justify-end">
          <Button type="submit" disabled={create.isPending}>
            创建
          </Button>
        </div>
      </form>
    </ResponsiveModal>
  );
};
