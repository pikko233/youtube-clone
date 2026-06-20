import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

// 生成 + 上传放在同一个 context.run 内,受本函数超时限制,
// 放宽到 60s 以容纳 Gemini 出图耗时。
export const maxDuration = 60;

interface InputType {
  userId: string;
  videoId: string;
  prompt: string;
}

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;
  const { userId, videoId, prompt } = input;

  const video = await context.run("get-video", async () => {
    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

    if (!existingVideo) {
      throw new Error("Not found");
    }

    return existingVideo;
  });

  const utapi = new UTApi();

  // 生成与上传放在同一步:Gemini 返回的是内联 base64,
  // 在这一步内解码并直接上传到 UploadThing,
  // 只返回体积很小的结果对象,避免 base64 被 qstash 持久化而超出消息上限。
  const uploadedThumbnailUrl = await context.run(
    "generate-and-upload-thumbnail",
    async () => {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${process.env.OPENROUTER_API_KEY!}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            modalities: ["image", "text"],
          }),
        },
      );

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`生成失败: ${response.status} ${errorBody}`);
      }

      const result = (await response.json()) as {
        choices?: {
          message?: { images?: { image_url?: { url?: string } }[] };
        }[];
      };

      // OpenRouter chat completions 的图片在 choices[0].message.images[0].image_url.url
      // 形如 data:image/png;base64,xxxx
      const dataUri = result.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (!dataUri) {
        throw new Error("生成失败");
      }

      const base64 = dataUri.split(",")[1];
      const buffer = Buffer.from(base64, "base64");
      const file = new File([buffer], `${videoId}.png`, { type: "image/png" });

      const { data } = await utapi.uploadFiles(file);

      if (!data) {
        throw new Error("上传失败");
      }

      return data;
    },
  );

  await context.run("cleanup-thumbnail", async () => {
    if (video.thumbnailKey) {
      await utapi.deleteFiles(video.thumbnailKey);
      await db
        .update(videos)
        .set({
          thumbnailKey: null,
          thumbnailUrl: null,
        })
        .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
    }
  });

  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({
        thumbnailKey: uploadedThumbnailUrl.key,
        thumbnailUrl: uploadedThumbnailUrl.ufsUrl,
      })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
  });
});
