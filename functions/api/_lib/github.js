const DEFAULT_OWNER = "rtrigoso";
const DEFAULT_REPO = "renfoc.us";
const DEFAULT_BRANCH = "main";
const CONTENT_DIR = "content";

export class GitHubApiError extends Error {
	constructor(status, body) {
		super(`GitHub API request failed with status ${status}`);
		this.status = status;
		this.body = body;
	}
}

export class RebaseConflictError extends Error {
	constructor(body) {
		super("GitHub rejected the write due to a conflicting change");
		this.body = body;
	}
}

function getRepoConfig(env) {
	return {
		owner: env.GITHUB_OWNER || DEFAULT_OWNER,
		repo: env.GITHUB_REPO || DEFAULT_REPO,
		branch: env.GITHUB_BRANCH || DEFAULT_BRANCH,
		token: env.GITHUB_TOKEN,
	};
}

async function githubApiRequest(env, path, init = {}) {
	const { owner, repo, token } = getRepoConfig(env);
	const headers = {
		Accept: "application/vnd.github+json",
		"User-Agent": "renfoc.us-editor",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
		...(init.headers || {}),
	};

	return fetch(`https://api.github.com/repos/${owner}/${repo}${path}`, { ...init, headers });
}

async function throwIfWriteFailed(response) {
	if (response.status === 409 || response.status === 422) {
		throw new RebaseConflictError(await response.text());
	}
	if (!response.ok) {
		throw new GitHubApiError(response.status, await response.text());
	}
}

export async function ListContentFiles(env, branch) {
	const { branch: defaultBranch } = getRepoConfig(env);
	const ref = branch || defaultBranch;
	const response = await githubApiRequest(env, `/contents/${CONTENT_DIR}?ref=${encodeURIComponent(ref)}`);

	if (response.status === 404) return [];
	if (!response.ok) throw new GitHubApiError(response.status, await response.text());

	const entries = await response.json();
	return entries.filter((entry) => entry.type === "file" && entry.name.endsWith(".md"));
}

export async function FindContentFilenameById(env, id, branch) {
	const files = await ListContentFiles(env, branch);
	const match = files.find((file) => file.name.startsWith(`${id}-`));
	return match ? match.name : null;
}

export async function FetchRawContentFile(env, filename, branch) {
	const { owner, repo, branch: defaultBranch } = getRepoConfig(env);
	const ref = branch || defaultBranch;
	const response = await fetch(
		`https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${CONTENT_DIR}/${filename}`
	);

	if (response.status === 404) return null;
	if (!response.ok) throw new GitHubApiError(response.status, await response.text());

	return response.text();
}

export async function GetContentFileMeta(env, filename, branch) {
	const { branch: defaultBranch } = getRepoConfig(env);
	const ref = branch || defaultBranch;
	const response = await githubApiRequest(
		env,
		`/contents/${CONTENT_DIR}/${filename}?ref=${encodeURIComponent(ref)}`
	);

	if (response.status === 404) return null;
	if (!response.ok) throw new GitHubApiError(response.status, await response.text());

	return response.json();
}

export async function PutContentFile(env, filename, content, message, branch, sha) {
	const { branch: defaultBranch } = getRepoConfig(env);
	const ref = branch || defaultBranch;
	const response = await githubApiRequest(env, `/contents/${CONTENT_DIR}/${filename}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			message,
			branch: ref,
			content: base64Encode(content),
			...(sha ? { sha } : {}),
		}),
	});

	await throwIfWriteFailed(response);
	return response.json();
}

export async function DeleteContentFile(env, filename, message, branch, sha) {
	const { branch: defaultBranch } = getRepoConfig(env);
	const ref = branch || defaultBranch;
	const response = await githubApiRequest(env, `/contents/${CONTENT_DIR}/${filename}`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ message, branch: ref, sha }),
	});

	await throwIfWriteFailed(response);
	return response.json();
}

function base64Encode(str) {
	const bytes = new TextEncoder().encode(str);
	let binary = "";
	bytes.forEach((byte) => {
		binary += String.fromCharCode(byte);
	});
	return btoa(binary);
}
