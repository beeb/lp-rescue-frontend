import { get } from 'svelte/store'
import { create, enforce, test, skipWhen } from 'vest'
import { ethers, BigNumber } from 'ethers'
import { factoryAddress, baseTokenDecimals, mainTokenDecimals } from '$lib/stores/app'
import { defaultEvmStores, contracts } from 'svelte-ethers-store'
import ERC20 from '$lib/abi/ERC20.json'
import Factory from '$lib/abi/Factory.json'
import Pair from '$lib/abi/Pair.json'

const erc20Abi = JSON.stringify(ERC20)
const factoryAbi = JSON.stringify(Factory)
const pairAbi = JSON.stringify(Pair)

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
		test('baseTokenAmount', 'Amount needs to be more than current pair reserve', async () => {
			if (!get(contracts).baseToken || !get(contracts).pair) {
				return
			}
			const [[reserve0, reserve1, _], token0] = await Promise.all([
				get(contracts).pair.getReserves(),
				get(contracts).pair.token0()
			])
			const reserve = token0 === get(contracts).baseToken.address ? reserve0 : reserve1
			const wei = ethers.utils.parseUnits(data.baseTokenAmount, get(baseTokenDecimals))
			enforce(wei).condition((val) => val.gte(reserve))
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
		test('mainTokenAmount', 'Amount needs to be more than current pair reserve', async () => {
			if (!get(contracts).mainToken || !get(contracts).pair) {
				return
			}
			const [[reserve0, reserve1, _], token0] = await Promise.all([
				get(contracts).pair.getReserves(),
				get(contracts).pair.token0()
			])
			const reserve = token0 === get(contracts).mainToken.address ? reserve0 : reserve1
			const wei = ethers.utils.parseUnits(data.mainTokenAmount, get(mainTokenDecimals))
			enforce(wei).condition((val) => val.gte(reserve))
		})
	})
})
