import { get } from 'svelte/store'
import { create, enforce, test, warn, skipWhen, skip } from 'vest'
import { BigNumber, ethers } from 'ethers'
import { defaultEvmStores, contracts, signerAddress } from 'svelte-ethers-store'

const erc20Abi =
	'["function name() view returns (string)","function symbol() view returns (string)","function decimals() view returns (uint8)","function balanceOf(address) view returns (uint256)"]'

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
			try {
				defaultEvmStores.attachContract('baseToken', data.baseToken, erc20Abi)
				await get(contracts).baseToken.name()
				await get(contracts).baseToken.symbol()
				await get(contracts).baseToken.decimals()
			} catch (err) {
				console.error(err)
				throw err
			}
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
				console.error(err)
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
			try {
				defaultEvmStores.attachContract('mainToken', data.mainToken, erc20Abi)
				await get(contracts).mainToken.name()
				await get(contracts).mainToken.symbol()
				await get(contracts).mainToken.decimals()
			} catch (err) {
				throw err
			}
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
				console.error(err)
				throw err
			}
		})
	})
})
