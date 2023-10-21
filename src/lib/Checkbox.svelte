<script lang="ts">
	import Icon from "@iconify/svelte";

	export let checked = false;
	export let label: string;

	export let id = String(Math.random() * 1000);
</script>

<label for={id} class="flex items-center gap-2 cursor-pointer">
	<input type="checkbox" name="checkbox" {id} class="sr-only" bind:checked />

	<div
		class="w-5 aspect-square border rounded-sm grid place-items-center transition-all"
		class:bg-neutral-800={!checked}
		class:border-neutral-700={!checked}
		class:bg-red-500={checked}
		class:border-red-500={checked}
	>
		<span class="opacity-0 transition-all text-xs" class:opacity-100={checked}>
			<Icon icon="fa6-solid:check" />
		</span>
	</div>

	{#if label}
		<p class="select-none">{label}</p>
	{/if}
</label>
