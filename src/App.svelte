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
	class="relative w-96 p-8 flex flex-col items-center gap-6 bg-neutral-800 text-white text-base"
>
	<h1 class="text-3xl font-extrabold">Youtils</h1>

	<div class="w-full flex flex-col">
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
				<div
					class="w-full my-1 ml-2 px-2 py-0.5 border-l-[.125rem] border-neutral-700"
					transition:slide
				>
					<p class="text-neutral-400 text-xs ml-1 -mt-0.5">Minium views</p>
					<div class="flex items-center gap-2">
						<input
							class="w-full rounded-full overflow-hidden appearance-none bg-neutral-900 accent-red-500 shadow-inner"
							type="range"
							min="1000"
							max="100000"
							step="1000"
							bind:value={minViews}
						/>

						<input
							type="number"
							class="bg-transparent w-16 text-center text-neutral-400 transition-all focus:text-white outline-none focus:outline-1 focus:outline-red-500 focus:bg-red-50/5 rounded-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
							bind:value={minViews}
						/>
					</div>
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
			class="w-full p-2 text-neutral-500 border border-neutral-700 rounded-md outline-none"
			on:click={reset}
		>
			Reset
		</button>
	</div>

	<div class="absolute bottom-0 left-0 w-full">
		<Toasts />
	</div>
</main>
