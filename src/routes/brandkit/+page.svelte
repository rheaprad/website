<script lang="ts">
	/**
	 * The brand kit: a live style guide, not a picture of one.
	 *
	 * Everything here is rendered by the real tokens and the real self-hosted
	 * fonts, so what is on screen is what the site will look like. The palette
	 * and body-face switchers work because the token mapping in layout.css is
	 * declared on `:root, [data-palette]` — see the note there — which lets a
	 * subtree resolve the whole system against its own ramp.
	 *
	 * Dev-only, like /header-lab: noindex, and absent from the nav and sitemap.
	 */
	import SectionHead from '$lib/components/SectionHead.svelte';
	import Postmark from '$lib/components/home/Postmark.svelte';

	type Palette = { id: string; name: string; note: string };
	const palettes: Palette[] = [
		{
			id: 'riso',
			name: 'Riso Studio',
			note: 'The print shop: white stock, fluoro inks, misregistration. The field colour is Sadhya’s banana leaf rather than duplicator blue — green against fluoro pink is the oldest good riso pairing there is, and the blue survives as the third voice.'
		},
		{
			id: 'cloth',
			name: 'Bookcloth & Foil',
			note: 'A bindery: cloth boards, pressed brass, an oxblood spine label. The quietest of the three, and the closest to what is already there.'
		},
		{
			id: 'sadhya',
			name: 'Sadhya',
			note: 'Pulled from your own books — banana leaf, turmeric, kumkum, indigo. The most personal, and the least neutral as a backdrop.'
		}
	];

	const bodies = [
		{ id: 'instrument', name: 'Instrument Sans', note: 'Slightly narrow, real texture. Most character without shouting.' },
		{ id: 'schibsted', name: 'Schibsted Grotesk', note: 'Editorial grotesque. Warm, even colour on the page.' },
		{ id: 'jakarta', name: 'Plus Jakarta Sans', note: 'Rounder and friendlier. The softest of the four.' },
		{ id: 'figtree', name: 'Figtree', note: 'Geometric and plain. The quiet control.' }
	];

	let palette = $state('riso');
	let body = $state('instrument');

	const ramp = [
		{ v: '--paper', label: 'paper', use: 'the page' },
		{ v: '--paper-2', label: 'paper-2', use: 'card / raised' },
		{ v: '--paper-3', label: 'paper-3', use: 'well / placeholder' },
		{ v: '--ink', label: 'ink', use: 'body text' },
		{ v: '--ink-2', label: 'ink-2', use: 'captions · 4.5:1' },
		{ v: '--rule', label: 'rule', use: 'hairlines' },
		{ v: '--brand', label: 'brand', use: 'footer field · nav · CTA' },
		{ v: '--brand-wash', label: 'brand-wash', use: 'tint' },
		{ v: '--gild', label: 'gild', use: 'foil — a FILL, not a mark' },
		{ v: '--gild-ink', label: 'gild-ink', use: 'foil as a legible mark' },
		{ v: '--hot', label: 'hot', use: 'emphasis · the circled note' },
		{ v: '--cool', label: 'cool', use: 'prose links · quiet chips' }
	];

	const faces = [
		{
			name: 'Clauthbound',
			role: 'Display',
			css: 'var(--font-display)',
			cuts: ['Regular 400', 'Semibold 600', 'Bold 700'],
			note: 'Foil-stamped cloth book covers, c.1930–55. Caps only — it has no lowercase glyphs and maps a–z onto the capitals, so anything set in it shouts. Carries page titles, years and section labels.'
		},
		{
			name: 'Ships Whistle',
			role: 'Titles',
			css: 'var(--font-title)',
			cuts: ['Regular 400', 'Italic', 'Bold 700', 'Bold Italic'],
			note: 'Monoline sans off the Woods Hole ferry. The only face here with real lowercase and a true italic, so every mixed-case title is its job.'
		},
		{
			name: 'Ships Whistle Rough',
			role: 'Stamp',
			css: 'var(--font-stamp)',
			cuts: ['Regular', 'Italic', 'Bold', 'Bold Italic'],
			note: 'The same face with the ink bleeding. Used for things that are struck rather than written — date stamps, franks, the postmark. Not the handwriting: a rubber stamp and a pen are different voices.'
		},
		{
			name: 'Shantell Sans',
			role: 'The hand',
			css: 'var(--font-hand)',
			cuts: ['Variable 300–800'],
			note: 'Kept. The margin notes, the “that’s me” arrow, the circled email — the one genuinely written voice on the site, and nothing in the Secret Club folder does that job.'
		},
		{
			name: 'Scorekard',
			role: 'Meta',
			css: 'var(--font-meta)',
			cuts: ['Regular 400', 'Semibold 600', 'Bold 700'],
			note: 'Lettering off a paper baseball scorecard, deliberately imperfect. The caption voice — media, dimensions, tags.'
		},
		{
			name: 'Wilco Loft Sans',
			role: 'Statement',
			css: 'var(--font-statement)',
			cuts: ['Treble 400', 'Midrange 500', 'LowEnd 600', 'Bass 700'],
			note: 'From the GUITAR sign in Wilco’s Chicago loft. Optional, and at most once per page — the footer wordmark. Say no and we ship four faces instead of five.'
		}
	];

	/* Clauthbound's ornaments are not a dingbat set — they are decorated cuts
	   of ordinary punctuation, reached through ss01/ss03/ss04. */
	const ornaments = [
		{ ch: '*', ss: 'ss01' },
		{ ch: '*', ss: 'ss03' },
		{ ch: '*', ss: 'ss04' },
		{ ch: '§', ss: 'ss01' },
		{ ch: '†', ss: 'ss01' },
		{ ch: '‡', ss: 'ss01' },
		{ ch: '°', ss: 'ss01' },
		{ ch: '@', ss: 'ss01' },
		{ ch: '&', ss: 'ss01' },
		{ ch: '©', ss: 'ss01' },
		{ ch: '®', ss: 'ss01' }
	];

	const tickerItems = [
		'Picturebooks',
		'Comics',
		'Artist books',
		'Concertinas',
		'Illustration',
		'Risograph'
	];
