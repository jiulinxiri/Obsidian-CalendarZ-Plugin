import { TFile, TFolder } from "obsidian";
import type { PluginLike } from "../../core/types";

function ensureCurrentValue(candidates: string[], currentValue: string): string[] {
	if (currentValue && !candidates.includes(currentValue)) {
		candidates.unshift(currentValue);
	}
	return candidates;
}

export function buildTemplateSuggestions(plugin: PluginLike, currentValue: string): string[] {
	const files = plugin.app.vault
		.getAllLoadedFiles()
		.filter((file): file is TFile => file instanceof TFile && file.extension === "md")
		.map(file => file.path)
		.sort((a, b) => a.localeCompare(b));

	return ensureCurrentValue(files, currentValue);
}

export function buildFolderSuggestions(plugin: PluginLike, currentValue: string): string[] {
	const folders = plugin.app.vault
		.getAllLoadedFiles()
		.filter((file): file is TFolder => file instanceof TFolder && file.path.length > 0)
		.map(folder => folder.path)
		.sort((a, b) => a.localeCompare(b));

	return ensureCurrentValue(folders, currentValue);
}
