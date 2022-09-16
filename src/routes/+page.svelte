<script lang="ts">
	import { signerAddress, chainId } from 'svelte-ethers-store'
	import TitleBar from '$lib/components/TitleBar.svelte'
</script>

<TitleBar />

<div class="flex flex-col w-full min-h-screen justify-center items-center gap-10">
	<div>
		<h1 class="text-6xl mb-3">LP+Rescue</h1>
	</div>
	<div class="card w-10/12 max-w-xl bg-base-200 shadow-lg">
		<div class="card-body">
			<h2 class="card-title text-3xl mb-4">Card title!</h2>
			<p>If a dog chews shoes whose shoes does he choose?</p>
			<div class="card-actions justify-end">
				<button class="btn btn-lg btn-primary">Action</button>
			</div>
		</div>
	</div>
</div>
