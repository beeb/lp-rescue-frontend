<script lang="ts">
	export let step: number = 0
</script>

<ul class="steps steps-horizontal">
	<li class="step transition-all" class:step-secondary={step >= 0}>Preparation</li>
	<li class="step transition-all" class:step-secondary={step >= 1}>Tokens</li>
	<li class="step transition-all" class:step-secondary={step >= 2}>Approve</li>
	<li class="step transition-all" class:step-secondary={step >= 3}>Rescue</li>
</ul>

<style>
	.steps .step:before,
	.steps .step:after {
		@apply transition-colors;
	}
</style>
