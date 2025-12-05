import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
  datetime,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with gym-specific fields.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "trainer"]).default("user").notNull(),
  phone: varchar("phone", { length: 20 }),
  profileImage: text("profileImage"), // S3 URL
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Trainers table - extends users with trainer-specific information
 */
export const trainers = mysqlTable("trainers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  specialization: varchar("specialization", { length: 255 }), // e.g., "Cardio, Weightlifting"
  bio: text("bio"),
  experience: int("experience"), // years of experience
  image: text("image"), // S3 URL
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"), // 0-5 rating
  totalReviews: int("totalReviews").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Trainer = typeof trainers.$inferSelect;
export type InsertTrainer = typeof trainers.$inferInsert;

/**
 * Class types table - defines available fitness classes
 */
export const classTypes = mysqlTable("classTypes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(), // e.g., "Cardio", "Weightlifting", "Yoga", "Zumba"
  description: text("description"),
  icon: text("icon"), // S3 URL or emoji
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ClassType = typeof classTypes.$inferSelect;
export type InsertClassType = typeof classTypes.$inferInsert;

/**
 * Classes/Sessions table - individual class sessions
 */
export const classes = mysqlTable("classes", {
  id: int("id").autoincrement().primaryKey(),
  classTypeId: int("classTypeId").notNull(),
  trainerId: int("trainerId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  startTime: datetime("startTime").notNull(),
  endTime: datetime("endTime").notNull(),
  maxCapacity: int("maxCapacity").notNull(),
  currentEnrollment: int("currentEnrollment").default(0),
  location: varchar("location", { length: 255 }),
  image: text("image"), // S3 URL
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Class = typeof classes.$inferSelect;
export type InsertClass = typeof classes.$inferInsert;

/**
 * Class bookings table - user enrollments in classes
 */
export const classBookings = mysqlTable("classBookings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  classId: int("classId").notNull(),
  status: mysqlEnum("status", ["booked", "attended", "cancelled"]).default("booked"),
  bookedAt: timestamp("bookedAt").defaultNow().notNull(),
  cancelledAt: timestamp("cancelledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ClassBooking = typeof classBookings.$inferSelect;
export type InsertClassBooking = typeof classBookings.$inferInsert;

/**
 * Subscription plans table
 */
export const subscriptionPlans = mysqlTable("subscriptionPlans", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(), // e.g., "Basic", "Premium", "VIP"
  description: text("description"),
  monthlyPrice: decimal("monthlyPrice", { precision: 10, scale: 2 }).notNull(),
  yearlyPrice: decimal("yearlyPrice", { precision: 10, scale: 2 }).notNull(),
  classesPerMonth: int("classesPerMonth"), // null for unlimited
  features: text("features"), // JSON array of features
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = typeof subscriptionPlans.$inferInsert;

/**
 * User subscriptions table - tracks active subscriptions
 */
export const userSubscriptions = mysqlTable("userSubscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  planId: int("planId").notNull(),
  status: mysqlEnum("status", ["active", "expired", "cancelled"]).default("active"),
  startDate: datetime("startDate").notNull(),
  endDate: datetime("endDate").notNull(),
  classesUsed: int("classesUsed").default(0),
  paymentId: varchar("paymentId", { length: 255 }), // Stripe payment ID
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = typeof userSubscriptions.$inferInsert;

/**
 * Payments table - tracks all transactions
 */
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  subscriptionId: int("subscriptionId"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending"),
  paymentMethod: varchar("paymentMethod", { length: 50 }), // "stripe", "paypal", etc.
  stripePaymentId: varchar("stripePaymentId", { length: 255 }), // Stripe transaction ID
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * Trainer reviews table
 */
export const trainerReviews = mysqlTable("trainerReviews", {
  id: int("id").autoincrement().primaryKey(),
  trainerId: int("trainerId").notNull(),
  userId: int("userId").notNull(),
  rating: int("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TrainerReview = typeof trainerReviews.$inferSelect;
export type InsertTrainerReview = typeof trainerReviews.$inferInsert;

/**
 * Success stories table - before/after transformations
 */
export const successStories = mysqlTable("successStories", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  beforeImage: text("beforeImage"), // S3 URL
  afterImage: text("afterImage"), // S3 URL
  duration: varchar("duration", { length: 100 }), // e.g., "3 months"
  isPublished: boolean("isPublished").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SuccessStory = typeof successStories.$inferSelect;
export type InsertSuccessStory = typeof successStories.$inferInsert;

/**
 * Blog posts table
 */
export const blogPosts = mysqlTable("blogPosts", {
  id: int("id").autoincrement().primaryKey(),
  authorId: int("authorId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique(),
  content: text("content"),
  excerpt: text("excerpt"),
  featuredImage: text("featuredImage"), // S3 URL
  category: varchar("category", { length: 100 }), // "fitness", "nutrition", etc.
  isPublished: boolean("isPublished").default(false),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * User rewards/points table
 */
export const userRewards = mysqlTable("userRewards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  points: int("points").default(0),
  totalPointsEarned: int("totalPointsEarned").default(0),
  totalPointsRedeemed: int("totalPointsRedeemed").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserReward = typeof userRewards.$inferSelect;
export type InsertUserReward = typeof userRewards.$inferInsert;

/**
 * Notifications table
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // "booking_confirmation", "subscription_expiry", "offer", etc.
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
