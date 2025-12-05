import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(user?: Partial<AuthenticatedUser>): TrpcContext {
  const defaultUser: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user: user ? { ...defaultUser, ...user } : defaultUser,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Gym Management System - tRPC Procedures", () => {
  describe("auth", () => {
    it("should return current user", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.me();

      expect(result).toBeDefined();
      expect(result?.id).toBe(1);
      expect(result?.email).toBe("test@example.com");
    });

    it("should return null for unauthenticated user", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.me();

      expect(result).toBeNull();
    });
  });

  describe("trainers", () => {
    it("should get all trainers (public)", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.trainers.getAll();

      expect(Array.isArray(result)).toBe(true);
    });

    it("should handle trainer not found", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.trainers.getById({ id: 99999 });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("NOT_FOUND");
      }
    });
  });

  describe("classes", () => {
    it("should get all classes (public)", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.classes.getAll({ upcomingOnly: false });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should filter upcoming classes", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.classes.getAll({ upcomingOnly: true });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should handle class not found", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.classes.getById({ id: 99999 });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("NOT_FOUND");
      }
    });
  });

  describe("subscriptions", () => {
    it("should get subscription plans (public)", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.subscriptions.getPlans();

      expect(Array.isArray(result)).toBe(true);
    });

    it("should get user subscriptions (protected)", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.subscriptions.getUserSubscriptions();

      expect(Array.isArray(result)).toBe(true);
    });

    it("should deny access to user subscriptions without auth", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.subscriptions.getUserSubscriptions();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });
  });

  describe("classBookings", () => {
    it("should get user bookings (protected)", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.classBookings.getUserBookings();

      expect(Array.isArray(result)).toBe(true);
    });

    it("should deny access to bookings without auth", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.classBookings.getUserBookings();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });
  });

  describe("classTypes", () => {
    it("should get all class types (public)", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.classTypes.getAll();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("blog", () => {
    it("should get published blog posts (public)", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.blog.getPublished();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("successStories", () => {
    it("should get published success stories (public)", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.successStories.getPublished();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("notifications", () => {
    it("should get user notifications (protected)", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.notifications.getUserNotifications();

      expect(Array.isArray(result)).toBe(true);
    });

    it("should deny access to notifications without auth", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.notifications.getUserNotifications();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });
  });

  describe("rewards", () => {
    it("should get user rewards (protected)", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.rewards.getUserRewards();

      // Result can be undefined if no rewards exist
      expect(result === undefined || typeof result === "object").toBe(true);
    });

    it("should deny access to rewards without auth", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.rewards.getUserRewards();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });
  });

  describe("payments", () => {
    it("should get user payments (protected)", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.payments.getUserPayments();

      expect(Array.isArray(result)).toBe(true);
    });

    it("should deny access to payments without auth", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.payments.getUserPayments();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });
  });
});
