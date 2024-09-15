export async function removeGoalCompletion(id: string) {
	console.log(id);
	const response = await fetch(`http://localhost:3333/goal-completion/${id}`, {
		method: "DELETE",
		headers: {
			"Content-type": "application/json",
		},
	});
	const data = await response.json();
	return data.result;
}
