/// <reference types="unplugin-icons/types/svelte" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Locals {}
	// interface PageData {}
	// interface PageError {}
	// interface Platform {}
}

declare module '@walletconnect/web3-provider/dist/umd/index.min.js' {
	import WalletConnectProvider from '@walletconnect/web3-provider/dist/esm/index'
	export default WalletConnectProvider
}

declare module '*.svg' {
	const content: any
	export default content
}

declare module '*.svg?component' {
	const content: any
	export default content
}

declare module '*.svg?src' {
	const content: string
	export default content
}

declare module '*.svg?url' {
	const content: string
	export default content
}
