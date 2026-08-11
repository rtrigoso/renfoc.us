import { ListContentFiles, FetchRawContentFile } from "./_lib/github.js";
import { ParsePostFile } from "./_lib/postFile.js";
import { JsonResponse, AllowedMethods } from "./_lib/response.js";

export async function onRequest({ request, env }) {
	switch (request.method) {
		case "GET":
			return handleGet(request, env);
		default:
			return AllowedMethods(["GET"]);
	}
}

async function handleGet(request, env) {
	const branch = new URL(request.url).searchParams.get("branch") || undefined;

	try {
		const files = await ListContentFiles(env, branch);
		const posts = await Promise.all(
			files.map(async (file) => {
				const raw = await FetchRawContentFile(env, file.name, branch);
				return raw === null ? null : toSummary(ParsePostFile(file.name, raw));
			})
		);

		const sorted = posts.filter((post) => post !== null).sort((a, b) => b.created - a.created);

		return JsonResponse({ posts: sorted, success: true });
	} catch {
		return JsonResponse({ posts: [], success: false }, 502);
	}
}

function toSummary(post) {
	return {
		name: post.name,
		id: post.id,
		created: post.created,
		updated: post.updated,
		description: post.description,
	};
}
