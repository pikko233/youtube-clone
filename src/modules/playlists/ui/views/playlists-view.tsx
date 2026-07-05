"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { PlaylistCreateModal } from "../components/playlist-create-modal";
import { useState } from "react";
import { PlaylistsSection } from "../sections/playlists-section";

export const PlaylistsView = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <>
      <PlaylistCreateModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
      <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">播放列表</h1>
            <p className="text-xs text-muted-foreground">你所创建的播放列表</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => setCreateModalOpen(true)}
          >
            <PlusIcon />
          </Button>
        </div>
        <PlaylistsSection />
      </div>
    </>
  );
};
