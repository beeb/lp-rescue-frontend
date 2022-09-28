<script lang="ts">
	import { onMount } from 'svelte'
	import { fly } from 'svelte/transition'
	import { step, activeChain, isTokenApproved } from '$lib/stores/app'
	import { chains } from '$lib/constants'
	import { contracts, signerAddress } from 'svelte-ethers-store'
	import { BigNumber, ethers, type Contract } from 'ethers'
	import ArrowRightIcon from 'virtual:icons/ri/arrow-right-s-line'
	import ArrowLeftIcon from 'virtual:icons/ri/arrow-left-s-line'
	import CheckIcon from 'virtual:icons/ri/check-line'
	import ErrorIcon from 'virtual:icons/ri/error-warning-line'

	let inTransition = false

	let baseTokenSymbol: string
	let mainTokenSymbol: string
	let wethAddress: string

	let baseTokenLoading = false
	let mainTokenLoading = false
	let baseTokenApproved = false
	let mainTokenApproved = false
	let baseTokenAllowance: BigNumber | null = null
	let mainTokenAllowance: BigNumber | null = null

	const approveToken = async (token: Contract | undefined, spender: string) => {
		if (!token) {
			return false
		}
		if (token.address === $contracts.baseToken?.address) {
			baseTokenLoading = true
		} else {
			mainTokenLoading = true
		}
		try {
			const tx = await token.approve(spender, ethers.constants.MaxUint256)
			const receipt = await tx.wait()
			return receipt.status === 1
		} catch (e) {
			console.error(e)
			return false
		} finally {
			if (token.address === $contracts.baseToken?.address) {
				baseTokenLoading = false
			} else {
				mainTokenLoading = false
			}
			setTimeout(() => {
				checkTokenApproval()
			}, 500)
		}
	}

	const getTokenData = async () => {
		if ($contracts.baseToken) {
			baseTokenSymbol = await $contracts.baseToken.symbol()
		}
		if ($contracts.mainToken) {
			mainTokenSymbol = await $contracts.mainToken.symbol()
		}
		if ($contracts.LPRescue) {
			wethAddress = await $contracts.LPRescue.WETH()
		}
	}

	const checkTokenApproval = async () => {
		if ($contracts.baseToken && $contracts.LPRescue) {
			;[baseTokenApproved, baseTokenAllowance] = await isTokenApproved(
				$contracts.baseToken,
				$contracts.LPRescue.address
			)
		}
		if ($contracts.mainToken && $contracts.LPRescue) {
			;[mainTokenApproved, mainTokenAllowance] = await isTokenApproved(
				$contracts.mainToken,
				$contracts.LPRescue.address
			)
		}
	}

	$: valid = baseTokenApproved && mainTokenApproved

	$: allowanceStatus = (token: Contract | undefined, allowance: BigNumber | null) => {
		return token && wethAddress && wethAddress !== token.address
			? allowance && allowance.gt(ethers.constants.MaxUint256.div(2))
				? 'sufficient'
				: 'insufficient'
			: 'not needed for native coin'
	}

	onMount(() => {
		getTokenData()
		checkTokenApproval()
		const interval = setInterval(checkTokenApproval, 5000)
		return () => {
			clearInterval(interval)
		}
	})
</script>

<div
	class="col-start-1 row-start-1 w-full card bg-base-200 shadow-lg"
	in:fly={{ x: 500, duration: 500 }}
	out:fly={{ x: -500, duration: 500 }}
>
	<div class="card-body gap-6">
		<h2 class="card-title text-3xl font-comic">Approve Transfer</h2>
		<div>
			In order for the custom LP+Rescue contract to add liquidity, you need to allow it to transfer tokens from your
			wallet to the LP contract. This process is known as "approval". Please click the buttons below if they indicate
			you don't have enough allowance for the transfer.
		</div>

		{#if $signerAddress && chains[$activeChain]}
			<form on:submit|preventDefault class="flex flex-col gap-6">
				<div class="form-control">
					<label class="label" for="approve-base-token">
						<span class="label-text">
							Base Token {baseTokenSymbol && `(${baseTokenSymbol})`}
						</span>

						<span class="label-text-alt">
							Allowance:
							{allowanceStatus($contracts.baseToken, baseTokenAllowance)}
						</span>
					</label>
					<button
						type="button"
						id="approve-base-token"
						class={`btn btn-lg w-full gap-2 ${baseTokenApproved ? '!btn-success opacity-60' : 'btn-info'}`}
						disabled={baseTokenApproved || baseTokenLoading}
					>
						{#if baseTokenApproved}
							<CheckIcon />
						{:else if baseTokenLoading}
							<div class="loader" />
						{/if}
						Approve {baseTokenSymbol}
					</button>
				</div>
				<div class="form-control">
					<label class="label" for="approve-main-token">
						<span class="label-text">
							Your Token {mainTokenSymbol && `(${mainTokenSymbol})`}
						</span>

						<span class="label-text-alt">
							Allowance:
							{allowanceStatus($contracts.mainToken, mainTokenAllowance)}
						</span>
					</label>
					<button
						type="button"
						id="approve-main-token"
						class={`btn btn-lg w-full gap-2 ${mainTokenApproved ? '!btn-success opacity-60' : 'btn-info'}`}
						disabled={mainTokenApproved || mainTokenLoading}
						on:click|preventDefault={() => approveToken($contracts.mainToken, $contracts.LPRescue.address)}
					>
						{#if mainTokenApproved}
							<CheckIcon />
						{:else if mainTokenLoading}
							<div class="loader" />
						{/if}
						Approve {mainTokenSymbol}
					</button>
				</div>
			</form>
			{#if valid}
				<div class="text-center text-success">
					Both tokens can be transferred by the LP+Rescue contract, you can proceed to the next step.
				</div>
			{:else}
				<div class="alert items-center justify-center text-info">
					<ErrorIcon /> Approve both tokens above to continue.
				</div>
			{/if}
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

<style>
	.loader {
		height: 1.2rem;
		width: 1.2rem;
		border-radius: 9999px;
		border-width: 2px;
		animation: spin 2s linear infinite;
		border-top-color: transparent;
		border-left-color: transparent;
		border-bottom-color: hsl(var(--bc) / var(--tw-text-opacity));
		border-right-color: hsl(var(--bc) / var(--tw-text-opacity));
	}
</style>
