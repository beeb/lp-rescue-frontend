import { writable, derived, get, type Writable, type Readable } from 'svelte/store'
import { BigNumber, ethers, type Contract } from 'ethers'
import type { WalletState } from '@web3-onboard/core'
import { defaultEvmStores, chainId, signerAddress, contracts } from 'svelte-ethers-store'
import {
	chains,
	chainData,
	defaultChain,
	defaultProvider,
	onboard,
	type SupportedChain,
	type SupportedAmm
} from '$lib/constants'
import LPRescue from '$lib/abi/LPRescue.json'

/* stores */

export const dark: Writable<boolean> = writable(false)
export const activeChain: Writable<number> = writable(defaultChain)
export const activeChainHex: Readable<string> = derived(activeChain, ($activeChain) =>
	ethers.utils.hexlify($activeChain)
)
export const activeAmm: Writable<SupportedAmm> = writable('pcs')
export const step: Writable<number> = writable(0)
export const wethAddress: Readable<string> = derived(
	[contracts],
	([$contracts], set) => {
		if ($contracts.LPRescue) {
			$contracts.LPRescue.WETH().then((address: string) => set(address))
		}
	},
	''
)
export const factoryAddress: Readable<string> = derived(
	[contracts],
	([$contracts], set) => {
		if ($contracts.LPRescue) {
			$contracts.LPRescue.factory().then((address: string) => set(address))
		}
	},
	''
)
export const baseTokenSymbol: Readable<string> = derived(
	[contracts],
	([$contracts], set) => {
		if ($contracts.baseToken) {
			$contracts.baseToken.symbol().then((symbol: string) => {
				set(symbol)
			})
		}
	},
	''
)
export const mainTokenSymbol: Readable<string> = derived(
	[contracts],
	([$contracts], set) => {
		if ($contracts.mainToken) {
			$contracts.mainToken.symbol().then((symbol: string) => set(symbol))
		}
	},
	''
)
export const baseTokenName: Readable<string> = derived(
	[contracts],
	([$contracts], set) => {
		if ($contracts.baseToken) {
			$contracts.baseToken.name().then((name: string) => {
				set(name)
			})
		}
	},
	''
)
export const mainTokenName: Readable<string> = derived(
	[contracts],
	([$contracts], set) => {
		if ($contracts.mainToken) {
			$contracts.mainToken.name().then((name: string) => set(name))
		}
	},
	''
)

export const isTokenApproved = async (
	token: Contract | undefined,
	spender: string
): Promise<[boolean, BigNumber | null]> => {
	if (!token) {
		return [false, null]
	}
	if (token.address === get(wethAddress)) {
		return [true, null]
	}
	const allowance: BigNumber = await token.allowance(get(signerAddress), spender)
	return [allowance.gt(ethers.constants.MaxUint256.div(2)), allowance]
}

export const isValidChainId = (chainId: number): chainId is SupportedChain => {
	return chainId in chains
}

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
			resetForm()
			const chainIdTemp = parseInt(wallets[0].chains[0].id, 16)
			activeChain.set(chainIdTemp)
			if (isValidChainId(chainIdTemp)) {
				const provider = new ethers.providers.Web3Provider(wallets[0].provider, 'any')
				defaultEvmStores.setProvider(provider)
				const amms: SupportedAmm[] = Object.keys(chainData[chainIdTemp].amm)
				if (amms.length && chainData[chainIdTemp].amm[amms[0]].rescueAddress !== ethers.constants.AddressZero) {
					activeAmm.set(amms[0])
					await defaultEvmStores.attachContract(
						'LPRescue',
						chainData[chainIdTemp].amm[amms[0]].rescueAddress,
						JSON.stringify(LPRescue)
					)
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

export const resetForm = () => {
	step.set(0)
}
