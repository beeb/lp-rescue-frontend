/// <reference types="unplugin-icons/types/svelte" />

declare global {
	declare namespace App {}
}

interface ChainData {
	amm: Record<string, AmmData>
	commonTokens: Record<string, string>
}

interface AmmData {
	name: string
	routerAddress: string
	rescueAddress: string
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

declare module '@walletconnect/web3-provider/dist/umd/index.min.js' {
	import WalletConnectProvider from '@walletconnect/web3-provider/dist/esm/index'
	export default WalletConnectProvider
}
