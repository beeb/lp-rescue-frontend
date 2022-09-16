<script lang="ts">
	import { onMount } from 'svelte'
	import { ethers } from 'ethers'
	import { signerAddress, defaultEvmStores, chainId } from 'svelte-ethers-store'
	import { default as Onboard } from '@web3-onboard/core'
	import type { Chain } from '@web3-onboard/common'
	import injectedModule from '@web3-onboard/injected-wallets'
	import walletConnectModule from '@web3-onboard/walletconnect'
	import CloseIcon from 'virtual:icons/ri/close-line'

	let activeChain: number = 56

	const chains: Record<number, Chain> = {
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

	const defaultProvider = new ethers.providers.JsonRpcProvider(
		chains[activeChain].rpcUrl || 'https://bsc-dataseed.binance.org'
	)
	const injected = injectedModule()
	const walletConnect = walletConnectModule({
		qrcodeModalOptions: {
			mobileLinks: ['rainbow', 'metamask', 'argent', 'trust', 'imtoken', 'pillar']
		},
		connectFirstChainId: true
	})
	const onboard = Onboard({
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

	const connect = async () => {
		const wallets = await onboard.connectWallet()
		if (wallets[0]) {
			const provider = new ethers.providers.Web3Provider(wallets[0].provider, 'any')
			await defaultEvmStores.setProvider(provider)
		}
	}

	const disconnect = async () => {
		const [primaryWallet] = onboard.state.get().wallets
		await onboard.disconnectWallet({ label: primaryWallet.label })
		const previouslyConnectedWallets: string[] = JSON.parse(window.localStorage.getItem('connectedWallets') || '[]')
		window.localStorage.setItem(
			'connectedWallets',
			JSON.stringify(previouslyConnectedWallets.filter((wallet) => wallet !== primaryWallet.label))
		)
		await defaultEvmStores.disconnect()
		await defaultEvmStores.setProvider(defaultProvider)
	}

	$: addressEllipsis = $signerAddress ? `${$signerAddress.slice(0, 6)}...${$signerAddress.slice(-4)}` : ''

	onMount(async () => {
		const walletsSub = onboard.state.select('wallets')
		const { unsubscribe: unsubscribeWallets } = walletsSub.subscribe(async (wallets) => {
			const previouslyConnectedWallets: string[] = JSON.parse(window.localStorage.getItem('connectedWallets') || '[]')
			const connectedWallets = wallets.map(({ label }) => label)
			const allConnectedWallets = new Set([...previouslyConnectedWallets, ...connectedWallets])
			window.localStorage.setItem('connectedWallets', JSON.stringify([...allConnectedWallets]))
			if (wallets[0]) {
				if (
					wallets[0].chains[0].id !== ethers.utils.hexlify($chainId || 0) ||
					ethers.utils.getAddress(wallets[0].accounts[0].address) !== $signerAddress
				) {
					const provider = new ethers.providers.Web3Provider(wallets[0].provider, 'any')
					defaultEvmStores.setProvider(provider)
				}
			}
		})

		const previouslyConnectedWallets: string[] = JSON.parse(window.localStorage.getItem('connectedWallets') || '[]')
		if (previouslyConnectedWallets.length) {
			await onboard.connectWallet({
				autoSelect: { label: previouslyConnectedWallets[0], disableModals: true }
			})
		} else {
			await defaultEvmStores.setProvider(defaultProvider)
		}

		return () => unsubscribeWallets()
	})
</script>

<div class="flex gap-4">
	<div>Dropdown with chains here</div>
	<div class="flex gap-1">
		{#if $signerAddress}
			<button type="button" class="btn btn-circle" on:click={() => disconnect()}>
				<CloseIcon class="h-6 w-6" />
			</button>
			<button type="button" class="btn normal-case gap-2 rounded-full" on:click={() => disconnect()}>
				{addressEllipsis}
			</button>
		{:else}
			<button type="button" class="btn rounded-full" on:click={() => connect()}>Connect</button>
		{/if}
	</div>
</div>
