import { writable, derived, get, type Writable } from 'svelte/store'
import { ethers } from 'ethers'
import type { WalletState } from '@web3-onboard/core'
import { defaultEvmStores, chainId, signerAddress } from 'svelte-ethers-store'
import { chains, chainData, defaultChain, defaultProvider, onboard, type SupportedChain } from '$lib/constants'
import LPRescue from '$lib/abi/LPRescue.json'

/* stores */

export const dark: Writable<boolean> = writable(false)
export const activeChain: Writable<number> = writable(defaultChain)
export const activeChainHex = derived(activeChain, ($activeChain) => ethers.utils.hexlify($activeChain))

/* actions */

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
