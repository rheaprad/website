<script lang="ts" module>
	import type { Picture } from '@sveltejs/enhanced-img';

	export type LightboxItem = {
		/** Kept alongside `picture` for identity and any download affordance. */
		src: string;
		picture?: Picture;
		title?: string;
		caption?: string;
		alt?: string;
	};
</script>

<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import Image from '$lib/components/ui/Image.svelte';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import X from '@lucide/svelte/icons/x';

	let {
		items = [],
		open = $bindable(false),
		index = $bindable(0)
	}: {
		items: LightboxItem[];
		open?: boolean;
		index?: number;
	} = $props();

	const count = $derived(items.length);
	const current = $derived(items[index] ?? null);
	const hasMultiple = $derived(count > 1);

	function prev() {
		if (count) index = (index - 1 + count) % count;
	}
	function next() {
		if (count) index = (index + 1) % count;
	}

	function onKey(e: KeyboardEvent) {
		if (!open) return;
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			prev();
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			next();
		}
	}

	// Close only when the dark backdrop itself is clicked (not image/controls)
	function closeOnSelf(e: MouseEvent) {
		if (e.target === e.currentTarget) open = false;
	}
</script>

<svelte:window onkeydown={onKey} />

<DialogPrimitive.Root bind:open>
	<DialogPrimitive.Portal>
		<DialogPrimitive.Overlay
			class="fixed inset-0 z-[100] bg-black/95 duration-150
			       data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0"
		/>
		<DialogPrimitive.Content class="fixed inset-0 z-[101] flex flex-col outline-none select-none">
			{#if current}
				<DialogPrimitive.Title class="sr-only">{current.title ?? 'Image'}</DialogPrimitive.Title>

				<!-- Close -->
				<DialogPrimitive.Close
					class="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full
					       text-white/70 transition-colors hover:bg-white/10 hover:text-white"
				>
					<X size={22} />
					<span class="sr-only">Close</span>
				</DialogPrimitive.Close>

				<!-- Image area (arrows live here so they centre on the image, not the caption) -->
				<div
					class="relative flex min-h-0 flex-1 items-center justify-center px-14 pt-14 pb-2 md:px-24"
					onclick={closeOnSelf}
					role="presentation"
				>
					{#if hasMultiple}
						<button
							type="button"
							onclick={prev}
							aria-label="Previous"
							class="absolute top-1/2 left-2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center
							       rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white
							       md:left-5 md:h-12 md:w-12"
						>
							<ChevronLeft size={30} />
						</button>
						<button
							type="button"
							onclick={next}
							aria-label="Next"
							class="absolute top-1/2 right-2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center
							       rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white
							       md:right-5 md:h-12 md:w-12"
						>
							<ChevronRight size={30} />
						</button>
					{/if}

					<!-- No {#key} here. Remounting the <img> on every arrow press
					     guaranteed a blank frame while the next picture decoded. The
					     immediate neighbours stay mounted instead, so stepping through
					     a gallery is a display flip rather than a fetch. -->
					{#each items as it, i (it.src)}
						{#if Math.abs(i - index) <= 1}
							<Image
								src={it.picture ?? it.src}
								alt={it.alt ?? it.title ?? ''}
								sizes="100vw"
								loading="eager"
								fetchpriority={i === index ? 'high' : 'low'}
								class="max-h-full max-w-full object-contain shadow-2xl {i === index
									? ''
									: 'hidden'}"
							/>
						{/if}
					{/each}
				</div>

				<!-- Title / caption (its own row, never overlaps the image) -->
				{#if current.title || current.caption || hasMultiple}
					<div class="shrink-0 px-6 pt-2 pb-6 text-center">
						{#if current.title}
							<p class="font-sans text-[15px] font-medium text-white md:text-[16px]">
								{current.title}
							</p>
						{/if}
						{#if current.caption}
							<p
								class="mx-auto mt-1 max-w-[720px] font-sans text-[13px] text-white/70 md:text-[14px]"
							>
								{current.caption}
							</p>
						{/if}
						{#if hasMultiple}
							<p class="mt-2 font-sans text-[12px] tracking-[1px] text-white/45">
								{index + 1} / {count}
							</p>
						{/if}
					</div>
				{/if}
			{/if}
		</DialogPrimitive.Content>
	</DialogPrimitive.Portal>
</DialogPrimitive.Root>
