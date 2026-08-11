import {
	FindContentFilenameById,
	FetchRawContentFile,
	GetContentFileMeta,
	PutContentFile,
	DeleteContentFile,
	RebaseConflictError,
} from "./_lib/github.js";
import { ParsePostFile, SerializePostFile, BuildContentFilename } from "./_lib/postFile.js";
import { JsonResponse, AllowedMethods } from "./_lib/response.js";

export async function onRequest({ request, env }) {
	switch (request.method) {
		case "GET":
			return handleGet(request, env);
		case "POST":
			return handleCreate(request, env);
		case "PUT":
			return handleUpdate(request, env);
		case "DELETE":
			return handleDelete(request, env);
		default:
			return AllowedMethods(["GET", "POST", "PUT", "DELETE"]);
	}
}

async function handleGet(request, env) {
	const url = parseRequestUrl(request);
	const id = getQueryId(url);
	const branch = getQueryBranch(url);

	if (!id) return postErrorResponse(400);

	const filename = await FindContentFilenameById(env, id, branch);
	if (!filename) return postErrorResponse(404);

	const raw = await FetchRawContentFile(env, filename, branch);
	if (raw === null) return postErrorResponse(404);

	return postResponse(ParsePostFile(filename, raw));
}

async function handleCreate(request, env) {
	const payload = await readJson(request);
	if (!hasPostName(payload)) return postErrorResponse(400);

	const branch = getPayloadBranch(payload);
	const id = generatePostId();
	const filename = BuildContentFilename(id, payload.name);
	const content = SerializePostFile(payload);

	const write = await runGitHubWrite(() =>
		PutContentFile(env, filename, content, buildCommitMessage("Add", payload.name), branch)
	);
	if (!write.ok) return postErrorResponse(write.status);

	return postResponse(ParsePostFile(filename, content), 201);
}

async function handleUpdate(request, env) {
	const url = parseRequestUrl(request);
	const payload = await readJson(request);
	const id = resolveUpdateId(url, payload);

	if (!id || !hasPostName(payload)) return postErrorResponse(400);

	const branch = getPayloadBranch(payload);
	const filename = await FindContentFilenameById(env, id, branch);
	if (!filename) return postErrorResponse(404);

	const sha = await getFileSha(env, filename, branch);
	if (!sha) return postErrorResponse(404);

	const content = SerializePostFile(payload);
	const write = await runGitHubWrite(() =>
		PutContentFile(env, filename, content, buildCommitMessage("Update", payload.name), branch, sha)
	);
	if (!write.ok) return postErrorResponse(write.status);

	return postResponse(ParsePostFile(filename, content));
}

async function handleDelete(request, env) {
	const url = parseRequestUrl(request);
	const id = getQueryId(url);
	const branch = getQueryBranch(url);

	if (!id) return postErrorResponse(400);

	const filename = await FindContentFilenameById(env, id, branch);
	if (!filename) return postErrorResponse(404);

	const sha = await getFileSha(env, filename, branch);
	if (!sha) return postErrorResponse(404);

	const write = await runGitHubWrite(() =>
		DeleteContentFile(env, filename, buildCommitMessage("Delete", filename), branch, sha)
	);
	if (!write.ok) return postErrorResponse(write.status);

	return postResponse(null);
}

function parseRequestUrl(request) {
	return new URL(request.url);
}

function getQueryId(url) {
	return url.searchParams.get("id");
}

function getQueryBranch(url) {
	return url.searchParams.get("branch") || undefined;
}

function resolveUpdateId(url, payload) {
	return getQueryId(url) || payload?.id;
}

function getPayloadBranch(payload) {
	return payload?.branch || undefined;
}

function hasPostName(payload) {
	return Boolean(payload && payload.name);
}

function generatePostId() {
	return Math.floor(Date.now() / 1000);
}

function buildCommitMessage(action, name) {
	return `${action} post: ${name}`;
}

async function getFileSha(env, filename, branch) {
	const meta = await GetContentFileMeta(env, filename, branch);
	return meta ? meta.sha : null;
}

async function readJson(request) {
	try {
		return await request.json();
	} catch {
		return null;
	}
}

async function runGitHubWrite(operation) {
	try {
		await operation();
		return { ok: true };
	} catch (error) {
		if (error instanceof RebaseConflictError) return { ok: false, status: 409 };
		return { ok: false, status: 502 };
	}
}

function postResponse(post, status = 200) {
	return JsonResponse({ post, success: true }, status);
}

function postErrorResponse(status) {
	return JsonResponse({ post: null, success: false }, status);
}
