import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  ListPlusIcon,
  MoreVerticalIcon,
  ShareIcon,
  Trash2Icon,
  TrashIcon,
} from "lucide-react";
import { toast } from "sonner";

interface VideoMenuProps {
  videoId: string;
  variant?: "ghost" | "secondary";
  onRemove?: () => void;
}

export const VideoMenu = ({ videoId, variant, onRemove }: VideoMenuProps) => {
  const onShare = () => {
    const fullUrl = `${process.env.VERCEL_URL || "http://localhost:3000"}/videos/${videoId}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success("复制链接成功");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="icon" className="rounded-full">
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onShare}>
            <ShareIcon className="mr-2 size-4" />
            分享
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {}}>
            <ListPlusIcon className="mr-2 size-4" />
            添加至播放列表
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {}}>
            <Trash2Icon className="mr-2 size-4" />
            移除
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
