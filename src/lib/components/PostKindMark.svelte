<script lang="ts">
	/**
	 * The kicker above a post: just the word, set in the section role. It is a
	 * heading for the thing beneath it, not a fact about it — the date is the
	 * fact — so it takes the section face and the metadata ink, and no colour
	 * of its own. Three kinds in three hues turned the date rail into a legend.
	 */
	import type { PostKind } from '$lib/content';
	import { kindVoice } from '$lib/post-kind';

	interface Props {
		kind: PostKind;
		/** Say "notes" rather than "note" — for a group heading. */
		plural?: boolean;
	}

	let { kind, plural = false }: Props = $props();

	const voice = $derived(kindVoice(kind));
</script>

<span class="type-section text-muted-foreground">{plural ? voice.plural : voice.label}</span>
