#!/usr/bin/env node
/**
 * Bakes each work's hero-derived styling (books, comics, illustrations) into
 * its frontmatter so the detail page renders instantly (no client-side flash).
 * Runs automatically as part of
 * `pnpm build` (see package.json), so it works in CI/CD too — uses `sharp`, a
 * pure-npm decoder with prebuilt binaries (no system ImageMagick needed).
 *
 * Writes computed values to dedicated `*_auto` fields so they never overwrite a
 * manual override set in the CMS:
 *   - title_color_auto  : legible-on-white dominant/vibrant colour of the hero
 *   - nav_text_auto     : "light" | "dark" — contrast for the overlay nav
 *   - cover_ratio_auto  : intrinsic width/height of the cover, so the gallery
 *                         grid can size each tile to its true proportions and
 *                         never crop artwork (comics span wide, tall pieces run
 *                         tall). Manual override: `cover_ratio`.
 *   - shelf_hue_auto    : OKLCH hue (deg) of the cover's dominant colour
 *   - shelf_chroma_auto : 0..1 — how colourful the cover is overall
 *   - cover_light_auto  : 0..1 — mean luminance of the cover
 *
 * The last three drive BookCard's backdrop. Only the *hue* and two scalars are
 * baked, never a finished colour: the card assembles the tone in CSS from a
 * fixed lightness/chroma band, so ten different books land on ten backdrops
 * that still read as one set. See `--plate-*` in BookCard.svelte.
 *
 * Manual CMS fields still win: `title_color` and `nav_theme` (Light/Dark text).
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Every directory that can hold a work. `other` carries no .md today, but a
// missing directory here means a work silently ships with no baked colour —
// and since the client-side fallback was removed, nothing would recover it.
const WORK_DIRS = [
	'src/lib/content/art-page/books',
	'src/lib/content/art-page/comics',
	'src/lib/content/art-page/illustrations',
	'src/lib/content/art-page/other'
].filter((d) => existsSync(d));
const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const contentPathToFile = (p) => p.replace(/^\//, '');
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const srgbToLinear = (c) => {
	c /= 255;
	return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

/** sRGB 0..255 -> OKLCH. L 0..1, C ~0..0.4, H degrees. */
function oklch(r, g, b) {
	const R = srgbToLinear(r), G = srgbToLinear(g), B = srgbToLinear(b);
	const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
	const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
	const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
	const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
	const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
	const Bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
	let H = (Math.atan2(Bb, A) * 180) / Math.PI;
	if (H < 0) H += 360;
	return { L, C: Math.hypot(A, Bb), H };
}

async function analyse(file) {
	const { data, info } = await sharp(file)
		.resize(80, null, { fit: 'inside' })
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });

	const { width: w, height: h } = info;
	const buckets = new Map();
	const topRows = Math.max(1, Math.round(h * 0.16));
	let topLum = 0;
	let topCount = 0;

	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			const i = (y * w + x) * 4;
			const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
			if (a < 128) continue;
			if (y < topRows) {
				topLum += lum(r, g, b);
				topCount++;
			}
			const key = `${r >> 4},${g >> 4},${b >> 4}`;
			const e = buckets.get(key) ?? { r: 0, g: 0, b: 0, n: 0 };
			e.r += r; e.g += g; e.b += b; e.n++;
			buckets.set(key, e);
		}
	}

	const colors = [];
	for (const e of buckets.values()) {
		const r = e.r / e.n, g = e.g / e.n, b = e.b / e.n;
		const max = Math.max(r, g, b), min = Math.min(r, g, b);
		const sat = max === 0 ? 0 : (max - min) / max;
		colors.push({ r, g, b, count: e.n, sat, l: lum(r, g, b) });
	}

	// Prefer a vibrant accent: saturated, mid-tone, weighted by prominence
	const vivid = colors.filter((c) => c.sat >= 0.3 && c.l >= 28 && c.l <= 205);
	const pool = vivid.length ? vivid : colors.filter((c) => c.l >= 22 && c.l <= 236);

	let titleColor = null;
	if (pool.length) {
		// Quadratic saturation weight: favour the vibrant accent over prominent
		// but muted tones (skin, walls, paper) while still respecting area.
		let best = pool[0], bestW = -1;
		for (const c of pool) {
			const wgt = c.count * c.sat * c.sat;
			if (wgt > bestW) { bestW = wgt; best = c; }
		}
		let r = Math.round(best.r), g = Math.round(best.g), b = Math.round(best.b);
		const l = lum(r, g, b);
		if (l > 165) {
			const k = 165 / l;
			r = Math.round(r * k); g = Math.round(g * k); b = Math.round(b * k);
		}
		titleColor = `rgb(${r}, ${g}, ${b})`;
	}

	const navText = (topCount ? topLum / topCount : 255) > 140 ? 'dark' : 'light';
	return { titleColor, navText };
}

/**
 * The backdrop reading for a cover: which hue the book is, how colourful it is
 * overall, and how light it is.
 *
 * Hue comes from a 5° histogram weighted by saturation squared, so one vivid
 * area (a red board, a teal spread) wins over a large expanse of wall or paper
 * that is technically the most common colour but says nothing about the book.
 * Near-black and near-white pixels are excluded — their hue is noise.
 *
 * Chroma is the *mean* saturation of every pixel instead, because that is the
 * honest answer to "is this a colourful book", and it is what keeps a
 * black-and-white piece from being handed a confident purple backdrop. Chroma
 * in OKLCH falls off with lightness, so it is normalised by L first: a dark
 * olive box on black should still read as olive.
 */
