import type { PostKind } from '$lib/content';

/**
 * What each kind of post *is*, in one place. Three kinds were being drawn as
 * one thing with a different word above it — the index rendered a note's whole
 * body next to an essay's bare title, and the post page had a single `if
 * (essay)` branch for all three. They are not the same object:
 *
 *   note   a scrap off the sketchbook. Picture first, words optional, no
 *          title expected. Pinned to the page.
 *   log    one instalment of a project's diary. Belongs to a work, sits in a
 *          sequence, and is worth nothing without both of those facts.
 *   essay  a piece of writing. Kicker, title, dek, byline, a measure sized
 *          for reading, and no ornament competing with the text.
 *
 * The three are told apart by the word, the shape of the entry and how much
 * room it takes — not by colour. Keying each kind to its own ink put three
 * hues in a rail that only ever holds a label and a date, and a rail that
 * changes colour every entry reads as a legend for something.
 */
export interface KindVoice {
	/** Singular, as it appears in a byline: "process log". */
	label: string;
	/** Plural, as it appears above a group: "process logs". */
	plural: string;
}

export const KIND: Record<PostKind, KindVoice> = {
	note: { label: 'note', plural: 'notes' },
	log: { label: 'process log', plural: 'process logs' },
	essay: { label: 'essay', plural: 'essays' }
};

export const kindVoice = (kind: PostKind): KindVoice => KIND[kind] ?? KIND.note;

/**
 * Reading estimate at 220 wpm — the low end of the usual range, because these
 * are essays about pictures and the pictures are part of the read. Anything
 * under two minutes doesn't get a badge; "1 min read" tells a reader nothing
 * they can't see from the scrollbar.
 */
export function readingTime(words: number): string {
	const mins = Math.round(words / 220);
	return mins >= 2 ? `${mins} min read` : '';
}
