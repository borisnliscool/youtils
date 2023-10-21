import { writable } from "svelte/store";
import type { Toast } from "./index";

export const toasts = writable<Toast[]>([]);

export const dismissToast = (id: number) => {
	toasts.update((all) => all.filter((t) => t.id !== id));
};

export const addToast = (toast: Omit<Toast, "id">) => {
	const id = Math.floor(Math.random() * 10000);

	const defaults: Toast = {
		id,
		type: "info",
		dismissible: true,
		timeout: 2500,
		message: "",
	};

	const finalToast = { ...defaults, ...toast };
	toasts.update((all) => [finalToast, ...all]);

	if (finalToast.timeout)
		setTimeout(() => dismissToast(id), finalToast.timeout);
};
