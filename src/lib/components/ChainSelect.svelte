<script lang="ts">
	import { chains, onboard, chainData } from '$lib/constants'
	import { activeChain, activeChainHex, activeAmm, isValidChainId } from '$lib/stores/app'
	import { defaultEvmStores } from 'svelte-ethers-store'
	import { ethers } from 'ethers'
	import LPRescue from '$lib/abi/LPRescue.json'
	import ArrowDownIcon from 'virtual:icons/ri/arrow-down-s-line'
</script>

<div class="flex gap-2 lg:gap-6">
	<div class="dropdown-end dropdown">
		<label
			tabindex="0"
			role="button"
			class="btn-primary btn mb-1 gap-2 pr-3"
			class:btn-error={!isValidChainId($activeChain)}
			for="chain-select"
		>
			{#if isValidChainId($activeChain)}
				<img src={`/chains/${$activeChain}.svg`} alt="" class="h-6 w-6" />
				<span class="hidden lg:inline">{chains[$activeChain].label}</span>
			{:else}
				Wrong network
			{/if}
			<ArrowDownIcon />
		</label>
		<ul
			tabindex="0"
			role="menu"
			class="dropdown-content menu w-60 rounded-3xl bg-base-300 p-2 shadow"
			id="chain-select"
		>
			{#each Object.values(chains) as chain}
				<li>
					<button
						type="button"
						class={`${
							chain.id === $activeChainHex
								? 'border border-primary bg-base-100 hover:bg-base-200 focus:bg-base-200'
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
						<img src={`/chains/${parseInt(chain.id, 16)}.svg`} alt="" class="h-6 w-6" />
						{chain.label}
					</button>
				</li>
			{/each}
		</ul>
	</div>
	{#if isValidChainId($activeChain) && Object.keys(chainData[$activeChain].amm).length > 1}
		<div class="dropdown-end dropdown">
			<label tabindex="0" role="button" class="btn-secondary btn mb-1 gap-2 pr-3" for="chain-select">
				<img src={`/amm/${$activeAmm}.svg`} alt="" class="h-6 w-6" />
				<span class="hidden lg:inline">{chainData[$activeChain].amm[$activeAmm].name}</span>
				<ArrowDownIcon />
			</label>
			<ul
				tabindex="0"
				role="menu"
				class="dropdown-content menu w-60 rounded-3xl bg-base-300 p-2 shadow"
				id="chain-select"
			>
				{#each Object.entries(chainData[$activeChain].amm) as [ammKey, amm]}
					<li>
						<button
							type="button"
							class={`${
								ammKey === $activeAmm ? 'border border-primary bg-base-100 hover:bg-base-200 focus:bg-base-200' : ''
							}`}
							on:click={async () => {
								if (amm.rescueAddress !== ethers.constants.AddressZero) {
									activeAmm.set(ammKey)
									await defaultEvmStores.attachContract('LPRescue', amm.rescueAddress, JSON.stringify(LPRescue))
								}
							}}
						>
							<img src={`/amm/${ammKey}.svg`} alt="" class="h-6 w-6" />
							{amm.name}
						</button>
					</li>
				{/each}
			</ul>
		</div>
	{:else if isValidChainId($activeChain)}
		<span class="btn-secondary btn mb-1 cursor-default gap-2 hover:border-secondary hover:bg-secondary">
			<img src={`/amm/${$activeAmm}.svg`} alt="" class="h-6 w-6" />
			<span class="hidden lg:inline">{chainData[$activeChain].amm[$activeAmm].name}</span>
		</span>
	{/if}
</div>
