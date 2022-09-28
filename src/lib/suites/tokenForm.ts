import { get } from 'svelte/store'
import { create, enforce, test, warn, skipWhen, skip } from 'vest'
import { BigNumber, ethers } from 'ethers'
import { defaultEvmStores, contracts, signerAddress } from 'svelte-ethers-store'
import { baseTokenName } from '$lib/stores/app'
import ERC20 from '$lib/abi/ERC20.json'

const erc20Abi = JSON.stringify(ERC20)

export const suite = create('form', (data) => {
	test('baseToken', 'Base token is required', () => {
		enforce(data.baseToken).isNotEmpty()
	})
	test('baseToken', 'Base token must be a valid EVM address', () => {
		//check with ethers that token is a valid Ethereum address
		enforce(data.baseToken).condition((val) => ethers.utils.isAddress(val))
	})
	skipWhen(suite.get().hasErrors('baseToken'), () => {
		test('baseToken', 'Address is not a valid ERC20 token', async () => {
			await defaultEvmStores.attachContract('baseToken', data.baseToken, erc20Abi)
			await Promise.all([
				get(contracts).baseToken.name(),
				get(contracts).baseToken.symbol(),
				get(contracts).baseToken.decimals()
			])
		})
		test('baseToken', 'Your balance is zero', async () => {
			warn()
			if (!get(contracts).baseToken || !get(signerAddress)) return
			if (get(contracts).LPRescue) {
				try {
					const WETH = await get(contracts).LPRescue.WETH()
					if (ethers.utils.getAddress(data.baseToken) === WETH) return
				} catch {}
			}
			try {
				const balance: BigNumber = await get(contracts).baseToken.balanceOf(get(signerAddress))
				enforce(balance).condition((val: BigNumber) => val.gt(0))
			} catch (err) {
				throw err
			}
		})
	})

	test('mainToken', 'Main token is required', () => {
		enforce(data.mainToken).isNotEmpty()
	})
	test('mainToken', 'Main token must be a valid EVM address', () => {
		//check with ethers that token is a valid Ethereum address
		enforce(data.mainToken).condition((val) => ethers.utils.isAddress(val))
	})
	test('mainToken', 'Both tokens need to be different', () => {
		enforce(data.mainToken).notEquals(data.baseToken)
	})
	skipWhen(suite.get().hasErrors('mainToken'), () => {
		test('mainToken', 'Address is not a valid ERC20 token', async () => {
			await defaultEvmStores.attachContract('mainToken', data.mainToken, erc20Abi)
			await Promise.all([
				get(contracts).mainToken.name(),
				get(contracts).mainToken.symbol(),
				get(contracts).mainToken.decimals()
			])
		})
		test('mainToken', 'Your balance is zero', async () => {
			warn()
			if (!get(contracts).mainToken || !get(signerAddress)) return
			if (get(contracts).LPRescue) {
				try {
					const WETH = await get(contracts).LPRescue.WETH()
					if (ethers.utils.getAddress(data.mainToken) === WETH) return
				} catch {}
			}
			try {
				const balance: BigNumber = await get(contracts).mainToken.balanceOf(get(signerAddress))
				enforce(balance).condition((val: BigNumber) => val.gt(0))
			} catch (err) {
				throw err
			}
		})
	})
})
