import { z } from "zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { removeGoalCompletion } from "../../functions/remove-goal-completion";

export const removeGoalCompletionRoute: FastifyPluginAsyncZod = async (app) => {
	app.delete(
		"/goal-completion/:id",
		{
			schema: {
				params: z.object({
					id: z.string(),
				}),
			},
		},
		async (request) => {
			const { id } = request.params;

			const result = await removeGoalCompletion(id);

			return { result: result.length > 0 };
		},
	);
};
