<script lang="ts">
	interface Entry {
		href: string;
		title: string;
		meta?: string;
	}

	interface Props {
		/** The newer / previous item in the sequence. */
		prev?: Entry;
		/** The older / next item in the sequence. */
		next?: Entry;
		prevLabel?: string;
		nextLabel?: string;
	}

	let { prev, next, prevLabel = 'Newer', nextLabel = 'Older' }: Props = $props();
</script>

{#if prev || next}
	<nav class="grid grid-cols-2 gap-6">
		<div>
			{#if prev}
				<p class="type-meta">← {prevLabel}</p>
				<a
					href={prev.href}
					class="mt-1 block font-display text-[16px] font-semibold transition-colors hover:text-primary"
				>
					{prev.title}
				</a>
				{#if prev.meta}
					<p class="type-meta mt-0.5">{prev.meta}</p>
				{/if}
			{/if}
		</div>
		<div class="text-right">
			{#if next}
				<p class="type-meta">{nextLabel} →</p>
				<a
					href={next.href}
					class="mt-1 block font-display text-[16px] font-semibold transition-colors hover:text-primary"
				>
					{next.title}
				</a>
				{#if next.meta}
					<p class="type-meta mt-0.5">{next.meta}</p>
				{/if}
			{/if}
		</div>
	</nav>
{/if}
