<script lang="ts">
	import { onMount } from 'svelte'
	import { ethers } from 'ethers'
	import { signerAddress, defaultEvmStores, chainId } from 'svelte-ethers-store'
	import Onboard from '@web3-onboard/core'
	import injectedModule from '@web3-onboard/injected-wallets'
	import walletConnectModule from '@web3-onboard/walletconnect'

	// TODO: get URL from network select dropdown
	const defaultProvider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org')
	const injected = injectedModule()
	const walletConnect = walletConnectModule({
		qrcodeModalOptions: {
			mobileLinks: ['rainbow', 'metamask', 'argent', 'trust', 'imtoken', 'pillar']
		},
		connectFirstChainId: true
	})
	const onboard = Onboard({
		wallets: [injected, walletConnect],
		chains: [
			{
				id: 56,
				token: 'BNB',
				label: 'BNB Smart Chain',
				rpcUrl: 'https://bsc-dataseed.binance.org'
			},
			{
				id: 97,
				token: 'tBNB',
				label: 'BSC Testnet',
				rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545'
			}
		],
		connect: {
			showSidebar: false
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

<h1 class="text-3xl mb-3">Welcome to Web3</h1>
<p class="mb-3">{$signerAddress} {$chainId}</p>
<p>
	{#if $signerAddress}
		<button type="button" class="btn" on:click={() => disconnect()}>Disconnect</button>
	{:else}
		<button type="button" class="btn" on:click={() => connect()}>Connect</button>
	{/if}
</p>
