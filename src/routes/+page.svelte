<script>
  import { Stepper } from '@skeletonlabs/skeleton'
  import Step1 from './step1.svelte'
</script>

<div class="max-w-2xl mx-auto p-4">
  <div class="card p-8 rounded-2xl">
    <Stepper>
      <Step1 />
    </Stepper>
  </div>
</div>
