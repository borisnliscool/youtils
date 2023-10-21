<script lang="ts">
	import { onMount } from "svelte";
	import browser from "webextension-polyfill";
	import Checkbox from "./lib/Checkbox.svelte";
	import { slide } from "svelte/transition";
	import Toasts from "./lib/toasts/Toasts.svelte";
	import { addToast } from "./lib/toasts/store";

	let removeShorts: boolean;
	let removeStreams: boolean;
	let removeStreamVODs: boolean;
	let removeLowViewVideos: boolean;
	let minViews: number;

	const init = async () => {
		const ret = await browser.storage.local.get([
			"removeShorts",
			"removeStreams",
			"removeStreamVODs",
			"removeLowViewVideos",
			"minViews",
		]);

		removeShorts = ret.removeShorts ?? false;
		removeStreams = ret.removeStreams ?? false;
		removeStreamVODs = ret.removeStreamVODs ?? false;
		removeLowViewVideos = ret.removeLowViewVideos ?? false;
		minViews = ret.minViews ?? 1000;
	};

	const reset = async () => {
		init();

		addToast({
			type: "info",
			message: "Reset to previous save.",
		});
	};

	const save = async () => {
		try {
			await browser.storage.local.set({
				removeShorts,
				removeStreams,
				removeStreamVODs,
				removeLowViewVideos,
				minViews,
			});

			addToast({
				type: "success",
				message: "Saved settings.",
			});
		} catch (error) {
			addToast({
				type: "error",
				message: "Failed to save settings.",
			});
		}
	};

	onMount(init);
</script>

<main
	class="relative w-72 p-6 py-8 flex flex-col items-center gap-6 bg-neutral-800 text-white text-base"
>
	<h1 class="text-3xl font-extrabold">Youtils</h1>

	<div class="w-full flex flex-col gap-1">
		<div>
			<Checkbox label="Remove YouTube Shorts" bind:checked={removeShorts} />
		</div>
		<div>
			<Checkbox label="Remove Streams" bind:checked={removeStreams} />
		</div>
		<div>
			<Checkbox label="Remove Stream VODs" bind:checked={removeStreamVODs} />
		</div>
		<div>
			<Checkbox
				label="Remove low view videos"
				bind:checked={removeLowViewVideos}
			/>

			{#if removeLowViewVideos}
				<div class="w-full mt-1" transition:slide>
					<input
						class="rounded-full overflow-hidden appearance-none bg-neutral-700 w-full accent-red-500 shadow-inner"
						type="range"
						min="1000"
						max="100000"
						step="1000"
						bind:value={minViews}
					/>
					<p class="text-neutral-500 text-xs pl-2">
						Minium views ({minViews / 1000}K)
					</p>
				</div>
			{/if}
		</div>
	</div>

	<div class="w-full flex flex-col gap-1 text-sm">
		<button
			class="w-full p-2 text-white bg-red-500 rounded-md outline-none"
			on:click={save}
		>
			Save
		</button>
		<button
			class="w-full p-2 text-white border border-neutral-700 rounded-md outline-none"
			on:click={reset}
		>
			Reset
		</button>
	</div>

	<div class="absolute bottom-0 left-0 w-full">
		<Toasts />
	</div>
</main>
