import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  conversations: defineTable({
    userId: v.id("users"),
    title: v.string(),
    personality: v.union(
      v.literal("revolutionary"),
      v.literal("diplomat"),
      v.literal("philosopher")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_conversation", ["conversationId"]),

  savedLaws: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    category: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  protestGuides: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    tactics: v.array(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
