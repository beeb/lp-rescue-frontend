<script lang="ts">
	import { fly } from 'svelte/transition'
</script>

<div
	class="col-start-1 row-start-1 w-full card bg-base-200 shadow-lg"
	in:fly={{ x: 500, duration: 500 }}
	out:fly={{ x: -500, duration: 500 }}
>
	<div class="card-body">
		<h2 class="card-title text-3xl mb-4">Before we begin...</h2>
		<p class="mb-4">Step 0</p>
	</div>
</div>
