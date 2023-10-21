<script lang="ts">
	import Toast from "./Toast.svelte";
	import { dismissToast, toasts } from "./store";
</script>

{#if $toasts}
	<section>
		{#each $toasts.slice(0, 3) as toast (toast.id)}
			<Toast
				type={toast.type}
				dismissible={toast.dismissible}
				on:dismiss={() => dismissToast(toast.id)}
			>
				{toast.message}
			</Toast>
		{/each}
	</section>
{/if}
