<script lang="ts">
	import { fly } from 'svelte/transition'
	import { chains } from '$lib/constants'
	import { step, activeChain, baseTokenSymbol, mainTokenSymbol } from '$lib/stores/app'
	import { signerAddress } from 'svelte-ethers-store'
	import ErrorIcon from 'virtual:icons/ri/error-warning-line'
	import ArrowRightIcon from 'virtual:icons/ri/arrow-right-s-line'
	import ArrowLeftIcon from 'virtual:icons/ri/arrow-left-s-line'

	interface Fields {
		baseTokenAmount: string
		mainTokenAmount: string
	}

	let formState: Fields = {
		baseTokenAmount: '',
		mainTokenAmount: ''
	}

	let inTransition = false

	$: valid = true
</script>

<div
	class="col-start-1 row-start-1 w-full card bg-base-200 shadow-lg"
	in:fly={{ x: 500, duration: 500 }}
	out:fly={{ x: -500, duration: 500 }}
>
	<div class="card-body gap-6">
		<h2 class="card-title text-3xl font-comic">Add Liquidity</h2>
		<div>
			You can now use the form below to add liquidity to the pair, in exactly the same way as the Dex offers. Ignore the
			tokens already in the LP (the contract will deduct them) and check the calculations below to add the appropriate
			amount of liquidity.
		</div>
		{#if $signerAddress && chains[$activeChain]}
			<form on:submit|preventDefault class="flex flex-col gap-6 items-center">
				<div class="form-control w-full">
					<label class="label" for="base-token-amount">
						<span class="label-text">Base Token</span>
					</label>
					<label class="input-group input-group-lg">
						<input
							id="base-token-amount"
							type="text"
							placeholder="0.0"
							class={`input input-bordered input-lg grow`}
							bind:value={formState.baseTokenAmount}
							on:input={() => {}}
						/>
						<span class="pr-6">{$baseTokenSymbol}</span>
					</label>
				</div>
				<div class="text-3xl font-comic">+</div>
				<div class="form-control w-full -mt-6">
					<label class="label" for="main-token-amount">
						<span class="label-text">Main Token</span>
					</label>
					<label class="input-group input-group-lg">
						<input
							id="main-token-amount"
							type="text"
							placeholder="0.0"
							class={`input input-bordered input-lg grow`}
							bind:value={formState.mainTokenAmount}
							on:input={() => {}}
						/>
						<span class="pr-6">{$mainTokenSymbol}</span>
					</label>
				</div>
				<div class="card w-full bg-base-300">
					<div class="card-body p-4">
						<h3 class="card-title text-lg">Prices</h3>
						Calculation
					</div>
				</div>
				<div class="card-actions w-full justify-end">
					<button type="button" class="btn btn-lg btn-info gap-2 font-comic text-xl uppercase">
						<span class="text-3xl">+</span> Rescue LP
					</button>
				</div>
			</form>
		{:else}
			<div class="alert alert-error shadow-lg justify-center">
				<div>
					<ErrorIcon /> Use the controls in the top-right to connect and set a valid network.
				</div>
			</div>
		{/if}
	</div>
</div>

{#if !inTransition}
	<div class="col-start-1 row-start-2 flex gap-6 justify-center mt-6">
		<button
			type="button"
			class="btn btn-primary btn-outline gap-1 pl-3"
			on:click={() => {
				inTransition = true
				$step--
			}}
		>
			<ArrowLeftIcon /> Previous
		</button>
	</div>
{/if}
