import { db } from "@/db";
import { categories } from "@/db/schema";

const categoryNames_EN = [
  "Cars and vehicles",
  "Comedy",
  "Education",
  "Gaming",
  "Entertainment",
  "Film and animation",
  "How-to and style",
  "Music",
  "News and politics",
  "People and blogs",
  "Pets and animals",
  "Science and technology",
  "Sports",
  "Travel and events",
];

const categoryNames = [
  "汽车与交通工具",
  "喜剧",
  "教育",
  "游戏",
  "娱乐",
  "电影与动画",
  "教程与时尚",
  "音乐",
  "新闻与政治",
  "个人与博客",
  "宠物与动物",
  "科学与技术",
  "体育",
  "旅行与活动",
];

async function main() {
  console.log("Seeding categories...");

  try {
    const values = categoryNames.map((name) => ({
      name,
      description: `Video related to ${name.toLowerCase()}`,
    }));

    await db.insert(categories).values(values);

    console.log("Categories inserted successfully!");
  } catch (error) {
    console.error("Error seeding categories: ", error);
    process.exit(1);
  }
}

main();
