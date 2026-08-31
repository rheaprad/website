<script lang="ts">
	import type { RecentEntry } from '$lib/content';
	import { formatDate } from '$lib/format';

	interface Props {
		entries: RecentEntry[];
	}

	let { entries }: Props = $props();
</script>

<!--
	A little leather-bound journal: an evenly-lit grained leather cover with a
	rounded raised spine and a run of stitching down the binding, holding a clean
	sheet of cream paper. Entries sit on the page as plain lines.
-->
<div class="journal">
	<span class="stitch" aria-hidden="true"></span>
	<div class="page">
		<ul class="entries">
			{#each entries as entry (entry.href + entry.action + entry.date)}
				<li class="flex items-baseline gap-2">
					<time class="type-meta w-24 flex-shrink-0" datetime={entry.date}>
						{formatDate(entry.date)}
					</time>
					<a
						href={entry.href}
						class="min-w-0 truncate text-[15px] transition-colors hover:text-primary"
					>
						{entry.title}
					</a>
					<span class="leader"></span>
					<span class="type-meta action flex-shrink-0">{entry.action} {entry.kind}</span>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.journal {
		--ink: #2c2419;
		--ink-soft: #6f5f4c;

		position: relative;
		border-radius: 3px 4px 4px 3px;
		/* left padding clears the raised spine band */
		padding: 12px 12px 13px 44px;
		/* evenly-lit grained leather — no vignette */
		background-image:
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='l'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6 0.8' numOctaves='4' seed='7' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23l)' opacity='0.5'/%3E%3C/svg%3E"),
			linear-gradient(155deg, #64432f, #593820);
		background-blend-mode: soft-light, normal;
		background-color: #593820;
		box-shadow:
			inset 0 1px 0 rgba(255, 232, 205, 0.1),
			0 1px 1px rgba(0, 0, 0, 0.1),
			0 8px 18px -10px rgba(45, 26, 14, 0.4);
	}

	/* Rounded raised spine: dark edges, a soft highlight down the middle. */
	.journal::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 32px;
		border-radius: 3px 0 0 3px;
		background-image:
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='l'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6 0.8' numOctaves='4' seed='7' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23l)' opacity='0.5'/%3E%3C/svg%3E"),
			linear-gradient(to right, rgba(0, 0, 0, 0.32), rgba(255, 224, 184, 0.14) 50%, rgba(0, 0, 0, 0.28));
		background-blend-mode: soft-light, normal;
		background-color: #593820;
		box-shadow: inset -2px 0 3px -1px rgba(0, 0, 0, 0.4);
		pointer-events: none;
	}

	/* Run of stitching down the spine, with a punched-hole shadow. */
	.stitch {
		position: absolute;
		top: 20px;
		bottom: 20px;
		left: 23px;
		width: 2px;
		pointer-events: none;
	}
	.stitch::before,
	.stitch::after {
		content: '';
		position: absolute;
		inset: 0;
		border-left: 2px dashed;
	}
	.stitch::before {
		border-color: rgba(28, 15, 7, 0.55);
		transform: translate(1px, 1px);
	}
	.stitch::after {
		border-color: rgba(226, 203, 162, 0.8);
	}

	/* Clean cream page — no rules, no margin, no aging. */
	.page {
		position: relative;
		border-radius: 1px 3px 3px 1px;
		padding: 0.9rem 1.15rem;
		color: var(--ink);
		background-color: #f7f3ea;
		background-image:
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23p)' opacity='0.03'/%3E%3C/svg%3E"),
			linear-gradient(180deg, #faf7ef, #f4efe3);
		box-shadow:
			inset 0 0 0 1px rgba(90, 60, 35, 0.1),
			0 1px 2px rgba(0, 0, 0, 0.12);
	}

	/* Soft shadow where the page tucks into the binding. */
	.page::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		width: 14px;
		background: linear-gradient(to right, rgba(50, 30, 12, 0.16), transparent);
		border-radius: 1px 0 0 1px;
		pointer-events: none;
	}

	.entries {
		position: relative;
		z-index: 1;
	}
	.entries li {
		padding: 0.3rem 0;
	}

	.page :global(a) {
		color: var(--ink);
	}
	.page :global(.type-meta) {
		color: var(--ink-soft);
	}
	.page .action {
		font-style: italic;
	}
	.page :global(.leader) {
		border-bottom-color: rgba(90, 60, 35, 0.28);
	}
</style>
