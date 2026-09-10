import type { Action } from 'svelte/action';

/**
 * Lays work out like plates on a shelf: every piece in a row shares one
 * height, its width follows its own proportions, and the row is scaled so it
 * fills the measured width exactly. Nothing is cropped and no cell is ever
 * left empty — the raggedness of a masonry wall comes from packing cells into
 * fixed columns, and a shelf has no columns to leave blank.
 *
 * Each direct child carries `data-ratio` (w/h) and may hold a `[data-media]`
 * box, which is the element that gets the computed size, plus a `[data-caption]`
 * below it.
 *
 * Tuned from the container in CSS, not here:
 *   --row-h       the height a row aims for before it is scaled to fit
 *   --row-max     most pieces allowed in one row, so a run of narrow work
 *                 can't crowd together and shrink to thumbnails
 *   --row-stretch how far a short trailing row may grow to close the gap
 *                 before it's left alone rather than blown up
 */
export const shelf: Action<HTMLElement, unknown> = (node: HTMLElement) => {
	function layout() {
		const style = getComputedStyle(node);
		const gap = parseFloat(style.columnGap) || 0;
		const target = parseFloat(style.getPropertyValue('--row-h')) || 240;
		const maxPerRow = parseInt(style.getPropertyValue('--row-max')) || 4;
		const stretch = parseFloat(style.getPropertyValue('--row-stretch')) || 1.5;
		const padX = (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0);
		const width = node.clientWidth - padX;
		if (width <= 0 || target <= 0) return;

		const cells = Array.from(node.children) as HTMLElement[];
		const ratios = cells.map((c) => parseFloat(c.dataset.ratio || '0.8') || 0.8);

		// ── Pass 1: where do the rows break? ──────────────────────────────
		// Grow a row until the pieces, at their natural width for the target
		// height, no longer fit. The piece that overflows stays in; the row then
		// scales down to accommodate it.
		const rows: number[][] = [];
		let row: number[] = [];
		let sum = 0;
		for (let i = 0; i < cells.length; i++) {
			row.push(i);
			sum += ratios[i];
			if (row.length >= maxPerRow || sum * target + (row.length - 1) * gap >= width) {
				rows.push(row);
				row = [];
				sum = 0;
			}
		}
		if (row.length) rows.push(row);

		// A single piece stranded on the last row reads as a mistake. Pull one
		// down from the row above so both rows are full enough to justify.
		if (rows.length > 1) {
			const last = rows[rows.length - 1];
			const prev = rows[rows.length - 2];
			if (last.length === 1 && prev.length > 2) last.unshift(prev.pop()!);
		}

		// ── Pass 2: size each row ─────────────────────────────────────────
		for (let r = 0; r < rows.length; r++) {
			const cols = rows[r];
			const ratioSum = cols.reduce((t, i) => t + ratios[i], 0);
			const avail = Math.floor(width - (cols.length - 1) * gap);
			const fit = avail / ratioSum;

			// Only the final row may come up short: let it grow toward the full
			// width, but not past `--row-stretch`, so two portrait pieces don't
			// balloon to fill a wide screen on their own.
			const isLast = r === rows.length - 1;
			const h = Math.round(isLast ? Math.min(fit, target * stretch) : fit);
			const justified = !isLast || fit <= target * stretch;

			let used = 0;
			for (let k = 0; k < cols.length; k++) {
				// The final piece absorbs the rounding, so widths plus gaps land on
				// exactly the container width and the row can't wrap early.
				const w =
					justified && k === cols.length - 1 ? avail - used : Math.floor(ratios[cols[k]] * h);
				used += w;
				const cell = cells[cols[k]];
				cell.style.width = `${w}px`;
				const media = cell.querySelector<HTMLElement>('[data-media]');
				if (media) {
					media.style.width = `${w}px`;
					media.style.height = `${h}px`;
				}
			}
		}
	}

	node.classList.add('is-shelved');
	const ro = new ResizeObserver(layout);
	ro.observe(node);
	layout();
	// Row heights come from the image box, but caption text shifting as
	// Josefin Sans / Inter swap in still changes where the next row starts.
	document.fonts?.ready.then(layout);

	return {
		update: layout,
		destroy: () => ro.disconnect()
	};
};
