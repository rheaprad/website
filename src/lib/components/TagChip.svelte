<script lang="ts">
	import { base } from '$app/paths';
	import { tagLabel } from '$lib/format';

	interface Props {
		tag: string;
	}

	let { tag }: Props = $props();
</script>

<a
	href="{base}/tags/{tag}/"
	class="tactile bg-background px-3 py-1 text-[13px] font-medium whitespace-nowrap
	       text-foreground hover:bg-primary/10"
>
	{tagLabel(tag)}
</a>
