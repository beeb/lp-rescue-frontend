<script lang="ts">
	import { onMount } from 'svelte'
	import { fly } from 'svelte/transition'
	import { signerAddress, contracts } from 'svelte-ethers-store'
	import { chains, chainData } from '$lib/constants'
	import {
		activeChain,
		step,
		baseTokenSymbol,
		mainTokenSymbol,
		baseTokenName,
		mainTokenName,
		factoryAddress
	} from '$lib/stores/app'
	import classnames from 'vest/classnames'
	import ErrorIcon from 'virtual:icons/ri/error-warning-line'
	import { suite } from '$lib/suites/tokenForm'
	import type { SuiteRunResult } from 'vest'
	import ArrowRightIcon from 'virtual:icons/ri/arrow-right-s-line'
	import ArrowLeftIcon from 'virtual:icons/ri/arrow-left-s-line'

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
	let inTransition = false

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

	onMount(() => {
		if ($contracts.baseToken) {
			formState.baseToken = $contracts.baseToken.address
			handleChange('baseToken')
		}
		if ($contracts.mainToken) {
			formState.mainToken = $contracts.mainToken.address
			handleChange('mainToken')
		}
	})

	$: cn = classnames(result, {
		warning: 'input-warning',
		invalid: 'input-error'
	})

	$: valid = result.isValid()

	$: {
		$factoryAddress
	} // trigger reactivity
</script>

<div
	class="card col-start-1 row-start-1 w-full bg-base-200 shadow-lg"
	in:fly={{ x: 500, duration: 500 }}
	out:fly={{ x: -500, duration: 500 }}
>
	<div class="card-body gap-6">
		<h2 class="card-title font-comic text-3xl">Choose Tokens</h2>
		<div>Now, please choose the two tokens of the liquidity pool.</div>
		{#if $signerAddress && chains[$activeChain]}
			<form on:submit|preventDefault class="flex flex-col gap-6">
				<div class="form-control">
					<label class="label" for="base-token">
						<span class="label-text sm:text-lg">Base Token</span>
						{#if baseTokenValidating}
							<span class="label-text-alt"><div class="loader" /></span>
						{:else if result.hasErrors('baseToken')}
							<span class="label-text-alt text-error">{result.getErrors('baseToken')[0]}</span>
						{:else if result.hasWarnings('baseToken')}
							<span class="label-text-alt text-warning">
								{$baseTokenName}
								({$baseTokenSymbol}):
								{result.getWarnings('baseToken')[0]}
							</span>
						{:else if $contracts.baseToken}
							<span class="label-text-alt text-success">
								{$baseTokenName}
								({$baseTokenSymbol})
							</span>
						{/if}
					</label>
					<label class="input-group sm:input-group-lg">
						<input
							id="base-token"
							type="text"
							placeholder="0x..."
							class={`input-bordered input min-w-0 flex-auto sm:input-lg ${cn('baseToken')}`}
							bind:value={formState.baseToken}
							on:input={() => handleChange('baseToken')}
						/>
						<select
							class="select-bordered select pr-10 sm:select-lg"
							on:change|preventDefault={(e) => onSelectBaseToken(e)}
						>
							<option disabled selected>Common</option>
							{#each Object.entries(chainData[$activeChain].commonTokens) as [token, tokenAddress] (tokenAddress)}
								<option value={tokenAddress}>{token}</option>
							{/each}
						</select>
					</label>
				</div>
				<div class="form-control">
					<label class="label" for="main-token">
						<span class="label-text sm:text-lg">Your Token</span>
						{#if mainTokenValidating}
							<span class="label-text-alt"><div class="loader" /></span>
						{:else if result.hasErrors('mainToken')}
							<span class="label-text-alt text-error">{result.getErrors('mainToken')[0]}</span>
						{:else if result.hasWarnings('mainToken')}
							<span class="label-text-alt text-warning">
								{$mainTokenName}
								({$mainTokenSymbol}):
								{result.getWarnings('mainToken')[0]}
							</span>
						{:else if $contracts.mainToken}
							<span class="label-text-alt text-success">
								{$mainTokenName}
								({$mainTokenSymbol})
							</span>
						{/if}
					</label>
					<input
						type="text"
						placeholder="0x..."
						class={`input-bordered input flex-auto sm:input-lg ${cn('mainToken')}`}
						bind:value={formState.mainToken}
						on:input={() => handleChange('mainToken')}
					/>
				</div>
			</form>
		{:else}
			<div class="alert alert-error justify-center shadow-lg">
				<div>
					<ErrorIcon /> Use the controls in the top-right to connect and set a valid network.
				</div>
			</div>
		{/if}
	</div>
</div>

{#if !inTransition}
	<div class="col-start-1 row-start-2 mt-6 flex justify-center gap-6">
		<button
			type="button"
			class="btn-outline btn-primary btn gap-1 pl-3"
			on:click={() => {
				inTransition = true
				$step--
			}}
		>
			<ArrowLeftIcon /> Previous
		</button>
		<button
			type="button"
			class="btn-primary btn gap-1 pr-3"
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

<style>
	.loader {
		height: 1rem;
		width: 1rem;
		border-radius: 9999px;
		border-width: 2px;
		animation: spin 2s linear infinite;
		border-top-color: transparent;
		border-left-color: transparent;
		border-bottom-color: hsl(var(--bc));
		border-right-color: hsl(var(--bc));
	}
	.label-text-alt {
		@apply sm:text-base;
	}
</style>
