export interface Toast {
	id: number;
	type?: ToastType;
	dismissible?: boolean;
	timeout?: number;
	message: string;
}

export type ToastType = "info" | "success" | "error";
