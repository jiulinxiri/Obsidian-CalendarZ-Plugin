import { App, normalizePath } from "obsidian";

/**
 * Ensures every folder segment before the note filename exists.
 * This supports note formats that include nested paths, such as YYYY/YYYY-MM.
 */
export async function ensureNoteParentFolder(app: App, notePath: string): Promise<void> {
	const normalizedPath = normalizePath(notePath);
	const segments = normalizedPath.split("/");
	segments.pop();

	if (segments.length === 0) return;

	let currentPath = "";
	for (const segment of segments) {
		currentPath = currentPath ? `${currentPath}/${segment}` : segment;
		if (!app.vault.getFolderByPath(currentPath)) {
			await app.vault.createFolder(currentPath);
		}
	}
}
