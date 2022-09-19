<script>
	import { fly } from 'svelte/transition'
	import CrossIcon from 'virtual:icons/ri/add-circle-line'
</script>

<div
	class="col-start-1 row-start-1 w-full card bg-base-200 shadow-lg"
	in:fly={{ x: 500, duration: 500 }}
	out:fly={{ x: -500, duration: 500 }}
>
	<div class="card-body">
		<h2 class="card-title text-3xl mb-4">Add Liquidity</h2>
		<p class="mb-4">Step 3</p>
		<div class="card-actions justify-end">
			<button class="btn btn-lg btn-primary gap-2"><CrossIcon /> Rescue LP</button>
		</div>
	</div>
</div>
