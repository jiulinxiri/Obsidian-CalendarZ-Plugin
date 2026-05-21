import { App, Modal, ButtonComponent } from "obsidian";
import type { I18nLike } from "../../core/types";

/**
 * Confirmation modal dialog for creating notes.
 * Displays a message with the target date and Cancel/Create buttons.
 */
export class ConfirmModal extends Modal {
	/** i18n object for translated strings */
	private i18n: I18nLike;
	/** Date string to display in the confirmation message */
	private dateStr: string;
	/** Callback invoked when the user confirms creation */
	private onConfirm: () => void;
	/** Optional title override for non-daily note confirmations */
	private title?: string;
	/** Optional message template override for non-daily note confirmations */
	private message?: string;

	/**
	 * Creates a new ConfirmModal instance
	 * @param app - Obsidian app instance
	 * @param i18n - i18n object for translated strings
	 * @param dateStr - Date string to display in the message
	 * @param onConfirm - Callback to invoke on confirmation
	 */
	constructor(
		app: App,
		i18n: I18nLike,
		dateStr: string,
		onConfirm: () => void,
		options?: {
			title?: string;
			message?: string;
		}
	) {
		super(app);
		this.i18n = i18n;
		this.dateStr = dateStr;
		this.onConfirm = onConfirm;
		this.title = options?.title;
		this.message = options?.message;
	}

	/**
	 * Builds the modal content when opened.
	 * Renders the title, message with date placeholder, and action buttons.
	 */
	onOpen(): void {
		const { contentEl } = this;
		const t = this.i18n.modal as Record<string, string>;

		const title = this.title ?? t.confirmTitle ?? "Confirm";
		const message = this.message ?? t.confirmMessage ?? "Create note for {{date}}?";

		contentEl.createEl("h3", { text: title });
		contentEl.createEl("p", { text: message.replace(/\{\{date\}\}/g, this.dateStr) });

		const buttonContainer = contentEl.createDiv({ cls: "modal-button-container" });

		new ButtonComponent(buttonContainer)
			.setButtonText(t.cancelButton ?? "Cancel")
			.onClick(() => this.close());

		new ButtonComponent(buttonContainer)
			.setButtonText(t.createButton ?? "Create")
			.setCta()
			.onClick(() => {
				this.close();
				this.onConfirm();
			});
	}

	/**
	 * Cleans up modal content when closed.
	 */
	onClose(): void {
		const { contentEl } = this;
		contentEl.empty();
	}
}
