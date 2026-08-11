export function JsonResponse(body, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	});
}

export function AllowedMethods(allowed) {
	return new Response(JSON.stringify({ success: false }), {
		status: 405,
		headers: {
			"Content-Type": "application/json",
			Allow: allowed.join(", "),
		},
	});
}
