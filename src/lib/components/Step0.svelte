<script lang="ts">
	import { fly } from 'svelte/transition'
	import { signerAddress } from 'svelte-ethers-store'
	import { chains } from '$lib/constants'
	import { activeChain, step } from '$lib/stores/app'
	import CheckIcon from 'virtual:icons/ri/check-line'
	import InfoIcon from 'virtual:icons/ri/information-line'
	import ArrowRightIcon from 'virtual:icons/ri/arrow-right-s-line'
	import LinkIcon from 'virtual:icons/ri/external-link-line'

	let checked1 = false
	let checked2 = false
	let checked3 = false
	let inTransition = false

	$: valid = $signerAddress && chains[$activeChain] && checked1 && checked2 && checked3
</script>

<div
	class="col-start-1 row-start-1 w-full card bg-base-200 shadow-lg"
	in:fly={{ x: 500, duration: 500 }}
	out:fly={{ x: -500, duration: 500 }}
>
	<div class="card-body gap-6">
		<h2 class="card-title text-3xl font-comic">Before we begin...</h2>
		<div>
			<h3 class="text-xl mb-2">What is <strong>LP+Rescue?</strong></h3>
			<p>
				<strong>LP+Rescue</strong> is a tool you can use when a Liquidity Pool (LP) has been created on an AMM (Uniswap
				v2, Pancakeswap) but no liquidity can be added to it. Most commonly, some malicious actor makes the contract
				"stuck" by adding a tiny amount of one of the tokens (usually WETH or WBNB) and calls the
				<code class="font-mono bg-gray-800 text-gray-200 p-1 rounded">sync</code>
				function of the smart contract. This leads to one of the
				<code class="font-mono bg-gray-800 text-gray-200 p-1 rounded">reserve</code>s of the pair to be non-zero, which
				is not supported by the AMM's Router for adding liquidity.<br />
				Here is an
				<a href="https://github.com/beeb/lp-rescue-contract" target="_blank" class="link">in-depth explanation</a>
				<LinkIcon class="inline opacity-60" />.
			</p>
		</div>
		<div>
			This tool replaces the AMM Router and allows to re-establish the correct balances and reserves in a single
			transaction, which effectively makes the LP "unstuck". For this, it uses a <a
				href="https://github.com/beeb/lp-rescue-contract/blob/main/contracts/LPRescue.sol"
				target="_blank"
				class="link">custom contract</a
			>
			<LinkIcon class="inline opacity-60" />.
		</div>
		<div>First off, your wallet needs to be connected and on the right network.</div>
		{#if $signerAddress && chains[$activeChain]}
			<div class="alert alert-success shadow-lg justify-center">
				<div>
					<CheckIcon /> Everything seems correct
				</div>
			</div>
		{:else}
			<div class="alert alert-info shadow-lg justify-center">
				<div>
					<InfoIcon /> Use the controls in the top-right to connect and set a valid network.
				</div>
			</div>
		{/if}
		<div>Then, please make sure of the following and tick the boxes to proceed:</div>
		<div class="form-control">
			<label class="label cursor-pointer justify-start gap-4">
				<input type="checkbox" class="checkbox" bind:checked={checked1} />
				<span class="label-text">None of my tokens have been sent to the LP contract yet</span>
			</label>
		</div>
		<div class="form-control">
			<label class="label cursor-pointer justify-start gap-4">
				<input type="checkbox" class="checkbox" bind:checked={checked2} />
				<span class="label-text"
					>In the block explorer (etherscan/bscscan), the LP contract shows it has some base tokens (WETH, stablecoin,
					etc.) and using the AMM Router fails.</span
				>
			</label>
		</div>
		<div class="form-control">
			<label class="label cursor-pointer justify-start gap-4">
				<input type="checkbox" class="checkbox" bind:checked={checked3} />
				<span class="label-text"
					>My tokens can be transferred from my wallet to the LP contract without tax (important!)</span
				>
			</label>
		</div>
	</div>
</div>

{#if !inTransition}
	<div class="col-start-1 row-start-2 flex gap-6 justify-center mt-6">
		<button
			type="button"
			class="btn btn-primary gap-1 pr-3"
			on:click={() => {
				inTransition = true
				$step++
			}}
			disabled={!valid}
		>
			Next <ArrowRightIcon />
		</button>
	</div>
{/if}
