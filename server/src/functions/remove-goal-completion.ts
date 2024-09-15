import { count, gte, lte, and, eq, sql, desc } from "drizzle-orm";
import { goalCompletions, goals } from "../db/schema";
import { db } from "../db";

export async function removeGoalCompletion(id: string) {
	try {
		return await db
			.delete(goalCompletions)
			.where(eq(goalCompletions.id, id))
			.returning();
	} catch (error) {
		console.error(error);
		throw error;
	}
}
