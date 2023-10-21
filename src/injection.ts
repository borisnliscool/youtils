import browser from "webextension-polyfill";

function parseViewCount(viewCount: string): number {
	if (viewCount.toLowerCase() === "no views") {
		return 0;
	}

	const viewCountRegex = /(\d+\.*\d*)([MK]*)\s(views|view)/gi;
	const match = viewCount.match(viewCountRegex);

	if (match) {
		const count = parseFloat(match[1]);
		const multiplier = match[2] === "M" ? 1000000 : match[2] === "K" ? 1000 : 1;
		return Math.floor(count * multiplier);
	}

	return NaN;
}

function handleRemoveLowViewVideos(minViews: number) {
	switch (window.location.pathname) {
		case "/watch":
			document
				.querySelectorAll("ytd-compact-video-renderer")
				.forEach((video) => {
					const viewCountElement = video.querySelector(
						"#dismissible .details .metadata a .secondary-metadata #metadata #metadata-line span"
					) as HTMLSpanElement;
					if (!viewCountElement) return;

					const viewCount = parseViewCount(viewCountElement.innerText);
					if (viewCount < minViews) video.remove();
				});
			break;
		case "/":
		default:
			document.querySelectorAll("ytd-rich-item-renderer").forEach((video) => {
				const viewCountElement = video
					.querySelector("#details")
					?.querySelector("span");
				if (!viewCountElement) return;

				const viewCount = parseViewCount(viewCountElement.innerText);

				if (viewCount < minViews) video.remove();
			});
			break;
	}
}

function handleRemoveShorts() {
	document
		.querySelectorAll("ytd-reel-shelf-renderer")
		.forEach((e) => e.remove());
	document
		.querySelectorAll("ytd-guide-entry-renderer")
		.forEach((e) => e.innerHTML.includes("Shorts") && e.remove());
}

async function main() {
	if (window.location.host !== "www.youtube.com") return;

	const { removeShorts, removeLowViewVideos, minViews } =
		await browser.storage.local.get([
			"removeShorts",
			"removeLowViewVideos",
			"minViews",
		]);

	if (!removeShorts && !removeLowViewVideos) return;

	const observer = new MutationObserver(() => {
		if (removeShorts) handleRemoveShorts();
		if (removeLowViewVideos) handleRemoveLowViewVideos(minViews);
	});
	observer.observe(document.body, { childList: true, subtree: true });
}

main();
