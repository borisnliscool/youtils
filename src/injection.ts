import browser from "webextension-polyfill";

function parseViewCount(viewCount: string): number {
	const viewCountRegex = /([\d.]+)\s*([MK]*)\s*view/gi;
	const match = viewCountRegex.exec(viewCount);

	if (match) {
		const count = parseFloat(match[1]);
		const match2 = match[2].toUpperCase();
		const multiplier = match2 === "M" ? 1000000 : match2 === "K" ? 1000 : 1;
		return Math.floor(count * multiplier);
	}

	return 0;
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

function handleRemoveStreams() {
	switch (window.location.pathname) {
		case "/watch":
			document
				.querySelectorAll("ytd-compact-video-renderer")
				.forEach(
					(video) =>
						video
							.querySelector(
								"#dismissible .details .metadata a .secondary-metadata ytd-badge-supported-renderer .badge p"
							)
							?.innerHTML.includes("LIVE") && video.remove()
				);
			break;
		case "/":
		default:
			break;
	}
}

function handleRemoveStreamVODs() {
	switch (window.location.pathname) {
		case "/watch":
			break;
		case "/":
		default:
			document
				.querySelectorAll("ytd-rich-item-renderer")
				.forEach(
					(video) =>
						video
							.querySelector("#metadata-line")
							?.innerHTML.includes("Streamed") && video.remove()
				);
			break;
	}
}

async function main() {
	if (window.location.host !== "www.youtube.com") return;

	const {
		removeShorts,
		removeStreams,
		removeStreamVODs,
		removeLowViewVideos,
		minViews,
	} = await browser.storage.local.get([
		"removeShorts",
		"removeStreams",
		"removeStreamVODs",
		"removeLowViewVideos",
		"minViews",
	]);

	if (
		!removeShorts &&
		!removeStreams &&
		!removeLowViewVideos &&
		!removeStreamVODs
	)
		return;

	const observer = new MutationObserver(() => {
		if (removeShorts) handleRemoveShorts();
		if (removeStreams) handleRemoveStreams();
		if (removeStreamVODs) handleRemoveStreamVODs();
		if (removeLowViewVideos) handleRemoveLowViewVideos(minViews);
	});
	observer.observe(document.body, { childList: true, subtree: true });
}

main();
