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
 *
 * Manual CMS fields still win: `title_color` and `nav_theme` (Light/Dark text).
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const WORK_DIRS = [
	'src/lib/content/art-page/books',
	'src/lib/content/art-page/comics',
	'src/lib/content/art-page/illustrations'
];
const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const contentPathToFile = (p) => p.replace(/^\//, '');

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
const files = WORK_DIRS.flatMap((dir) =>
	readdirSync(dir)
		.filter((n) => n.endsWith('.md'))
		.map((n) => ({ dir, f: n }))
);
for (const { dir, f } of files) {
	const path = join(dir, f);
	let src = readFileSync(path, 'utf8');
	const heroMatch = src.match(/^hero_image:\s*(.+)$/m) || src.match(/^cover_image:\s*(.+)$/m);
	if (!heroMatch) continue;
	const file = contentPathToFile(heroMatch[1].trim());
	if (!existsSync(file)) {
		console.warn(`! ${f}: hero not found (${file})`);
		continue;
	}
	try {
		const { titleColor, navText } = await analyse(file);
		if (titleColor) src = upsert(src, 'title_color_auto', `"${titleColor}"`);
		src = upsert(src, 'nav_text_auto', navText);

		// Cover ratio drives the gallery grid; measured from the cover, not the hero.
		const coverMatch = src.match(/^cover_image:\s*(.+)$/m);
		let ratio = null;
		if (coverMatch) {
			const coverFile = contentPathToFile(coverMatch[1].trim());
			if (existsSync(coverFile)) ratio = await ratioOf(coverFile);
		}
		if (ratio) src = upsert(src, 'cover_ratio_auto', ratio);

		writeFileSync(path, src);
		processed++;
		console.log(
			`✓ ${f.padEnd(32)} title=${titleColor ?? '—'}  nav=${navText}  ratio=${ratio ?? '—'}`
		);
	} catch (err) {
		console.warn(`! ${f}: ${err.message}`);
	}
}
console.log(`\nBaked colours for ${processed} work(s).`);
