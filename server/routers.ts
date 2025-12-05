import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getAllTrainers,
  getTrainerById,
  getAllClasses,
  getClassById,
  getClassesByTrainer,
  getClassesByType,
  getAllClassTypes,
  getSubscriptionPlans,
  getSubscriptionPlanById,
  getUserActiveSubscription,
  getUserSubscriptions,
  getUserClassBookings,
  getClassBookingsByClass,
  checkClassBooking,
  getTrainerReviews,
  getPublishedSuccessStories,
  getPublishedBlogPosts,
  getBlogPostBySlug,
  getUserNotifications,
  getUserRewards,
  getUserPayments,
  getTrainerByUserId,
  getDb,
} from "./db";
import { z } from "zod";
import {
  trainers,
  classes as classesTable,
  classBookings,
  userSubscriptions,
  subscriptionPlans,
  trainerReviews,
  successStories,
  blogPosts,
  notifications,
  userRewards,
  payments,
  classTypes,
} from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Trainer routes
  trainers: router({
    getAll: publicProcedure.query(async () => {
      return await getAllTrainers();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const trainer = await getTrainerById(input.id);
        if (!trainer) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Trainer not found",
          });
        }
        return trainer;
      }),

    getByUserId: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return await getTrainerByUserId(input.userId);
      }),

    getReviews: publicProcedure
      .input(z.object({ trainerId: z.number() }))
      .query(async ({ input }) => {
        return await getTrainerReviews(input.trainerId);
      }),

    addReview: protectedProcedure
      .input(
        z.object({
          trainerId: z.number(),
          rating: z.number().min(1).max(5),
          comment: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database not available",
          });
        }

        const review = await db.insert(trainerReviews).values({
          trainerId: input.trainerId,
          userId: ctx.user.id,
          rating: input.rating,
          comment: input.comment,
        });

        return { success: true };
      }),
  }),

  // Class routes
  classes: router({
    getAll: publicProcedure
      .input(z.object({ upcomingOnly: z.boolean().optional() }))
      .query(async ({ input }) => {
        return await getAllClasses(input.upcomingOnly);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const cls = await getClassById(input.id);
        if (!cls) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Class not found",
          });
        }
        return cls;
      }),

    getByTrainer: publicProcedure
      .input(z.object({ trainerId: z.number() }))
      .query(async ({ input }) => {
        return await getClassesByTrainer(input.trainerId);
      }),

    getByType: publicProcedure
      .input(z.object({ classTypeId: z.number() }))
      .query(async ({ input }) => {
        return await getClassesByType(input.classTypeId);
      }),

    getEnrollments: publicProcedure
      .input(z.object({ classId: z.number() }))
      .query(async ({ input }) => {
        return await getClassBookingsByClass(input.classId);
      }),
  }),

  // Class types routes
  classTypes: router({
    getAll: publicProcedure.query(async () => {
      return await getAllClassTypes();
    }),
  }),

  // Class booking routes
  classBookings: router({
    getUserBookings: protectedProcedure.query(async ({ ctx }) => {
      return await getUserClassBookings(ctx.user.id);
    }),

    checkBooking: protectedProcedure
      .input(z.object({ classId: z.number() }))
      .query(async ({ input, ctx }) => {
        return await checkClassBooking(ctx.user.id, input.classId);
      }),

    bookClass: protectedProcedure
      .input(z.object({ classId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database not available",
          });
        }

        // Check if user already booked
        const existing = await checkClassBooking(ctx.user.id, input.classId);
        if (existing && existing.status === "booked") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You already booked this class",
          });
        }

        // Check class capacity
        const cls = await getClassById(input.classId);
        if (!cls) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Class not found",
          });
        }

        const currentEnrollment = cls.currentEnrollment ?? 0;
        if (currentEnrollment >= cls.maxCapacity) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Class is full",
          });
        }

        // Create booking
        const booking = await db.insert(classBookings).values({
          userId: ctx.user.id,
          classId: input.classId,
          status: "booked",
        });

        // Update class enrollment
        await db
          .update(classesTable)
          .set({ currentEnrollment: currentEnrollment + 1 })
          .where(eq(classesTable.id, input.classId));

        // Create notification
        await db.insert(notifications).values({
          userId: ctx.user.id,
          type: "booking_confirmation",
          title: "Class Booking Confirmed",
          message: `You have successfully booked the class`,
        });

        return { success: true };
      }),

    cancelBooking: protectedProcedure
      .input(z.object({ bookingId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database not available",
          });
        }

        // Update booking status
        await db
          .update(classBookings)
          .set({ status: "cancelled", cancelledAt: new Date() })
          .where(eq(classBookings.id, input.bookingId));

        return { success: true };
      }),
  }),

  // Subscription routes
  subscriptions: router({
    getPlans: publicProcedure.query(async () => {
      return await getSubscriptionPlans();
    }),

    getPlanById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getSubscriptionPlanById(input.id);
      }),

    getUserSubscriptions: protectedProcedure.query(async ({ ctx }) => {
      return await getUserSubscriptions(ctx.user.id);
    }),

    getActiveSubscription: protectedProcedure.query(async ({ ctx }) => {
      return await getUserActiveSubscription(ctx.user.id);
    }),
  }),

  // Success stories routes
  successStories: router({
    getPublished: publicProcedure.query(async () => {
      return await getPublishedSuccessStories();
    }),
  }),

  // Blog routes
  blog: router({
    getPublished: publicProcedure.query(async () => {
      return await getPublishedBlogPosts();
    }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await getBlogPostBySlug(input.slug);
      }),
  }),

  // Notifications routes
  notifications: router({
    getUserNotifications: protectedProcedure.query(async ({ ctx }) => {
      return await getUserNotifications(ctx.user.id);
    }),

    markAsRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database not available",
          });
        }

        await db
          .update(notifications)
          .set({ isRead: true })
          .where(eq(notifications.id, input.notificationId));

        return { success: true };
      }),
  }),

  // User rewards routes
  rewards: router({
    getUserRewards: protectedProcedure.query(async ({ ctx }) => {
      return await getUserRewards(ctx.user.id);
    }),
  }),

  // Payments routes
  payments: router({
    getUserPayments: protectedProcedure.query(async ({ ctx }) => {
      return await getUserPayments(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
