import { projectId } from '$lib/constants'
import type { Address } from '@wagmi/core'
import { bsc, bscTestnet, mainnet } from '@wagmi/core/chains'
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi'
import { readable, writable } from 'svelte/store'

const metadata = {
	name: 'LP-Rescue',
	description: 'DApp to add liquidity to a Uniswap v2 or PancakeSwap v2 LP which is stuck due to a non-zero balance',
	url: 'https://lp-rescue.beeb.li',
	icons: ['https://raw.githubusercontent.com/beeb/lp-rescue-frontend/main/static/android-chrome-512x512.png'],
}

const chains = [mainnet, bsc, bscTestnet]

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

export const modal = readable(createWeb3Modal({ wagmiConfig, projectId, chains }))
export const userAddress = writable<undefined | Address>(undefined)
export const isConnected = writable(false)
