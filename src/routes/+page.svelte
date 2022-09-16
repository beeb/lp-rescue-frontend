<script lang="ts">
	import TitleBar from '$lib/components/TitleBar.svelte'
	import CrossIcon from 'virtual:icons/ri/add-circle-line'
</script>

<TitleBar />

<div class="flex flex-col w-full min-h-screen justify-center items-center gap-10">
	<div>
		<h1 class="text-6xl mb-3">LP+Rescue</h1>
	</div>
	<div class="card w-10/12 max-w-xl bg-base-200 shadow-lg">
		<div class="card-body">
			<h2 class="card-title text-3xl mb-4">Card title!</h2>
			<p class="mb-4">If a dog chews shoes whose shoes does he choose?</p>
			<div class="card-actions justify-end">
				<button class="btn btn-lg btn-primary gap-2"><CrossIcon /> Rescue LP</button>
			</div>
		</div>
	</div>
</div>
