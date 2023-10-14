<script lang="ts">
  import { watchAccount, disconnect, getAccount } from '@wagmi/core'
  import { modal, isConnected, userAddress } from '$lib/wallet'
  import { onMount } from 'svelte'
  import jazzicon from '@metamask/jazzicon'
  import { displayAddress, jsNumberForAddress } from '$lib/helpers'

  let jazziconContainer: HTMLSpanElement | undefined = undefined
  $: buttonText = $isConnected ? 'Disconnect' : 'Connect'
  $: {
    if ($userAddress) {
      if (jazziconContainer) {
        jazziconContainer.innerHTML = ''
        jazziconContainer.appendChild(jazzicon(20, jsNumberForAddress($userAddress)))
      }
    }
  }

  async function connect() {
    if (getAccount().isConnected) {
      await disconnect()
    } else {
      await $modal.open()
    }
  }

  async function showAccount() {
    await $modal.open({ view: 'Account' })
  }

  onMount(() => {
    watchAccount((account) => {
      $userAddress = account.address
      $isConnected = account.isConnected
    })
  })
</script>

<button type="button" class="btn variant-filled" on:click={connect}>{buttonText}</button>
{#if $userAddress}
  <w3m-network-button />
  <button type="button" class="btn variant-filled" on:click={showAccount}>
    <span class="inline-flex" bind:this={jazziconContainer} />
    <span>{displayAddress($userAddress)}</span>
  </button>
{/if}