async function plateOf(file) {
	const { data, info } = await sharp(file)
		.resize(80, null, { fit: 'inside' })
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });

	const BINS = 72; // 5° each
	const wgtX = new Array(BINS).fill(0);
	const wgtY = new Array(BINS).fill(0);
	const wgtSum = new Array(BINS).fill(0);
	let satSum = 0, lumSum = 0, n = 0;

	for (let i = 0; i < data.length; i += 4) {
		const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
		if (a < 128) continue;
		const { L, C, H } = oklch(r, g, b);
		const sat = C / Math.max(L, 0.25);
		satSum += sat;
		lumSum += lum(r, g, b) / 255;
		n++;
		if (L < 0.15 || L > 0.95) continue;
		const k = Math.floor(H / 5) % BINS;
		const wgt = sat * sat;
		wgtSum[k] += wgt;
		wgtX[k] += Math.cos((H * Math.PI) / 180) * wgt;
		wgtY[k] += Math.sin((H * Math.PI) / 180) * wgt;
	}
	if (!n) return null;

	let top = 0;
	for (let k = 1; k < BINS; k++) if (wgtSum[k] > wgtSum[top]) top = k;
	let hue = (Math.atan2(wgtY[top], wgtX[top]) * 180) / Math.PI;
	if (hue < 0) hue += 360;

	// Compressive: measured mean saturation spans ~0.006 (greyscale) to ~0.12
	// (a saturated red board). A linear map would flatten all but the loudest
	// book to nothing, so take a root and floor it — every backdrop keeps at
	// least a whisper of its hue.
	const chroma = clamp((satSum / n / 0.06) ** 0.55, 0.2, 1);

	return {
		hue: +hue.toFixed(1),
		chroma: +chroma.toFixed(3),
		light: +(lumSum / n).toFixed(3)
	};
}

/** Intrinsic aspect ratio (w/h) of an image, honouring EXIF orientation. */
async function ratioOf(file) {
	const { width, height } = await sharp(file).rotate().metadata();
	if (!width || !height) return null;
	return +(width / height).toFixed(3);
}

function upsert(src, key, value) {
	const fm = src.match(/^---\n([\s\S]*?)\n---/);
	if (!fm) return src;
	let body = fm[1];
	const line = `${key}: ${value}`;
	if (new RegExp(`^${key}:`, 'm').test(body)) {
		body = body.replace(new RegExp(`^${key}:.*$`, 'm'), line);
	} else {
		body = `${body}\n${line}`;
	}
	return src.replace(fm[0], `---\n${body}\n---`);
}

let processed = 0;
let skipped = 0;
const files = WORK_DIRS.flatMap((dir) =>
	readdirSync(dir)
		.filter((n) => n.endsWith('.md'))
		.map((n) => ({ dir, f: n }))
);
for (const { dir, f } of files) {
	const path = join(dir, f);
	let src = readFileSync(path, 'utf8');
	const heroMatch = src.match(/^hero_image:\s*(.+)$/m) || src.match(/^cover_image:\s*(.+)$/m);
	if (!heroMatch) {
		// Loud, because nothing catches this at runtime any more: the page will
		// render its title in the default ink rather than the work's colour.
		console.warn(`! ${f}: no hero_image or cover_image — no colour baked`);
		skipped++;
		continue;
	}
	const file = contentPathToFile(heroMatch[1].trim());
	if (!existsSync(file)) {
		console.warn(`! ${f}: hero not found (${file})`);
		continue;
	}
	try {
		const { titleColor, navText } = await analyse(file);
		if (titleColor) src = upsert(src, 'title_color_auto', `"${titleColor}"`);
		src = upsert(src, 'nav_text_auto', navText);

		// Ratio and backdrop are read from the cover, not the hero: they describe
		// the thumbnail, and a piece may carry a different image for its page.
		const coverMatch = src.match(/^cover_image:\s*(.+)$/m);
		let ratio = null;
		let plate = null;
		if (coverMatch) {
			const coverFile = contentPathToFile(coverMatch[1].trim());
			if (existsSync(coverFile)) {
				ratio = await ratioOf(coverFile);
				plate = await plateOf(coverFile);
			}
		}
		if (ratio) src = upsert(src, 'cover_ratio_auto', ratio);
		if (plate) {
			src = upsert(src, 'shelf_hue_auto', plate.hue);
			src = upsert(src, 'shelf_chroma_auto', plate.chroma);
			src = upsert(src, 'cover_light_auto', plate.light);
		}

		writeFileSync(path, src);
		processed++;
		console.log(
			`✓ ${f.padEnd(32)} title=${titleColor ?? '—'}  nav=${navText}  ratio=${ratio ?? '—'}` +
				(plate ? `  plate=${plate.hue}° ×${plate.chroma} L${plate.light}` : '')
		);
	} catch (err) {
		console.warn(`! ${f}: ${err.message}`);
		skipped++;
	}
}
console.log(
	`\nBaked colours for ${processed} work(s).` + (skipped ? `  ${skipped} skipped — see above.` : '')
);