</script>

<svelte:head>
	<title>Brand kit</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div data-palette={palette} data-body={body} class="kit bg-background text-foreground">
	<!-- Controls -->
	<div class="ctl">
		<div class="ctl-in">
			<div class="ctl-group">
				<span class="type-meta">Palette</span>
				{#each palettes as p (p.id)}
					<button
						class="tactile px-3 py-1 text-[13px]"
						class:on={palette === p.id}
						onclick={() => (palette = p.id)}>{p.name}</button
					>
				{/each}
			</div>
			<div class="ctl-group">
				<span class="type-meta">Body face</span>
				{#each bodies as b (b.id)}
					<button
						class="tactile px-3 py-1 text-[13px]"
						class:on={body === b.id}
						onclick={() => (body = b.id)}>{b.name}</button
					>
				{/each}
			</div>
		</div>
	</div>

	<div class="wrap">
		<!-- Masthead -->
		<header class="mb-20">
			<p class="type-section deboss mb-4">Visual identity · draft 01</p>
			<h1 class="type-display mb-5">Rhea Pradeep</h1>
			<p class="max-w-[54ch] text-[1.0625rem] leading-[1.7]">
				Five faces from Secret Club, three palettes, and a set of paper devices. Nothing here
				changes a layout — it changes what the layouts are made of. Flip the switches above; every
				swatch, specimen and object on this page is rendered by the real tokens.
			</p>
			<p class="ornament-rule mt-10">
				<span class="ornament text-[22px]">*</span>
			</p>
		</header>

		<!-- ── Palette ── -->
		<section class="mb-24">
			<SectionHead text="the palette" />
			<p class="mt-6 mb-2 type-title-lg">{palettes.find((p) => p.id === palette)?.name}</p>
			<p class="mb-8 max-w-[56ch] text-[15px] leading-[1.65] text-muted-foreground">
				{palettes.find((p) => p.id === palette)?.note}
			</p>

			<div class="swatches">
				{#each ramp as sw (sw.v)}
					<div class="swatch">
						<div class="chip" style="background: var({sw.v})"></div>
						<div class="type-meta !text-foreground">{sw.label}</div>
						<div class="type-meta">{sw.use}</div>
					</div>
				{/each}
			</div>

			<div class="note mt-10">
				<p class="type-title-sm mb-2">Two things worth knowing</p>
				<p class="mb-3 text-[15px] leading-[1.65]">
					<strong>The footer was failing.</strong> The old sage green under cream text measured about
					2.4:1. Every palette here puts it above 8:1, because the one large colour field on the site
					has to be readable.
				</p>
				<p class="text-[15px] leading-[1.65]">
					<strong>Foil cannot be both.</strong> A real metallic on cream is low contrast — that is what
					makes it look like metal. So <code>gild</code> is a fill you put dark ink on top of, and
					<code>gild-ink</code> is its darkened twin for anything that has to be read. Forcing one colour
					to do both jobs turns brass into mud.
				</p>
			</div>
		</section>

		<!-- ── Type ── -->
		<section class="mb-24">
			<SectionHead text="the faces" />
			<p class="mt-6 mb-10 max-w-[56ch] text-[15px] leading-[1.65] text-muted-foreground">
				Every Secret Club face is a display face — none of them is built for reading at length.
				That is the whole reason the body face has to come from outside the folder.
			</p>

			{#each faces as f (f.name)}
				<article class="face">
					<div class="face-meta">
						<p class="type-section deboss">{f.role}</p>
						<p class="type-title mt-1">{f.name}</p>
						<p class="type-meta mt-2">{f.cuts.join(' · ')}</p>
					</div>
					<div class="face-body">
						<p class="face-big" style="font-family: {f.css}">Orullaigal</p>
						<p class="face-run" style="font-family: {f.css}">
							ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
						</p>
						<p class="mt-3 max-w-[52ch] text-[14px] leading-[1.6] text-muted-foreground">
							{f.note}
						</p>
					</div>
				</article>
			{/each}

			<!-- Ornaments -->
			<div class="note mt-4">
				<p class="type-title-sm mb-2">The ornaments</p>
				<p class="mb-5 max-w-[56ch] text-[15px] leading-[1.65]">
					Clauthbound is described as shipping “40+ icons”. It does not have an icon set — what it
					has is <code>ss01</code>, a complete second capital alphabet, plus decorated cuts of
					ordinary punctuation on <code>ss01</code>/<code>ss03</code>/<code>ss04</code>. Those
					printer's marks are the ornament vocabulary, and they are enough for dividers, bullets
					and a seal.
				</p>
				<div class="orns">
					{#each ornaments as o, i (i)}
						<div class="orn">
							<span
								class="foil text-[30px]"
								style="font-family: var(--font-display); font-feature-settings: '{o.ss}' 1"
								>{o.ch}</span
							>
							<span class="type-meta">{o.ch} · {o.ss}</span>
						</div>
					{/each}
				</div>
				<p class="mt-6 mb-2 type-meta">Second alphabet — the same word, ss01 on:</p>
				<p class="alt-caps foil" style="font-family: var(--font-display); font-size: 2rem">
					Canidae
				</p>
			</div>
		</section>

		<!-- ── Scale ── -->
		<section class="mb-24">
			<SectionHead text="the scale" />
			<p class="mt-6 mb-10 max-w-[56ch] text-[15px] leading-[1.65] text-muted-foreground">
				Roles, not sizes. Before this there were four utilities and about twenty loose pixel values
				spread across components, so a heading's size depended on which file you happened to be in.
			</p>
			<div class="scale">
				<div><code>.type-display</code><p class="type-display">Books</p></div>
				<div><code>.type-statement</code><p class="type-statement">Rhea</p></div>
				<div><code>.type-title-lg</code><p class="type-title-lg">The Cosmic Calendar</p></div>
				<div><code>.type-title</code><p class="type-title">Who is Ready for Sadhya</p></div>
				<div><code>.type-title-sm</code><p class="type-title-sm">Cell Block Tango</p></div>
				<div><code>.type-section</code><p class="type-section">Selected work</p></div>
				<div><code>.type-year</code><p class="type-year">2024</p></div>
				<div>
					<code>.type-meta + .type-num</code>
					<p><span class="type-meta">Children's picturebook · </span><span class="type-num">2025</span></p>
				</div>
				<div><code>.type-hand</code><p class="type-hand">that's me, aged nine</p></div>
				<div><code>.type-stamp</code><p class="type-stamp text-[15px]">RECEIVED 14 MAR 2026</p></div>
				<div>
					<code>body</code>
					<p class="max-w-[58ch] text-[1.0625rem] leading-[1.75]">
						She makes books that fold, unfold and refuse to sit flat — concertinas, tunnel books,
						and picturebooks about time, memory and food.
					</p>
				</div>
			</div>
			<div class="note mt-10">
				<p class="type-title-sm mb-2">Why metadata is set in two faces</p>
				<p class="text-[15px] leading-[1.65]">
					None of the five display faces has tabular figures — I checked all of them, and the
					existing <code>tabular-nums</code> on <code>.type-meta</code> has been a no-op all along. In
					a catalogue, columns of dates and dimensions have to line up, so the numerals come from the
					body face and only the words are set in Scorekard. Scorekard's charm is in its letters
					anyway.
				</p>
			</div>
		</section>

		<!-- ── Elements ── -->
		<section class="mb-24">
			<SectionHead text="the objects" />
			<p class="mt-6 mb-10 max-w-[56ch] text-[15px] leading-[1.65] text-muted-foreground">
				A vocabulary to draw from, not a checklist to apply. The site's own rule holds — the same
				trick twice on one page stops reading as a hand and starts reading as a template.
			</p>

			<div class="objects">
				<div class="obj">
					<p class="type-meta mb-4">.foil / .deboss — existing type, pressed</p>
					<p class="foil mb-2" style="font-family: var(--font-display); font-size: 1.75rem">
						Bound &amp; folded
					</p>
					<p class="deboss" style="font-family: var(--font-display); font-size: 1.75rem">
						Panels &amp; pages
					</p>
				</div>

				<div class="obj">
					<p class="type-meta mb-4">.sticker — replaces .tactile on tags</p>
					<div class="flex flex-wrap gap-3">
						<span class="sticker px-3 py-1 text-[13px]" style="--tilt:-2deg">concertina</span>
						<span class="sticker px-3 py-1 text-[13px]" style="--tilt:1.5deg">picturebook</span>
						<span class="sticker px-3 py-1 text-[13px]">risograph</span>
					</div>
					<p class="type-meta mt-4">.tactile — kept, for controls</p>
					<div class="mt-3 flex flex-wrap gap-3">
						<span class="tactile bg-primary px-3 py-1 text-[13px] text-primary-foreground"
							>See the work</span
						>
						<span class="tactile bg-background px-3 py-1 text-[13px]">All work</span>
					</div>
				</div>

				<div class="obj">
					<p class="type-meta mb-4">.datestamp — blog and log dates</p>
					<p class="datestamp type-stamp text-[15px]">14 MAR 2026</p>
					<p class="type-meta mt-5 mb-3">Postmark — unchanged, now on tokens</p>
					<Postmark class="w-[110px] text-foreground opacity-25" />
				</div>

				<div class="obj">
					<p class="type-meta mb-4">.taped — the tape now reads the palette</p>
					<div class="taped inline-block" style="--tilt:-2.5deg">
						<span class="tape"></span>
						<div class="h-[86px] w-[120px] bg-muted"></div>
					</div>
				</div>

				<div class="obj">
					<p class="type-meta mb-4">.riso — hover the block</p>
					<div class="riso inline-block">
						<div class="h-[86px] w-[120px] bg-muted"></div>
					</div>
				</div>

				<div class="obj deckle" style="background: var(--brand)">
					<p class="type-meta mb-3 !text-primary-foreground">.deckle — a torn foot on a field</p>
					<p class="text-primary-foreground text-[15px] leading-[1.6]">
						For the one or two places a panel of colour has to stop. Everywhere else the site
						separates sections with air alone.
					</p>
				</div>
			</div>

			<p class="type-meta mt-16 mb-3">.ticker — a strip of set type between sections</p>
			<div class="ticker">
				<div class="ticker-track">
					{#each [0, 1] as dup (dup)}
						{#each tickerItems as t (t + dup)}
							<span>{t}</span>
							<span class="ornament" aria-hidden="true">*</span>
						{/each}
					{/each}
				</div>
			</div>
		</section>

		<!-- ── Body face ── -->
		<section class="mb-24">
			<SectionHead text="the body face" />
			<p class="mt-6 mb-8 max-w-[56ch] text-[15px] leading-[1.65] text-muted-foreground">
				The one open question. Switch between them above and read the paragraph — this is the size
				and measure it will actually be set at.
			</p>
			<div class="bodies">
				{#each bodies as b (b.id)}
					<div class="bodycard" class:on={body === b.id}>
						<p class="type-title-sm">{b.name}</p>
						<p class="type-meta mb-3">{b.note}</p>
						<p style="font-family: var(--font-body); font-size: 1rem; line-height: 1.7">
							Time Frames is a concertina about the way an afternoon stretches and folds.
						</p>
					</div>
				{/each}
			</div>
			<p class="mt-8 max-w-[62ch] text-[1.0625rem] leading-[1.75]">
				Set in the current selection, at the size prose actually runs: she makes books that fold,
				unfold and refuse to sit flat. Concertinas that open into a single wide image, tunnel books
				with a room at the far end, picturebooks about time, memory and what gets served at a
				wedding. Most of them are printed by hand, and most of them are about waiting for something.
			</p>
		</section>

		<footer class="pt-10 pb-24">
			<p class="ornament-rule mb-8"><span class="ornament text-[20px]">§</span></p>
			<p class="type-meta">
				Draft for review · not linked from the site · noindex · /brandkit
			</p>
		</footer>
	</div>
</div>

<style>
	.kit {
		min-height: 100vh;
	}
	.wrap {
		max-width: 980px;
		margin-inline: auto;
		padding: 3.5rem 1.5rem 0;
	}
	@media (min-width: 768px) {
		.wrap {
			padding-inline: 2.5rem;
		}
	}

	/* Controls pinned to the top so a comparison is one click, not a scroll. */
	.ctl {
		position: sticky;
		/* clears the 64px site header, which this page sits inside */
		top: 64px;
		z-index: 20;
		border-bottom: 1px solid var(--border);
		background: color-mix(in oklab, var(--paper-2) 92%, transparent);
		backdrop-filter: blur(6px);
	}
	.ctl-in {
		display: flex;
		flex-wrap: wrap;
		gap: 1.25rem 2.5rem;
		max-width: 980px;
		margin-inline: auto;
		padding: 0.85rem 1.5rem;
	}
	.ctl-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.ctl-group :global(.tactile) {
		background: var(--paper-2);
		cursor: pointer;
	}
	.ctl-group :global(.tactile.on) {
		background: var(--primary);
		color: var(--primary-foreground);
	}

	.swatches {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: 1.25rem;
	}
	.chip {
		height: 64px;
		margin-bottom: 0.5rem;
		box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--ink) 14%, transparent);
	}

	.note {
		border-left: 2px solid var(--gild);
		padding: 0.25rem 0 0.25rem 1.25rem;
	}
	.note :global(code) {
		font-size: 0.9em;
		background: var(--paper-3);
		padding: 0.1em 0.35em;
	}

	.face {
		display: grid;
		gap: 0.75rem 2rem;
		padding-block: 2rem;
		border-top: 1px solid var(--border);
	}
	@media (min-width: 768px) {
		.face {
			grid-template-columns: 190px minmax(0, 1fr);
		}
	}
	.face-big {
		font-size: clamp(2.25rem, 6vw, 3.5rem);
		line-height: 1.05;
	}
	.face-run {
		margin-top: 0.5rem;
		font-size: 1rem;
		line-height: 1.5;
		color: var(--ink-2);
		overflow-wrap: anywhere;
	}

	.orns {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
	}
	.orn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
		min-width: 62px;
	}

	.scale > div {
		padding-block: 1.1rem;
		border-top: 1px solid var(--border);
	}
	.scale :global(code) {
		display: block;
		margin-bottom: 0.5rem;
		font-size: 0.75rem;
		color: var(--ink-2);
	}

	.objects {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 2.5rem 2rem;
	}
	.obj {
		padding: 1.25rem;
		background: var(--paper-2);
		box-shadow: inset 0 0 0 1px var(--border);
	}

	.bodies {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
		gap: 1rem;
	}
	.bodycard {
		padding: 1rem;
		box-shadow: inset 0 0 0 1px var(--border);
	}
	.bodycard.on {
		box-shadow: inset 0 0 0 2px var(--primary);
	}
</style>
