import { CommentsSection } from "../sections/comments-section";
import { SuggestionsSection } from "../sections/suggestions-section";
import { VideoSection } from "../sections/video-section";

interface VideoViewProps {
  videoId: string;
}

export const VideoView = ({ videoId }: VideoViewProps) => {
  return (
    <div className="flex flex-col max-w-[1700px] mx-auto pt-2.5 px-4 mb-10">
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 min-w-0">
          {/* 视频播放区域 */}
          <VideoSection videoId={videoId} />

          {/* 移动设备-手机端 推荐视频区域 */}
          <div className="xl:hidden block mb-4">
            <SuggestionsSection />
          </div>

          {/* 评论区 */}
          <CommentsSection />
        </div>

        {/* PC端 推荐视频区域 */}
        <div className="hidden xl:block w-full xl:w-[380px] 2xl:w-[460px] shrink-1">
          <SuggestionsSection />
        </div>
      </div>
    </div>
  );
};
