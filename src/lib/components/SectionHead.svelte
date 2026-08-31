<script lang="ts">
	interface Props {
		text: string;
		/** 'ink' on paper, 'inverse' on a solid color cell. */
		tone?: 'ink' | 'inverse';
	}

	let { text, tone = 'ink' }: Props = $props();
</script>

<!-- Section header with a concertina fold mark, after her accordion books. -->
<h2 class="flex flex-col gap-1.5">
	<span class="font-display text-[20px] leading-tight font-bold lowercase md:text-[22px]">
		{text}
	</span>
	<svg
		width="76"
		height="8"
		viewBox="0 0 76 8"
		fill="none"
		aria-hidden="true"
		class={tone === 'inverse' ? 'opacity-80' : 'text-primary'}
	>
		<polyline
			points="1,7 10.5,1 20,7 29.5,1 39,7 48.5,1 58,7 67.5,1 75,6"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
</h2>
