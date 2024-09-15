import { db } from "../db";
import { goals } from "../db/schema";

interface CreateGoalRequest {
	title: string;
	desiredWeeklyFrequency: number;
}

export async function createGoal({
	title,
	desiredWeeklyFrequency,
}: CreateGoalRequest) {
	const resultGoals = await db
		.insert(goals)
		.values({
			title,
			desiredWeeklyFrequency,
		})
		.returning();

	const goal = resultGoals[0];

	return {
		goal,
	};
}
