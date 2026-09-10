<script lang="ts">
	/**
	 * A project's whole diary, laid out at the foot of one of its entries.
	 *
	 * A log page used to end with two near-identical prev/next widgets — one
	 * for the project, one for the blog — which is a lot of furniture to say
	 * "there is another entry". A diary is a sequence, and the useful thing to
	 * show a reader standing in the middle of one is the sequence: every entry
	 * in order, numbered, with the one they are on marked and not a link. It
	 * reads forward, oldest first, the way the entries were written.
	 */
	import { base } from '$app/paths';
	import { formatDate } from '$lib/format';

	export interface DiaryEntry {
		slug: string;
		date: string;
		title?: string;
	}

	interface Props {
		entries: DiaryEntry[];
		current: string;
		projectTitle: string;
		projectSlug: string;
	}

	let { entries, current, projectTitle, projectSlug }: Props = $props();
</script>

<section>
	<h2 class="type-section text-muted-foreground">the {projectTitle} diary</h2>

	<ol class="mt-5 space-y-0.5">
		{#each entries as entry, i (entry.slug)}
			{@const here = entry.slug === current}
			<li>
				<div
					class="flex items-baseline gap-3 py-1.5 {here
						? 'text-foreground'
						: 'text-muted-foreground'}"
					aria-current={here ? 'page' : undefined}
				>
					<span class="w-6 shrink-0 type-num tabular-nums">{i + 1}</span>
					{#if here}
						<span class="type-title-sm">{entry.title ?? formatDate(entry.date)}</span>
						<span class="leader" aria-hidden="true"></span>
						<span class="shrink-0 type-num">you are here</span>
					{:else}
						<a
							href="{base}/blog/{entry.slug}/"
							class="type-title-sm transition-colors hover:text-primary"
						>
							{entry.title ?? formatDate(entry.date)}
						</a>
						<span class="leader" aria-hidden="true"></span>
						<time class="shrink-0 type-num" datetime={entry.date}>{formatDate(entry.date)}</time>
					{/if}
				</div>
			</li>
		{/each}
	</ol>

	<p class="mt-5">
		<a
			href="{base}/work/{projectSlug}/"
			class="type-num text-primary underline underline-offset-3 transition-colors
			       hover:text-foreground"
		>
			see the finished work
		</a>
	</p>
</section>
