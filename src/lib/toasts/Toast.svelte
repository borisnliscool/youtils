<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import type { ToastType } from "./index";
	import Icon from "@iconify/svelte";

	export let type: ToastType = "info";
	export let dismissible = true;

	const dispatcher = createEventDispatcher();
	const dismiss = () => dispatcher("dismiss");

	const allStyles: Record<ToastType, { bg: string; text: string }> = {
		info: {
			bg: "bg-blue-500",
			text: "text-white",
		},
		error: {
			bg: "bg-red-500",
			text: "text-white",
		},
		success: {
			bg: "bg-green-500",
			text: "text-white",
		},
	};

	$: styles = allStyles[type];
</script>

<div
	class="flex items-center justify-between text-sm {styles.bg} {styles.text}"
>
	<p class="p-2 px-4">
		<slot />
	</p>

	{#if dismissible}
		<button class="p-2 px-4" on:click|once={dismiss}>
			<Icon icon="fa6-solid:xmark" />
		</button>
	{/if}
</div>
