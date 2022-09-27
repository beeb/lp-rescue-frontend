<script>
	import { fly } from 'svelte/transition'
	import { step } from '$lib/stores/app'
	import ArrowRightIcon from 'virtual:icons/ri/arrow-right-s-line'
	import ArrowLeftIcon from 'virtual:icons/ri/arrow-left-s-line'
	import CrossIcon from 'virtual:icons/ri/add-circle-line'

	let inTransition = false

	$: valid = true
</script>

<div
	class="col-start-1 row-start-1 w-full card bg-base-200 shadow-lg"
	in:fly={{ x: 500, duration: 500 }}
	out:fly={{ x: -500, duration: 500 }}
>
	<div class="card-body">
		<h2 class="card-title text-3xl mb-4 font-comic">Add Liquidity</h2>
		<p class="mb-4">Step 3</p>
		<div class="card-actions justify-end">
			<button class="btn btn-lg btn-info gap-2 font-comic text-xl uppercase"
				><span class="text-3xl">+</span> Rescue LP</button
			>
		</div>
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
