<script lang="ts">
	import type { DefaultNotificationOptions } from 'svelte-notifications'

	export let notification: DefaultNotificationOptions = {
		text: '',
		position: 'bottom-left'
	}

	export let onRemove: (() => void) | null = null
</script>

<div
	class="toast flex max-w-[90%] min-w-0"
	class:toast-start={notification.position === 'top-left' || notification.position === 'bottom-left'}
	class:toast-center={notification.position === 'top-center' || notification.position === 'bottom-center'}
	class:toast-end={notification.position === 'top-right' || notification.position == 'bottom-right'}
	class:toast-top={notification.position === 'top-left' || notification.position === 'top-right'}
	class:toast-bottom={notification.position === 'bottom-left' || notification.position == 'bottom-right'}
>
	<div
		class="alert flex-grow items-start"
		class:alert-error={notification.type === 'error'}
		class:alert-success={notification.type === 'success'}
		class:alert-warning={notification.type === 'warning'}
		class:alert-info={notification.type === 'info'}
	>
		<div class="overflow-hidden max-w-full">
			<span>{@html notification.text}</span>
		</div>
		<div class="flex-none">
			<button
				type="button"
				class="btn btn-sm btn-square btn-ghost"
				on:click={() => {
					onRemove && onRemove()
				}}>✕</button
			>
		</div>
	</div>
</div>
