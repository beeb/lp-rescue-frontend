<script lang="ts">
	import { fly } from 'svelte/transition'
	import TitleBar from '$lib/components/TitleBar.svelte'
	import Steps from '$lib/components/Steps.svelte'
	import Step0 from '$lib/components/Step0.svelte'
	import Step1 from '$lib/components/Step1.svelte'
	import Step2 from '$lib/components/Step2.svelte'
	import Step3 from '$lib/components/Step3.svelte'
	import { step } from '$lib/stores/app'
	import Github from '$lib/assets/github.svg?component'
	import Notification from '$lib/components/Notification.svelte'
	import Notifications from 'svelte-notifications'
</script>

<Notifications item={Notification}>
	<div class="relative">
		<div class="flex flex-col w-full min-h-screen justify-between items-center gap-10 pb-12">
			<div class="w-full">
				<TitleBar />
			</div>
			<div class="flex-grow w-full flex flex-col justify-center items-center gap-10">
				<div>
					<Steps step={$step} />
				</div>

				<div class="grid grid-cols-1 w-10/12 max-w-2xl">
					{#if $step == 0}
						<Step0 />
					{:else if $step == 1}
						<Step1 />
					{:else if $step == 2}
						<Step2 />
					{:else if $step == 3}
						<Step3 />
					{:else}
						<div in:fly={{ x: 200 }} out:fly={{ x: -200 }}>Not sure how you got here...</div>
					{/if}
				</div>
			</div>
		</div>

		<div class="absolute right-4 bottom-4">
			<a href="https://github.com/beeb/lp-rescue-frontend"><Github width="3rem" /></a>
		</div>
	</div>
</Notifications>
