import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Saved Laws
export const listLaws = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("savedLaws")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const saveLaw = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("savedLaws", {
      userId,
      title: args.title,
      content: args.content,
      category: args.category,
      createdAt: Date.now(),
    });
  },
});

export const deleteLaw = mutation({
  args: { id: v.id("savedLaws") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const law = await ctx.db.get(args.id);
    if (!law || law.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(args.id);
  },
});

// Protest Guides
export const listGuides = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("protestGuides")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const saveGuide = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    tactics: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("protestGuides", {
      userId,
      title: args.title,
      content: args.content,
      tactics: args.tactics,
      createdAt: Date.now(),
    });
  },
});

export const deleteGuide = mutation({
  args: { id: v.id("protestGuides") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const guide = await ctx.db.get(args.id);
    if (!guide || guide.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(args.id);
  },
});
