<script lang="ts">
	import '../app.css'
</script>

<slot />

<svelte:head>
	<title>LP+Rescue - add liquidity to stuck pairs</title>
	<meta
		name="description"
		content="LP+Rescue allows to add liquidity to a Uniswap or PancakeSwap pair which was exploited by sending some tokens and calling the sync function, effectively setting one of the reserves to a non-zero value."
	/>
</svelte:head>
