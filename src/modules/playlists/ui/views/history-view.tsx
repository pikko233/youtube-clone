import { HistoryVideosSection } from "../sections/history-videos-section";

export const HistoryView = () => {
  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <div>
        <h1 className="text-2xl font-bold">历史记录</h1>
        <p className="text-xs text-muted-foreground">你之前浏览过的视频</p>
      </div>
      <HistoryVideosSection />
    </div>
  );
};
