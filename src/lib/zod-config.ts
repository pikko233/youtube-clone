import { z } from "zod";
import { zhCN } from "zod/locales";

// 将 Zod 默认报错文案设为中文，全局生效
z.config(zhCN());
