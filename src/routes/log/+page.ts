import { getRecently } from '$lib/content';
import { formatMonth, monthKey } from '$lib/format';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	const entries = getRecently();
	const months: { key: string; label: string; entries: typeof entries }[] = [];
	for (const entry of entries) {
		const key = monthKey(entry.date);
		const bucket = months.at(-1);
		if (bucket && bucket.key === key) {
			bucket.entries.push(entry);
		} else {
			months.push({ key, label: formatMonth(entry.date), entries: [entry] });
		}
	}
	return { months, total: entries.length };
};
