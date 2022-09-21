import { writable, derived, get, type Writable } from 'svelte/store'
import type { Chain } from '@web3-onboard/common'
import { ethers } from 'ethers'
import { default as Onboard, type WalletState } from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets'
import walletConnectModule from '@web3-onboard/walletconnect'
import { defaultEvmStores, chainId, signerAddress } from 'svelte-ethers-store'
import LPRescue from '$lib/abi/LPRescue.json'

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

export interface ChainData {
	rescueAddress: string
	commonTokens: Record<string, string>
}

export const chainData: Record<number, ChainData> = {
	56: {
		rescueAddress: '0x0000000000000000000000000000000000000000',
		commonTokens: {
			WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
			BUSD: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
			USDT: '0x55d398326f99059fF775485246999027B3197955',
			USDC: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d'
		}
	},
	97: {
		rescueAddress: '0x3137311847574Ef86ef1141E6D2B47FD08912cc8',
		commonTokens: {
			WBNB: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
			BUSD: '0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7',
			USDT: '0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684',
			DAI: '0x8a9424745056Eb399FD19a0EC26A14316684e274'
		}
	}
}

export type SupportedChain = keyof typeof chains

const defaultChain: SupportedChain = parseInt(import.meta.env.VITE_DEFAULT_CHAIN || '56') as SupportedChain

export const dark: Writable<boolean> = writable(false)

export const activeChain: Writable<number> = writable(defaultChain)
export const activeChainHex = derived(activeChain, ($activeChain) => ethers.utils.hexlify($activeChain))

export const defaultProvider = new ethers.providers.JsonRpcProvider(
	chains[defaultChain].rpcUrl || 'https://bsc-dataseed.binance.org'
)

const injected = injectedModule()
const walletConnect = walletConnectModule({
	qrcodeModalOptions: {
		mobileLinks: ['rainbow', 'metamask', 'argent', 'trust', 'imtoken', 'pillar']
	},
	connectFirstChainId: true
})

export const onboard = Onboard({
	wallets: [injected, walletConnect],
	chains: Object.values(chains),
	connect: {
		showSidebar: false
	},
	accountCenter: {
		desktop: {
			enabled: false
		},
		mobile: {
			enabled: false
		}
	}
})

export const onWalletChange = async (wallets: WalletState[]) => {
	const previouslyConnectedWallets: string[] = JSON.parse(window.localStorage.getItem('connectedWallets') || '[]')
	const connectedWallets = wallets.map(({ label }) => label)
	const allConnectedWallets = new Set([...previouslyConnectedWallets, ...connectedWallets])
	window.localStorage.setItem('connectedWallets', JSON.stringify([...allConnectedWallets]))
	if (wallets[0]) {
		if (
			wallets[0].chains[0].id !== ethers.utils.hexlify(get(chainId) || 0) || // chainId changed
			!chains[get(activeChain)] || // we had selected an unsupported network
			ethers.utils.getAddress(wallets[0].accounts[0].address) !== get(signerAddress) // the wallet changed
		) {
			const chainIdTemp = parseInt(wallets[0].chains[0].id, 16)
			activeChain.set(chainIdTemp)
			if (isValidChainId(chainIdTemp)) {
				const provider = new ethers.providers.Web3Provider(wallets[0].provider, 'any')
				defaultEvmStores.setProvider(provider)
				if (chainData[chainIdTemp].rescueAddress !== ethers.constants.AddressZero) {
					defaultEvmStores.attachContract('LPRescue', chainData[chainIdTemp].rescueAddress, JSON.stringify(LPRescue))
				}
			}
		}
	}
}

export const connect = async () => {
	const wallets = await onboard.connectWallet()
	if (wallets[0]) {
		const chainIdTemp = parseInt(wallets[0].chains[0].id, 16)
		activeChain.set(chainIdTemp)
		if (isValidChainId(chainIdTemp)) {
			const provider = new ethers.providers.Web3Provider(wallets[0].provider, 'any')
			await defaultEvmStores.setProvider(provider)
		}
	}
}

export const disconnect = async () => {
	const [primaryWallet] = onboard.state.get().wallets
	if (primaryWallet) {
		await onboard.disconnectWallet({ label: primaryWallet.label })
	}
	window.localStorage.setItem('connectedWallets', JSON.stringify([]))
	await defaultEvmStores.disconnect()
	await defaultEvmStores.setProvider(defaultProvider)
}

export const isValidChainId = (chainId: number): chainId is SupportedChain => {
	return chainId in chains
}
