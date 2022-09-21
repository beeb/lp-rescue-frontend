<script lang="ts">
	import { fly } from 'svelte/transition'
	import { createEventDispatcher } from 'svelte'
	import { signerAddress, contracts } from 'svelte-ethers-store'
	import { activeChain, chains, chainData } from '$lib/stores/app'
	import classnames from 'vest/classnames'
	import ErrorIcon from 'virtual:icons/ri/error-warning-line'
	import { suite } from '$lib/suites/tokenForm'
	import type { SuiteRunResult } from 'vest'

	interface Fields {
		baseToken: string
		mainToken: string
	}

	let formState: Fields = {
		baseToken: '',
		mainToken: ''
	}

	let result = suite(formState)
	let baseTokenValidating = false
	let mainTokenValidating = false

	const handleChange = (name: string | undefined = undefined) => {
		if (name === 'baseToken') {
			baseTokenValidating = true
		} else if (name === 'mainToken') {
			mainTokenValidating = true
		}

		result = suite(formState)

		result.done((res) => {
			// after async validation is done
			result = res as SuiteRunResult
			baseTokenValidating = false
			mainTokenValidating = false
		})
	}

	const onSelectBaseToken = (e: Event) => {
		const target = e.target as HTMLSelectElement
		formState.baseToken = target.value
		handleChange('baseToken')
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
			<form on:submit|preventDefault class="flex flex-col gap-6">
				<div class="form-control">
					<label class="label" for="base-token">
						<span class="label-text">Base Token</span>
						{#if baseTokenValidating}
							<span class="label-text-alt"><div class="loader" /></span>
						{:else if result.hasErrors('baseToken')}
							<span class="label-text-alt text-error">{result.getErrors('baseToken')[0]}</span>
						{:else if result.hasWarnings('baseToken')}
							<span class="label-text-alt text-warning">{result.getWarnings('baseToken')[0]}</span>
						{:else if $contracts.baseToken}
							<span class="label-text-alt text-success">
								{#await $contracts.baseToken.name() then name}
									{name}
								{/await}
								{#await $contracts.baseToken.symbol() then symbol}
									({symbol})
								{/await}
							</span>
						{/if}
					</label>
					<label class="input-group">
						<input
							id="base-token"
							type="text"
							placeholder="0x..."
							class={`input input-bordered grow ${cn('baseToken')}`}
							bind:value={formState.baseToken}
							on:input={() => handleChange('baseToken')}
						/>
						<select class="select select-bordered" on:change|preventDefault={(e) => onSelectBaseToken(e)}>
							<option disabled selected>Common</option>
							{#each Object.entries(chainData[$activeChain].commonTokens) as [token, tokenAddress] (tokenAddress)}
								<option value={tokenAddress}>{token}</option>
							{/each}
						</select>
					</label>
				</div>
				<div class="form-control">
					<label class="label" for="main-token">
						<span class="label-text">Your Token</span>
						{#if mainTokenValidating}
							<span class="label-text-alt"><div class="loader" /></span>
						{:else if result.hasErrors('mainToken')}
							<span class="label-text-alt text-error">{result.getErrors('mainToken')[0]}</span>
						{:else if result.hasWarnings('mainToken')}
							<span class="label-text-alt text-warning">{result.getWarnings('mainToken')[0]}</span>
						{:else if $contracts.mainToken}
							<span class="label-text-alt text-success">
								{#await $contracts.mainToken.name() then name}
									{name}
								{/await}
								{#await $contracts.mainToken.symbol() then symbol}
									({symbol})
								{/await}
							</span>
						{/if}
					</label>
					<input
						type="text"
						placeholder="0x..."
						class={`input input-bordered grow ${cn('mainToken')}`}
						bind:value={formState.mainToken}
						on:input={() => handleChange('mainToken')}
					/>
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

<style>
	.loader {
		height: 1rem;
		width: 1rem;
		border-radius: 9999px;
		border-width: 2px;
		animation: spin 2s linear infinite;
		border-top-color: transparent;
		border-left-color: transparent;
		border-bottom-color: hsl(--bc);
		border-right-color: hsl(--bc);
	}
</style>
