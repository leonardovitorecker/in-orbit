import { CheckCircle2, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { DialogTrigger } from "./ui/dialog";
import { InOrbitIcon } from "./in-orbit-icon";
import { Progress, ProgressIndicator } from "./ui/progress-bar";
import { Separator } from "./ui/separator";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSummary } from "../http/get-summary";
import dayjs from "dayjs";
import ptBR from "dayjs/locale/pt-BR";
import { PendingGoals } from "./pending-goals";
import { removeGoalCompletion } from "../http/remove-goal-completion";

dayjs.locale(ptBR);

export function Summary() {
	const queryClient = useQueryClient();
	const { data } = useQuery({
		queryKey: ["summary"],
		queryFn: getSummary,
		staleTime: 1000 * 60,
	});

	if (!data) return null;

	const firstDayOfWeek = dayjs().startOf("week").format("D MMMM");
	const lastDayOfWeek = dayjs().endOf("week").format("D MMMM");

	const completedPercentage = Math.round((data.completed * 100) / data.total);
	const goalsPerDay = data.goalsPerDay || [];

	async function handleUndoCompletedGoal(id: string) {
		await removeGoalCompletion(id);
		queryClient.invalidateQueries({ queryKey: ["pending-goals"] });
		queryClient.invalidateQueries({ queryKey: ["summary"] });
	}

	return (
		<div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<InOrbitIcon />
					<span className="text-lg font-semibold capitalize">
						{firstDayOfWeek} - {lastDayOfWeek}
					</span>
				</div>
				<DialogTrigger asChild>
					<Button>
						<Plus className="size-4" />
						Cadastrar meta
					</Button>
				</DialogTrigger>
			</div>
			<div className="flex flex-col gap-3">
				<Progress value={8} max={15}>
					<ProgressIndicator style={{ width: `${completedPercentage}%` }} />
				</Progress>
				<div className="flex items-center justify-between text-xs text-zinc-400">
					<span>
						Você completou{" "}
						<span className="text-zinc-100">{data.completed}</span> de{" "}
						<span className="text-zinc-100">{data.total}</span> metas nessa
						semana.
					</span>
					<span>{completedPercentage}%</span>
				</div>
				<Separator />
				<PendingGoals />
				<div className="flex flex-col gap-6">
					<h2 className="text-xl font-medium">Sua semana</h2>
					{Object.entries(goalsPerDay).map(([date, goals]) => {
						const weekDay = dayjs(date).format("dddd");
						const formattedDate = dayjs(date).format("D[ de ]MMMM");
						console.log(goalsPerDay);
						return (
							<div key={date} className="flex flex-col gap-4">
								<h3 className="font-medium">
									<span className="capitalize">{weekDay}</span>
									<span className="text-zinc-400 text-xs">
										{" "}
										({formattedDate})
									</span>
								</h3>
								<ul className="flex flex-col gap-3">
									{goals.map((goal) => {
										const time = dayjs(goal.completedAt).format("HH:mm");
										console.log(goal);
										return (
											<li key={goal.id} className="flex items-center gap-2">
												<CheckCircle2 className="size-4 text-pink-500" />
												<span className="text-sm text-zinc-400">
													Você completou ""
													<span className="text-zinc-100">{goal.title}</span>"{" "}
													<span className="text-zinc-100">{time}h</span>{" "}
													<button
														type="button"
														className="text-zinc-500 underline font-normal cursor-pointer"
														onClick={() => handleUndoCompletedGoal(goal.id)}
													>
														Desfazer
													</button>
												</span>
											</li>
										);
									})}
								</ul>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
