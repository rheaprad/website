// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

// Brings `enhanced:img` into svelte/elements and declares the `*?enhanced`
// module shape. Without it svelte-check does not know the element exists.
/// <reference types="@sveltejs/enhanced-img" />

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
