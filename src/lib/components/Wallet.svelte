<script lang="ts">
	import { onMount } from 'svelte'
	import { ethers } from 'ethers'
	import { signerAddress, defaultEvmStores, chainId } from 'svelte-ethers-store'
	import { default as Onboard } from '@web3-onboard/core'
	import type { Chain } from '@web3-onboard/common'
	import injectedModule from '@web3-onboard/injected-wallets'
	import walletConnectModule from '@web3-onboard/walletconnect'
	import CloseIcon from 'virtual:icons/ri/close-line'
	import ArrowDownIcon from 'virtual:icons/ri/arrow-down-s-line'

	let activeChain: number = 56
	$: activeChainHex = ethers.utils.hexlify(activeChain)

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
			activeChain = parseInt(wallets[0].chains[0].id, 16)
			if (parseInt(wallets[0].chains[0].id) in chains) {
				const provider = new ethers.providers.Web3Provider(wallets[0].provider, 'any')
				await defaultEvmStores.setProvider(provider)
			}
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
				console.log(wallets[0].chains[0])
				if (
					wallets[0].chains[0].id !== ethers.utils.hexlify($chainId || 0) || // chainId changed
					!chains[activeChain] || // we had selected an unsupported network
					ethers.utils.getAddress(wallets[0].accounts[0].address) !== $signerAddress // the wallet changed
				) {
					activeChain = parseInt(wallets[0].chains[0].id, 16)
					if (parseInt(wallets[0].chains[0].id) in chains) {
						const provider = new ethers.providers.Web3Provider(wallets[0].provider, 'any')
						defaultEvmStores.setProvider(provider)
					}
				}
			}
		})

		await defaultEvmStores.setProvider(defaultProvider)
		const previouslyConnectedWallets: string[] = JSON.parse(window.localStorage.getItem('connectedWallets') || '[]')
		if (previouslyConnectedWallets.length) {
			await onboard.connectWallet({
				autoSelect: { label: previouslyConnectedWallets[0], disableModals: true }
			})
		}

		return () => unsubscribeWallets()
	})
</script>

<div class="flex gap-6">
	<div class="dropdown dropdown-end">
		<label
			tabindex="0"
			class="btn btn-secondary rounded-full mb-1 gap-2 pl-5 pr-3"
			class:btn-error={!chains[activeChain]}
			for="chain-select"
		>
			{(chains[activeChain] && chains[activeChain].label) || 'Wrong network'}
			<ArrowDownIcon />
		</label>
		<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-300 rounded-3xl w-52" id="chain-select">
			{#each Object.values(chains) as chain}
				<li>
					<button
						type="button"
						class={`!rounded-full ${
							chain.id === activeChainHex
								? 'bg-base-100 hover:bg-base-200 focus:bg-base-200 border border-secondary'
								: ''
						}`}
						on:click={async () => {
							const success = await onboard.setChain({ chainId: chain.id })
							if (success) {
								activeChain = parseInt(chain.id, 16)
							}
						}}
					>
						{chain.label}
					</button>
				</li>
			{/each}
		</ul>
	</div>
	<div class="flex gap-1">
		{#if $signerAddress}
			<button type="button" class="btn btn-circle btn-secondary" on:click={() => disconnect()}>
				<CloseIcon class="h-6 w-6" />
			</button>
			<button type="button" class="btn btn-secondary btn-outline gap-2 rounded-full" on:click={() => disconnect()}>
				{addressEllipsis}
			</button>
		{:else}
			<button type="button" class="btn rounded-full" on:click={() => connect()}>Connect</button>
		{/if}
	</div>
</div>
