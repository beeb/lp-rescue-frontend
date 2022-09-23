<script lang="ts">
	import { onMount } from 'svelte'
	import { signerAddress, defaultEvmStores } from 'svelte-ethers-store'
	import { chains, defaultProvider, onboard } from '$lib/constants'
	import { activeChain, activeChainHex, connect, disconnect, isValidChainId, onWalletChange } from '$lib/stores/app'
	import CloseIcon from 'virtual:icons/ri/close-line'
	import ArrowDownIcon from 'virtual:icons/ri/arrow-down-s-line'

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

<div class="flex gap-6">
	<div class="dropdown dropdown-end">
		<label
			tabindex="0"
			class="btn btn-primary mb-1 gap-2 pr-3"
			class:btn-error={!chains[$activeChain]}
			for="chain-select"
		>
			{#if isValidChainId($activeChain)}
				<img src={`/chains/${$activeChain}.svg`} alt="" class="w-6 h-6" />
			{/if}
			{(chains[$activeChain] && chains[$activeChain].label) || 'Wrong network'}
			<ArrowDownIcon />
		</label>
		<ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-300 rounded-3xl w-52" id="chain-select">
			{#each Object.values(chains) as chain}
				<li>
					<button
						type="button"
						class={`${
							chain.id === $activeChainHex
								? 'bg-base-100 hover:bg-base-200 focus:bg-base-200 border border-primary'
								: ''
						}`}
						on:click={async () => {
							const success = await onboard.setChain({ chainId: chain.id })
							if (success) {
								const chainId = parseInt(chain.id, 16)
								$activeChain = chainId
							}
						}}
					>
						<img src={`/chains/${parseInt(chain.id, 16)}.svg`} alt="" class="w-6 h-6" />
						{chain.label}
					</button>
				</li>
			{/each}
		</ul>
	</div>
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
