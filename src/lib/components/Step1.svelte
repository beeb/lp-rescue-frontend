<script lang="ts">
	import { fly } from 'svelte/transition'
	import { createEventDispatcher } from 'svelte'
	import { signerAddress } from 'svelte-ethers-store'
	import { activeChain, chains } from '$lib/stores/app'
	import classnames from 'vest/classnames'
	import ErrorIcon from 'virtual:icons/ri/error-warning-line'
	import { suite } from '$lib/suites/tokenForm'

	interface Fields {
		baseToken: string
		mainToken: string
	}

	let formState: Fields = {
		baseToken: '',
		mainToken: ''
	}

	let result = suite(formState)

	const handleChange = () => {
		result = suite(formState)
	}

	const onSelectBaseToken = (e: Event) => {
		const target = e.target as HTMLSelectElement
		formState.baseToken = target.value
		handleChange()
		target.selectedIndex = 0
	}

	$: cn = classnames(result, {
		warning: 'input-warning',
		invalid: 'input-error'
	})

	const dispatch = createEventDispatcher()

	$: {
		const valid = result.isValid()
		dispatch('valid', valid)
	}
</script>

<div
	class="col-start-1 row-start-1 w-full card bg-base-200 shadow-lg"
	in:fly={{ x: 500, duration: 500 }}
	out:fly={{ x: -500, duration: 500 }}
>
	<div class="card-body gap-6">
		<h2 class="card-title text-3xl">Choose Tokens</h2>
		<div>Now, please choose the two tokens of the liquidity pair.</div>
		{#if $signerAddress && chains[$activeChain]}
			<form on:submit|preventDefault>
				<div class="form-control">
					<label class="label" for="base-token">
						<span class="label-text">Base Token</span>
						{#if result.getErrors('baseToken').length}
							<span class="label-text-alt text-error">{result.getErrors('baseToken')[0]}</span>
						{/if}
					</label>
					<label class="input-group" id="base-token">
						<input
							type="text"
							placeholder="0x..."
							class={`input input-bordered grow ${cn('baseToken')}`}
							bind:value={formState.baseToken}
							on:input={() => handleChange()}
						/>
						<select class="select select-bordered" on:change|preventDefault={(e) => onSelectBaseToken(e)}>
							<option disabled selected>Common</option>
							<option value="0xwbnb">WBNB</option>
							<option value="0xbusd">BUSD</option>
							<option value="0xusdt">USDT</option>
							<option value="0xusdc">USDC</option>
						</select>
					</label>
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
