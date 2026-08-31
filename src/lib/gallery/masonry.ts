import type { Action } from 'svelte/action';

/**
 * How many columns a work wants, given its aspect ratio and the grid's current
 * column count. Wide work earns width; a curated `feature` earns a hero cell.
 * Always clamped to what fits, so a panorama becomes full-bleed on mobile
 * rather than overflowing.
 */
export function spanCols(ratio: number, feature: boolean, cols: number): number {
	let want = 1;
	if (ratio >= 2.2)
		want = cols >= 6 ? 3 : 2; // panoramic strips & double-page spreads
	else if (ratio >= 1.45)
		want = 2; // landscape
	else if (feature) want = 2; // curatorial emphasis for portrait/square pieces
	return Math.max(1, Math.min(cols, want));
}

/**
 * Turns a `.wall` grid into an intrinsic, crop-free masonry. Each direct child
 * carries `data-ratio` (and optionally `data-feature` or an explicit
 * `data-cols`); from the measured column width we derive the exact row span so
 * the cell matches the work's true proportions. Recomputes on resize, which
 * also catches the `--cols` breakpoint changes.
 */
export const masonry: Action = (node: HTMLElement) => {
	function layout() {
		const style = getComputedStyle(node);
		// `--cols` is unitless; gap and the row unit must be read from resolved
		// properties (in px) — a custom property would still read as "0.75rem".
		const cols = parseInt(style.getPropertyValue('--cols')) || 1;
		const gap = parseFloat(style.rowGap) || 0;
		const row = parseFloat(style.gridAutoRows) || 1;
		const padX =
			(parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0);
		const colW = (node.clientWidth - padX - (cols - 1) * gap) / cols;
		if (colW <= 0) return;

		for (const cell of Array.from(node.children) as HTMLElement[]) {
			const ratio = parseFloat(cell.dataset.ratio || '0.8') || 0.8;
			const feature = cell.dataset.feature === 'true';
			const want = cell.dataset.cols ? parseInt(cell.dataset.cols) : spanCols(ratio, feature, cols);
			const c = Math.max(1, Math.min(cols, want));
			const cellW = c * colW + (c - 1) * gap;
			const cellH = cellW / ratio;
			const rowSpan = Math.max(1, Math.round((cellH + gap) / (row + gap)));
			cell.style.gridColumnEnd = `span ${c}`;
			cell.style.gridRowEnd = `span ${rowSpan}`;
		}
	}

	node.classList.add('is-packed');
	const ro = new ResizeObserver(layout);
	ro.observe(node);
	layout();

	return {
		update: layout,
		destroy: () => ro.disconnect()
	};
};
