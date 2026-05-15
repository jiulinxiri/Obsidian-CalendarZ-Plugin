import { AbstractInputSuggest, App } from "obsidian";

/**
 * Obsidian-style text input suggest for path-like values.
 * Provides inline filtering and click-to-select behavior.
 */
export class InputPathSuggest extends AbstractInputSuggest<string> {
	constructor(
		app: App,
		private inputEl: HTMLInputElement,
		private getCandidates: () => string[],
		private onSelectValue: (value: string) => void
	) {
		super(app, inputEl);
	}

	getSuggestions(inputStr: string): string[] {
		const query = inputStr.trim().toLowerCase();
		const candidates = this.getCandidates();
		if (!query) return candidates.slice(0, 100);

		return candidates
			.filter(path => path.toLowerCase().includes(query))
			.slice(0, 100);
	}

	renderSuggestion(value: string, el: HTMLElement): void {
		el.setText(value);
	}

	selectSuggestion(value: string): void {
		this.inputEl.value = value;
		this.inputEl.trigger("input");
		this.close();
		this.onSelectValue(value);
	}
}
