import { get } from 'svelte/store'
import { create, enforce, test, warn, skipWhen } from 'vest'
import 'vest/enforce/compounds'
import { BigNumber, ethers } from 'ethers'
import { defaultEvmStores, contracts, signerAddress } from 'svelte-ethers-store'
import { wethAddress, factoryAddress } from '$lib/stores/app'
import ERC20 from '$lib/abi/ERC20.json'
import Factory from '$lib/abi/Factory.json'
import Pair from '$lib/abi/Pair.json'

const erc20Abi = JSON.stringify(ERC20)
const factoryAbi = JSON.stringify(Factory)
const pairAbi = JSON.stringify(Pair)

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
			const weth = get(wethAddress)
			if (!get(contracts).baseToken || !get(signerAddress) || !weth) {
				return
			}
			if (ethers.utils.getAddress(data.baseToken) === weth) {
				return
			}
			const balance: BigNumber = await get(contracts).baseToken.balanceOf(get(signerAddress))
			enforce(balance).condition((val: BigNumber) => val.gt(0))
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
			const weth = get(wethAddress)
			if (!get(contracts).mainToken || !get(signerAddress) || weth) {
				return
			}
			if (ethers.utils.getAddress(data.mainToken) === weth) {
				return
			}
			const balance: BigNumber = await get(contracts).mainToken.balanceOf(get(signerAddress))
			enforce(balance).condition((val: BigNumber) => val.gt(0))
		})
	})

	skipWhen(suite.get().hasErrors('baseToken') || suite.get().hasErrors('mainToken'), () => {
		test('mainToken', "Pair doesn't exist", async () => {
			if (!get(factoryAddress)) {
				return
			}
			await defaultEvmStores.attachContract('factory', get(factoryAddress), factoryAbi)
			const pairAddress: string = await get(contracts).factory.getPair(data.baseToken, data.mainToken)
			enforce(pairAddress).notEquals(ethers.constants.AddressZero)
		})
		test('mainToken', 'Pair is not stuck', async () => {
			if (!get(factoryAddress)) {
				return
			}
			await defaultEvmStores.attachContract('factory', get(factoryAddress), factoryAbi)
			const pairAddress: string = await get(contracts).factory.getPair(data.baseToken, data.mainToken)
			if (pairAddress === ethers.constants.AddressZero) {
				// pair not found, we can't check the reserves
				return
			}
			await defaultEvmStores.attachContract('pair', pairAddress, pairAbi)
			const [reserve0, reserve1]: [BigNumber, BigNumber] = await get(contracts).pair.getReserves()
			enforce([reserve0, reserve1]).anyOf(
				enforce.condition(([res0, res1]: [BigNumber, BigNumber]) => res0.gt(0) && res1.lte(0)),
				enforce.condition(([res0, res1]: [BigNumber, BigNumber]) => res0.lte(0) && res1.gt(0))
			)
		})
	})
})
