<script lang="ts">
	export let step: number = 0
</script>

<ul class="steps steps-horizontal">
	<li class="step transition-all" class:step-primary={step >= 0}>Preparation</li>
	<li class="step transition-all" class:step-primary={step >= 1}>Tokens</li>
	<li class="step transition-all" class:step-primary={step >= 2}>Authorize</li>
	<li class="step transition-all" class:step-primary={step >= 3}>Rescue</li>
</ul>

<style>
	.steps .step:before,
	.steps .step:after {
		@apply transition-colors;
	}
</style>
