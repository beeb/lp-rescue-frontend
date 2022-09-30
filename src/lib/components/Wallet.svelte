<script lang="ts">
	import { onMount } from 'svelte'
	import { signerAddress, defaultEvmStores } from 'svelte-ethers-store'
	import { chains, defaultProvider, onboard } from '$lib/constants'
	import { activeChain, connect, disconnect, onWalletChange } from '$lib/stores/app'
	import CloseIcon from 'virtual:icons/ri/close-line'

	$: addressEllipsis = $signerAddress ? `${$signerAddress.slice(0, 6)}...${$signerAddress.slice(-4)}` : ''

	onMount(async () => {
		const walletsSub = onboard.state.select('wallets')
		const { unsubscribe } = walletsSub.subscribe(onWalletChange)

		await defaultEvmStores.setProvider(defaultProvider)
		const previouslyConnectedWallets: string[] = JSON.parse(window.localStorage.getItem('connectedWallets') || '[]')
		if (previouslyConnectedWallets.length) {
			await onboard.connectWallet({
				autoSelect: { label: previouslyConnectedWallets[0], disableModals: true }
			})
		}

		return () => unsubscribe()
	})
</script>

<div class="flex gap-2 lg:gap-6">
	<div class="flex gap-1 items-center">
		{#if $signerAddress}
			<button type="button" class="btn btn-sm btn-circle btn-primary" on:click={() => disconnect()}>
				<CloseIcon class="h-6 w-6" />
			</button>
			<span class="btn btn-primary btn-outline gap-2 btn-disabled bg-transparent">
				{addressEllipsis}
			</span>
		{:else if chains[$activeChain]}
			<button type="button" class="btn" on:click={() => connect()}>Connect</button>
		{/if}
	</div>
</div>
