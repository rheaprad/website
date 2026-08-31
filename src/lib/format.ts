const DAY_FMT = new Intl.DateTimeFormat('en-GB', {
	day: 'numeric',
	month: 'short',
	year: 'numeric'
});

const MONTH_FMT = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' });

/** "28 Oct 2025" */
export function formatDate(iso: string): string {
	const d = new Date(iso);
	return Number.isNaN(d.getTime()) ? '' : DAY_FMT.format(d);
}

/** "October 2025" */
export function formatMonth(iso: string): string {
	const d = new Date(iso);
	return Number.isNaN(d.getTime()) ? '' : MONTH_FMT.format(d);
}

/** "2025-10" — stable grouping key for month sections. */
export function monthKey(iso: string): string {
	const d = new Date(iso);
	return Number.isNaN(d.getTime())
		? ''
		: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** "picture-book" → "picture book" */
export function tagLabel(tag: string): string {
	return tag.replace(/-/g, ' ');
}
