import { Dialog } from "./components/ui/dialog";
import { Summary } from "./components/summary";
import { EmptyGoals } from "./components/empty-goals";
import { getSummary } from "./http/get-summary";
import { useQuery } from "@tanstack/react-query";
import { CreateGoal } from "./components/create-goal";

export function App() {
	const { data } = useQuery({
		queryKey: ["summary"],
		queryFn: getSummary,
		staleTime: 1000 * 60,
	});
	return (
		<Dialog>
			{data && data.total > 0 ? <Summary /> : <EmptyGoals />}
			<CreateGoal />
		</Dialog>
	);
}
