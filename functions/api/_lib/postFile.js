const FILENAME_PATTERN = /^(\d+)-(.+)\.md$/;
const TAGS_PATTERN = /\{\/\*tags\n([\s\S]*?)\n\*\/\}/;
const DESCRIPTION_PATTERN = /\{\/\*description\n([\s\S]*?)\n\*\/\}/;
const DATE_PATTERN = /######\s*(\d{2})-(\d{2})-(\d{4})/;
const TITLE_PATTERN = /^##\s+(.+)$/m;

export function ParseContentFilename(filename) {
	const match = filename.match(FILENAME_PATTERN);
	if (!match) return null;

	const [, timestamp, slug] = match;
	return { id: parseInt(timestamp, 10), slug };
}

export function BuildContentFilename(id, title) {
	return `${id}-${Slugify(title)}.md`;
}

export function Slugify(title) {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "_")
		.replace(/^_+|_+$/g, "");
}

export function ExtractTags(raw) {
	const match = raw.match(TAGS_PATTERN);
	if (!match) return [];
	return match[1].split("\n").map((t) => t.trim()).filter(Boolean);
}

export function ExtractDescription(raw) {
	const match = raw.match(DESCRIPTION_PATTERN);
	return match ? match[1].trim() : "";
}

export function ExtractTitle(raw, fallback) {
	const match = raw.match(TITLE_PATTERN);
	return match ? match[1].trim() : fallback;
}

export function ExtractUpdatedTimestamp(raw) {
	const match = raw.match(DATE_PATTERN);
	if (!match) return null;

	const [, month, day, year] = match;
	return Date.UTC(Number(year), Number(month) - 1, Number(day));
}

export function ExtractBody(raw) {
	const titleMatch = raw.match(TITLE_PATTERN);
	if (!titleMatch) return raw.trim();

	return raw.slice(titleMatch.index + titleMatch[0].length).replace(/^\n+/, "");
}

export function ParsePostFile(filename, raw) {
	const parsedName = ParseContentFilename(filename);
	if (!parsedName) throw new Error(`Unexpected content filename: ${filename}`);

	const { id, slug } = parsedName;

	return {
		name: ExtractTitle(raw, slug.replaceAll("_", " ")),
		id,
		created: id * 1000,
		updated: ExtractUpdatedTimestamp(raw),
		description: ExtractDescription(raw),
		body: ExtractBody(raw),
		tags: ExtractTags(raw),
	};
}

export function SerializePostFile({ name, description, tags, body, updated }) {
	const blocks = [];

	if (tags && tags.length) blocks.push(`{/*tags\n${tags.join("\n")}\n*/}`);
	if (description) blocks.push(`{/*description\n${description.trim()}\n*/}`);

	const header = `###### ${FormatDate(updated ?? Date.now())}\n## ${name}`;
	const sections = [...blocks, header].join("\n");

	return `${sections}\n\n${(body || "").trim()}\n`;
}

function FormatDate(timestamp) {
	const d = new Date(timestamp);
	const mm = String(d.getMonth() + 1).padStart(2, "0");
	const dd = String(d.getDate()).padStart(2, "0");
	return `${mm}-${dd}-${d.getFullYear()}`;
}
