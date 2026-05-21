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

	open(): void {
		super.open();
		this.scheduleSuggestionGeometrySync();
	}

	private scheduleSuggestionGeometrySync(): void {
		this.syncSuggestionGeometry();
		this.inputEl.ownerDocument.defaultView?.requestAnimationFrame(() => {
			this.syncSuggestionGeometry();
			this.inputEl.ownerDocument.defaultView?.requestAnimationFrame(() => {
				this.syncSuggestionGeometry();
			});
		});
	}

	private syncSuggestionGeometry(): void {
		const width = `${this.inputEl.offsetWidth}px`;
		const inputRect = this.inputEl.getBoundingClientRect();
		const internal = this as unknown as {
			suggest?: {
				suggestEl?: HTMLElement;
			};
		};

		const currentSuggestEl = internal.suggest?.suggestEl;
		if (currentSuggestEl) {
			this.applySuggestionGeometry(currentSuggestEl, width, inputRect);
			return;
		}

		// Fallback: find the nearest visible suggestion container in DOM.
		const doc = this.inputEl.ownerDocument;
		const visibleContainers = Array.from(doc.querySelectorAll<HTMLElement>(".suggestion-container"))
			.filter(el => el.offsetParent !== null);
		if (visibleContainers.length === 0) return;

		const closest = visibleContainers.reduce((best, current) => {
			const rect = current.getBoundingClientRect();
			const bestRect = best.getBoundingClientRect();
			const bestDistance = Math.abs(bestRect.left - inputRect.left) + Math.abs(bestRect.top - inputRect.bottom);
			const currentDistance = Math.abs(rect.left - inputRect.left) + Math.abs(rect.top - inputRect.bottom);
			return currentDistance < bestDistance ? current : best;
		});

		this.applySuggestionGeometry(closest, width, inputRect);
	}

	private applySuggestionGeometry(
		suggestEl: HTMLElement,
		width: string,
		inputRect: DOMRect
	): void {
		// Obsidian may position the popover before our 180px width is applied.
		// Re-anchor it to the input after sizing so the first open is aligned too.
		suggestEl.style.position = "fixed";
		suggestEl.style.left = `${inputRect.left}px`;
		suggestEl.style.top = `${inputRect.bottom}px`;
		suggestEl.style.width = width;
		suggestEl.style.minWidth = width;
		suggestEl.style.maxWidth = width;
		suggestEl.addClass("calendarz-path-suggest");
	}

	getSuggestions(inputStr: string): string[] {
		this.scheduleSuggestionGeometrySync();

		const query = inputStr.trim().toLowerCase();
		const candidates = this.getCandidates();
		if (!query) return candidates.slice(0, 100);

		return candidates
			.filter(path => path.toLowerCase().includes(query))
			.slice(0, 100);
	}

	renderSuggestion(value: string, el: HTMLElement): void {
		this.scheduleSuggestionGeometrySync();
		el.setText(value);
	}

	selectSuggestion(value: string): void {
		this.inputEl.value = value;
		this.inputEl.trigger("input");
		this.close();
		this.onSelectValue(value);
	}
}
