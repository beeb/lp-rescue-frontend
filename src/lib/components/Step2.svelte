<script lang="ts">
	import { onMount } from 'svelte'
	import { fly } from 'svelte/transition'
	import { step, activeChain, isTokenApproved } from '$lib/stores/app'
	import { chains } from '$lib/constants'
	import { defaultEvmStores, contracts, signerAddress } from 'svelte-ethers-store'
	import { ethers, type Contract } from 'ethers'
	import ArrowRightIcon from 'virtual:icons/ri/arrow-right-s-line'
	import ArrowLeftIcon from 'virtual:icons/ri/arrow-left-s-line'
	import CheckIcon from 'virtual:icons/ri/check-line'
	import ErrorIcon from 'virtual:icons/ri/error-warning-line'
	import ERC20 from '$lib/abi/ERC20.json'

	const erc20Abi = JSON.stringify(ERC20)

	let inTransition = false
	let baseTokenApproved = false
	let mainTokenApproved = false
	let valid = false

	const approveToken = async (token: Contract | undefined, spender: string) => {
		if (!token) {
			return false
		}
		try {
			const tx = await token.approve(spender, ethers.constants.MaxUint256)
			const receipt = await tx.wait()
			return receipt.status === 1
		} catch (e) {
			console.error(e)
			return false
		} finally {
			const tokenName = token.address === $contracts.baseToken?.address ? 'baseToken' : 'mainToken'
			defaultEvmStores.attachContract(tokenName, token.address, erc20Abi) // trigger reactivity
		}
	}

	const checkTokenApproval = async () => {
		if ($contracts.baseToken && $contracts.LPRescue) {
			baseTokenApproved = await isTokenApproved($contracts.baseToken, $contracts.LPRescue.address)
		}
		if ($contracts.mainToken && $contracts.LPRescue) {
			mainTokenApproved = await isTokenApproved($contracts.mainToken, $contracts.LPRescue.address)
		}
		valid = baseTokenApproved && mainTokenApproved
	}

	onMount(() => {
		checkTokenApproval()
		const interval = setInterval(checkTokenApproval, 1000)
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
		<h2 class="card-title text-3xl">Approve Transfer</h2>
		<div>
			In order for the custom LP+Rescue contract to add liquidity, you need to allow it to transfer tokens from your
			wallet to the LP contract. This process is known as "approval". Please click the buttons below if they indicate
			you don't have enough allowance for the transfer.
		</div>

		{#if $signerAddress && chains[$activeChain] && $contracts.baseToken && $contracts.mainToken && $contracts.LPRescue}
			<form on:submit|preventDefault class="flex flex-col gap-6">
				<div class="form-control">
					{#await $contracts.baseToken.symbol() then symbol}
						<label class="label" for="approve-base-token">
							<span class="label-text">
								Base Token ({symbol})
							</span>

							<span class="label-text-alt">
								Allowance:
								{#await $contracts.LPRescue.WETH() then WETH}
									{#if WETH !== $contracts.baseToken.address}
										{#await $contracts.baseToken.allowance($signerAddress, $contracts.LPRescue.address) then allowance}
											{#await $contracts.baseToken.decimals() then decimals}
												{ethers.utils.formatUnits(allowance, decimals)}
											{/await}
										{/await}
									{:else}
										not needed for native coin
									{/if}
								{/await}
							</span>
						</label>
						<button
							type="button"
							id="approve-base-token"
							class={`btn btn-lg w-full ${baseTokenApproved ? '!btn-success opacity-60' : 'btn-info'}`}
							disabled={baseTokenApproved}
						>
							{#if baseTokenApproved}
								<CheckIcon />
							{/if}
							Approve {symbol}
						</button>
					{/await}
				</div>
				<div class="form-control">
					{#await $contracts.mainToken.symbol() then symbol}
						<label class="label" for="approve-main-token">
							<span class="label-text">
								Your Token ({symbol})
							</span>

							<span class="label-text-alt">
								Allowance:
								{#await $contracts.LPRescue.WETH() then WETH}
									{#if WETH !== $contracts.mainToken.address}
										{#await $contracts.mainToken.allowance($signerAddress, $contracts.LPRescue.address) then allowance}
											{allowance.gt(ethers.constants.MaxUint256.div(2)) ? 'sufficient' : 'insufficient'}
										{/await}
									{:else}
										not needed for native coin
									{/if}
								{/await}
							</span>
						</label>
						<button
							type="button"
							id="approve-main-token"
							class={`btn btn-lg w-full ${mainTokenApproved ? '!btn-success opacity-60' : 'btn-info'}`}
							disabled={mainTokenApproved}
							on:click|preventDefault={() => approveToken($contracts.mainToken, $contracts.LPRescue.address)}
						>
							{#if mainTokenApproved}
								<CheckIcon />
							{/if}
							Approve {symbol}
						</button>
					{/await}
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
