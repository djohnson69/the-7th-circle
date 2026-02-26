import { type User, type UpsertUser, type Review, type InsertReview, type Subscriber, type InsertSubscriber, type AnalyticsEvent, type InsertAnalyticsEvent, users, reviews, subscribers, analyticsEvents } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getReviewsByProduct(productHandle: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  getSubscriberByEmail(email: string): Promise<Subscriber | undefined>;
  getAllSubscribers(): Promise<Subscriber[]>;
  logAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getReviewsByProduct(productHandle: string): Promise<Review[]> {
    try {
      const result = await db.select({
        id: reviews.id,
        productHandle: reviews.productHandle,
        rating: reviews.rating,
        title: reviews.title,
        content: reviews.content,
        authorName: reviews.authorName,
        authorEmail: reviews.authorEmail,
        images: reviews.images,
        createdAt: sql<string>`to_char(${reviews.createdAt}, 'YYYY-MM-DD"T"HH24:MI:SS"Z"')`.as('created_at'),
      }).from(reviews).where(eq(reviews.productHandle, productHandle)).orderBy(desc(reviews.createdAt));
      return (result || []).map(r => ({
        ...r,
        createdAt: r.createdAt ? new Date(r.createdAt) : new Date(),
      })) as Review[];
    } catch (error: any) {
      if (error?.message?.includes("Cannot read properties of null")) {
        return [];
      }
      throw error;
    }
  }

  async createReview(review: InsertReview): Promise<Review> {
    const result = await db.insert(reviews).values(review).returning();
    return result[0];
  }

  async createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber> {
    const [result] = await db
      .insert(subscribers)
      .values({
        ...subscriber,
        consentMarketing: new Date(),
      })
      .onConflictDoUpdate({
        target: subscribers.email,
        set: {
          source: subscriber.source,
          discountCode: subscriber.discountCode,
          consentMarketing: new Date(),
        },
      })
      .returning();
    return result;
  }

  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    const [subscriber] = await db.select().from(subscribers).where(eq(subscribers.email, email.toLowerCase()));
    return subscriber;
  }

  async getAllSubscribers(): Promise<Subscriber[]> {
    return await db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
  }

  async logAnalyticsEvent(event: InsertAnalyticsEvent): Promise<AnalyticsEvent> {
    const [result] = await db.insert(analyticsEvents).values(event).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
