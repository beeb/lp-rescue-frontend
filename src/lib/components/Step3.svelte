<script lang="ts">
	import { fly } from 'svelte/transition'
	import { chains } from '$lib/constants'
	import {
		step,
		activeChain,
		baseTokenSymbol,
		mainTokenSymbol,
		baseTokenDecimals,
		mainTokenDecimals
	} from '$lib/stores/app'
	import type { SuiteRunResult } from 'vest'
	import { signerAddress, contracts } from 'svelte-ethers-store'
	import { wethAddress } from '$lib/stores/app'
	import classnames from 'vest/classnames'
	import { ethers, BigNumber, FixedNumber } from 'ethers'
	import { suite } from '$lib/suites/amountForm'
	import { getNotificationsContext } from 'svelte-notifications'
	import ErrorIcon from 'virtual:icons/ri/error-warning-line'
	import ArrowLeftIcon from 'virtual:icons/ri/arrow-left-s-line'

	interface Fields {
		baseTokenAmount: string
		mainTokenAmount: string
	}

	interface Err {
		reason: string
	}

	let formState: Fields = {
		baseTokenAmount: '',
		mainTokenAmount: ''
	}
	let baseTokenWei: BigNumber | null = null
	let mainTokenWei: BigNumber | null = null
	let tokenPrice: string = '-'
	let tokenRate: string = '-'
	let result = suite(formState)
	let baseTokenValidating = false
	let mainTokenValidating = false
	let inTransition = false
	let loading = false

	const { addNotification } = getNotificationsContext()

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

	const rescueLp = async () => {
		if (!$contracts.LPRescue || !$contracts.baseToken || !$contracts.mainToken || !baseTokenWei || !mainTokenWei) {
			console.error('Contract not found')
			addNotification({
				type: 'error',
				position: 'bottom-left',
				text: `Contract object not found. Please raise an issue on <a href="https://github.com/beeb/lp-rescue-frontend">Github</a>.`
			})
			return
		}
		loading = true
		try {
			let value = BigNumber.from('0')
			if ($contracts.baseToken.address === $wethAddress) {
				value = baseTokenWei
			} else if ($contracts.mainToken.address === $wethAddress) {
				value = mainTokenWei
			}
			const tx = await $contracts.LPRescue.addLiquidity(
				$contracts.baseToken.address,
				$contracts.mainToken.address,
				baseTokenWei,
				mainTokenWei,
				$signerAddress,
				{ value }
			)
			const receipt = await tx.wait()
			if (receipt.status === 1) {
				addNotification({
					type: 'success',
					position: 'bottom-left',
					text: `Liquidity transaction succeeded: <a href="${chains[$activeChain].blockExplorerUrl}/tx/${receipt.transactionHash}" class="link" target="_blank">see in block explorer</a>.`
				})
			} else {
				addNotification({
					type: 'error',
					position: 'bottom-left',
					text: `Liquidity transaction failed: <a href="${chains[$activeChain].blockExplorerUrl}/tx/${receipt.transactionHash}" class="link" target="_blank">see in block explorer</a>.`
				})
			}
			return receipt.status === 1
		} catch (e) {
			addNotification({
				type: 'error',
				position: 'bottom-left',
				text: `Transaction error: ${(e as Err).reason || e}.`,
				removeAfter: 5000
			})
			return false
		} finally {
			loading = false
			setTimeout(() => {
				handleChange()
			}, 500)
		}
	}

	$: cn = classnames(result, {
		valid: 'input-success',
		warning: 'input-warning',
		invalid: 'input-error'
	})

	$: valid = result.isValid()

	$: {
		try {
			baseTokenWei = ethers.utils.parseUnits(formState.baseTokenAmount, $baseTokenDecimals)
		} catch {
			baseTokenWei = null
		}
	}
	$: {
		try {
			mainTokenWei = ethers.utils.parseUnits(formState.mainTokenAmount, $mainTokenDecimals)
		} catch {
			mainTokenWei = null
		}
	}
	$: {
		if (baseTokenWei && mainTokenWei) {
			const baseTokenNormalizeFactor = BigNumber.from('10').pow(BigNumber.from('18').sub($baseTokenDecimals))
			const baseTokenNormalized = baseTokenWei.mul(baseTokenNormalizeFactor)
			const mainTokenNormalizeFactor = BigNumber.from('10').pow(BigNumber.from('18').sub($mainTokenDecimals))
			const mainTokenNormalized = mainTokenWei.mul(mainTokenNormalizeFactor)
			try {
				tokenPrice = FixedNumber.from(baseTokenNormalized).divUnsafe(FixedNumber.from(mainTokenNormalized)).toString()
				tokenRate = FixedNumber.from(mainTokenNormalized).divUnsafe(FixedNumber.from(baseTokenNormalized)).toString()
			} catch {
				tokenPrice = '-'
				tokenRate = '-'
			}
		}
	}
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
						<span class="label-text sm:text-lg">Base Token Amount</span>
						{#if baseTokenValidating}
							<span class="label-text-alt"><div class="loader" /></span>
						{:else if result.hasErrors('baseTokenAmount')}
							<span class="label-text-alt text-error">{result.getErrors('baseTokenAmount')[0]}</span>
						{:else if result.hasWarnings('baseTokenAmount')}
							<span class="label-text-alt text-warning">
								{result.getWarnings('baseTokenAmount')[0]}
							</span>
						{/if}
					</label>
					<label class="input-group sm:input-group-lg">
						<input
							id="base-token-amount"
							type="text"
							placeholder="0.0"
							class={`input input-bordered sm:input-lg flex-auto min-w-0 ${cn('baseTokenAmount')}`}
							bind:value={formState.baseTokenAmount}
							on:input={() => handleChange('baseToken')}
						/>
						<span class="pr-6">{$baseTokenSymbol}</span>
					</label>
				</div>
				<div class="text-3xl font-comic">+</div>
				<div class="form-control w-full -mt-6">
					<label class="label" for="main-token-amount">
						<span class="label-text sm:text-lg">Main Token Amount</span>
						{#if mainTokenValidating}
							<span class="label-text-alt"><div class="loader" /></span>
						{:else if result.hasErrors('mainTokenAmount')}
							<span class="label-text-alt text-error">{result.getErrors('mainTokenAmount')[0]}</span>
						{:else if result.hasWarnings('mainTokenAmount')}
							<span class="label-text-alt text-warning">
								{result.getWarnings('mainTokenAmount')[0]}
							</span>
						{/if}
					</label>
					<label class="input-group sm:input-group-lg">
						<input
							id="main-token-amount"
							type="text"
							placeholder="0.0"
							class={`input input-bordered sm:input-lg flex-auto min-w-0 ${cn('mainTokenAmount')}`}
							bind:value={formState.mainTokenAmount}
							on:input={() => handleChange('mainToken')}
						/>
						<span class="pr-6">{$mainTokenSymbol}</span>
					</label>
				</div>
				<div class="card w-full bg-base-300">
					<div class="card-body p-4">
						<h3 class="card-title sm:text-lg">Prices</h3>
						<div class="flex flex-col sm:flex-row gap-2 justify-evenly items-center">
							<div class=" flex flex-col items-center">
								<div>
									{tokenPrice}
								</div>
								<div class="opacity-70">{$baseTokenSymbol} per {$mainTokenSymbol}</div>
							</div>
							<div class="divider divider-vertical sm:divider-horizontal my-1 sm:my-0 mx-0 sm:mx-1" />
							<div class="flex flex-col items-center">
								<div>
									{tokenRate}
								</div>
								<div class="opacity-70">{$mainTokenSymbol} per {$baseTokenSymbol}</div>
							</div>
						</div>
					</div>
				</div>
				<div class="card-actions w-full justify-end">
					<button
						type="button"
						class="btn btn-lg btn-info gap-2 font-comic text-xl uppercase"
						disabled={!valid || loading}
						on:click={() => rescueLp()}
					>
						{#if loading}
							<div class="loader" />
						{/if}
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
