<script lang="ts">
	import { onMount } from 'svelte'
	import { ethers } from 'ethers'
	import { signerAddress, defaultEvmStores } from 'svelte-ethers-store'
	import Web3Modal from 'web3modal'
	import WalletConnectProvider from '@walletconnect/web3-provider/dist/umd/index.min.js'

	let web3Modal: Web3Modal | undefined

	// TODO: get URL from network select dropdown
	const defaultProvider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org')

	const connect = async () => {
		const modalProvider = await web3Modal?.connect()
		await defaultEvmStores.setProvider(modalProvider)
	}

	const disconnect = async () => {
		if (web3Modal?.cachedProvider) {
			web3Modal?.clearCachedProvider()
		}
		await defaultEvmStores.disconnect()
		await defaultEvmStores.setProvider(defaultProvider)
	}

	onMount(async () => {
		web3Modal = new Web3Modal({
			cacheProvider: true,
			theme: 'dark',
			providerOptions: {
				walletconnect: {
					package: WalletConnectProvider,
					options: {
						rpc: {
							56: 'https://bsc-dataseed.binance.org/'
						}
					}
				}
			}
		})

		if (web3Modal.cachedProvider) {
			await connect()
		}
	})
</script>

<h1 class="text-3xl mb-3">Welcome to Web3</h1>
<p class="mb-3">{$signerAddress}</p>
<p>
	{#if $signerAddress}
		<button type="button" class="btn" on:click={() => disconnect()}>Disconnect</button>
	{:else}
		<button type="button" class="btn" on:click={() => connect()}>Connect</button>
	{/if}
</p>
