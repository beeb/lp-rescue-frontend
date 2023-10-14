import type { Address } from '@wagmi/core'

export function jsNumberForAddress(address: Address) {
	return parseInt(address.slice(2, 10), 16)
}

// ellipsis the middle of the address
export function displayAddress(address: Address) {
	const start = address.slice(0, 6)
	const end = address.slice(-4)
	return `${start}...${end}`
}
