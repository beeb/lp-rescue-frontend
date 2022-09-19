import { writable, derived, type Writable } from 'svelte/store'
import type { Chain } from '@web3-onboard/common'
import { ethers } from 'ethers'

const defaultChain = parseInt(import.meta.env.VITE_DEFAULT_CHAIN || '56')

export const dark: Writable<boolean> = writable(false)

export const activeChain: Writable<number> = writable(defaultChain)
export const activeChainHex = derived(activeChain, ($activeChain) => ethers.utils.hexlify($activeChain))

export const chains: Record<number, Chain> = {
	56: {
		id: '0x38',
		token: 'BNB',
		label: 'BNB Smart Chain',
		rpcUrl: 'https://bsc-dataseed.binance.org'
	},
	97: {
		id: '0x61',
		token: 'tBNB',
		label: 'BSC Testnet',
		rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545'
	}
}

export const defaultProvider = new ethers.providers.JsonRpcProvider(
	chains[defaultChain].rpcUrl || 'https://bsc-dataseed.binance.org'
)
