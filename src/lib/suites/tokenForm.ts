import { create, enforce, test } from 'vest'
import { ethers } from 'ethers'

export const suite = create('form', (data) => {
	test('baseToken', 'Base token is required', () => {
		enforce(data.baseToken).isNotEmpty()
	})
	test('baseToken', 'Base token must be a valid EVM address', () => {
		//check with ethers that data.baseToken is a valid Ethereum address
		enforce(data.baseToken).condition((val) => ethers.utils.isAddress(val))
	})
})
