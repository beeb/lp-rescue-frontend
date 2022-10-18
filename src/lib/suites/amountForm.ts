import { get } from 'svelte/store'
import { create, enforce, test, skipWhen } from 'vest'
import 'vest/enforce/compounds'
import { ethers, BigNumber } from 'ethers'
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
		test('mainTokenAmount', 'Pair is not stuck', async () => {
			if (!get(contracts).pair) {
				return
			}
			const [reserve0, reserve1]: [BigNumber, BigNumber] = await get(contracts).pair.getReserves()
			enforce([reserve0, reserve1]).anyOf(
				enforce.condition(([res0, res1]: [BigNumber, BigNumber]) => res0.gt(0) && res1.lte(0)),
				enforce.condition(([res0, res1]: [BigNumber, BigNumber]) => res0.lte(0) && res1.gt(0))
			)
		})
	})
})
