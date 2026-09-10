<script lang="ts">
	/**
	 * The frank over the stamp: two rings and a run of wavy cancellation bars,
	 * struck slightly off true and slightly under-inked. It is the one detail
	 * that stops a rectangle with a face in it from reading as a thumbnail.
	 */
	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<svg viewBox="0 0 130 72" fill="none" aria-hidden="true" class={className}>
	<g stroke="currentColor" stroke-linecap="round" fill="none">
		<circle cx="36" cy="36" r="31" stroke-width="2" />
		<circle cx="36" cy="36" r="24.5" stroke-width="1.2" />
		<path d="M22 30h28M22 36h28M22 42h20" stroke-width="1.2" opacity="0.75" />
		<g stroke-width="2.4">
			<path d="M68 22q7-6 14 0t14 0 14 0 14 0" />
			<path d="M68 32q7-6 14 0t14 0 14 0 14 0" />
			<path d="M68 42q7-6 14 0t14 0 14 0 14 0" />
			<path d="M68 52q7-6 14 0t14 0 14 0 14 0" />
		</g>
	</g>
</svg>
