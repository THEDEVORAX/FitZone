import { eq, and, gte, lte, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  trainers,
  classes,
  classBookings,
  subscriptionPlans,
  userSubscriptions,
  classTypes,
  trainerReviews,
  successStories,
  blogPosts,
  notifications,
  userRewards,
  payments,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Trainer queries
export async function getTrainerById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(trainers)
    .where(eq(trainers.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAllTrainers() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(trainers)
    .where(eq(trainers.isActive, true))
    .orderBy(desc(trainers.rating));
}

export async function getTrainerByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(trainers)
    .where(eq(trainers.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Class queries
export async function getClassById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(classes).where(eq(classes.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAllClasses(upcomingOnly = false) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(classes).where(eq(classes.isActive, true));

  if (upcomingOnly) {
    query = query.where(gte(classes.startTime, new Date()));
  }

  return await query.orderBy(asc(classes.startTime));
}

export async function getClassesByTrainer(trainerId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(classes)
    .where(and(eq(classes.trainerId, trainerId), eq(classes.isActive, true)))
    .orderBy(asc(classes.startTime));
}

export async function getClassesByType(classTypeId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(classes)
    .where(
      and(eq(classes.classTypeId, classTypeId), eq(classes.isActive, true))
    )
    .orderBy(asc(classes.startTime));
}

// Class booking queries
export async function getUserClassBookings(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(classBookings)
    .where(eq(classBookings.userId, userId))
    .orderBy(desc(classBookings.bookedAt));
}

export async function getClassBookingsByClass(classId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(classBookings)
    .where(eq(classBookings.classId, classId));
}

export async function checkClassBooking(userId: number, classId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(classBookings)
    .where(
      and(
        eq(classBookings.userId, userId),
        eq(classBookings.classId, classId)
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Subscription queries
export async function getSubscriptionPlans() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(subscriptionPlans)
    .where(eq(subscriptionPlans.isActive, true));
}

export async function getSubscriptionPlanById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(subscriptionPlans)
    .where(eq(subscriptionPlans.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserActiveSubscription(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(userSubscriptions)
    .where(
      and(
        eq(userSubscriptions.userId, userId),
        eq(userSubscriptions.status, "active"),
        gte(userSubscriptions.endDate, new Date())
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserSubscriptions(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(userSubscriptions)
    .where(eq(userSubscriptions.userId, userId))
    .orderBy(desc(userSubscriptions.createdAt));
}

// Class type queries
export async function getAllClassTypes() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(classTypes);
}

// Trainer review queries
export async function getTrainerReviews(trainerId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(trainerReviews)
    .where(eq(trainerReviews.trainerId, trainerId))
    .orderBy(desc(trainerReviews.createdAt));
}

// Success stories queries
export async function getPublishedSuccessStories() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(successStories)
    .where(eq(successStories.isPublished, true))
    .orderBy(desc(successStories.createdAt));
}

// Blog queries
export async function getPublishedBlogPosts() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.isPublished, true))
    .orderBy(desc(blogPosts.publishedAt));
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Notification queries
export async function getUserNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
}

// User rewards queries
export async function getUserRewards(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(userRewards)
    .where(eq(userRewards.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Payment queries
export async function getUserPayments(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(payments)
    .where(eq(payments.userId, userId))
    .orderBy(desc(payments.createdAt));
}

export async function getPaymentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(payments)
    .where(eq(payments.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}
