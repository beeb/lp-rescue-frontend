import { get } from 'svelte/store'
import { create, enforce, test, skipWhen } from 'vest'
import { ethers } from 'ethers'
import { baseTokenDecimals, mainTokenDecimals } from '$lib/stores/app'
import { contracts } from 'svelte-ethers-store'

export const suite = create('form', (data) => {
	test('baseTokenAmount', 'Amount is required', () => {
		enforce(data.baseTokenAmount).isNotBlank()
	})
	test('baseTokenAmount', 'Amount needs to be a valid positive number', () => {
		enforce(data.baseTokenAmount).condition((val) => {
			const wei = ethers.utils.parseUnits(val, get(baseTokenDecimals))
			return !wei.isNegative() && !wei.isZero()
		})
	})
	skipWhen(suite.get().hasErrors('baseTokenAmount'), () => {
		test('baseTokenAmount', 'Amount needs to be more than current pair balance', async () => {
			if (!get(contracts).baseToken) {
				return
			}
			const balance = await get(contracts).baseToken.balanceOf(get(contracts).pair.address)
			const wei = ethers.utils.parseUnits(data.baseTokenAmount, get(baseTokenDecimals))
			enforce(wei).condition((val) => val.gte(balance))
		})
	})

	test('mainTokenAmount', 'Amount is required', () => {
		enforce(data.mainTokenAmount).isNotBlank()
	})
	test('mainTokenAmount', 'Amount needs to be a valid positive number', () => {
		enforce(data.mainTokenAmount).condition((val) => {
			const wei = ethers.utils.parseUnits(val, get(mainTokenDecimals))
			return !wei.isNegative() && !wei.isZero()
		})
	})
	skipWhen(suite.get().hasErrors('mainTokenAmount'), () => {
		test('mainTokenAmount', 'Amount needs to be more than current pair balance', async () => {
			if (!get(contracts).mainToken) {
				return
			}
			const balance = await get(contracts).mainToken.balanceOf(get(contracts).pair.address)
			const wei = ethers.utils.parseUnits(data.mainTokenAmount, get(mainTokenDecimals))
			enforce(wei).condition((val) => val.gte(balance))
		})
	})
})
