// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Locals {}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
	interface Platform {
		env: {
			COUNTER: DurableObjectNamespace;
		};
		context: {
			waitUntil(promise: Promise<any>): void;
		};
		caches: CacheStorage & { default: Cache };
	}
}

declare namespace globalThis {
	declare var adsbygoogle: any[];
}

declare module "@fortawesome/pro-solid-svg-icons/index.es" {
	export * from "@fortawesome/pro-solid-svg-icons";
}
