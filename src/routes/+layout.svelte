<script>
  import '../app.postcss'
  import { AppBar, AppShell, LightSwitch } from '@skeletonlabs/skeleton'
  import Logo from '$lib/assets/logo-halftone.svg?component'
  import Github from '$lib/assets/github.svg?component'
  import Wallet from './wallet.svelte'
</script>

<AppShell regionPage="relative" slotPageHeader="sticky top-0 z-10" slotFooter="m-4 flex justify-end">
  <svelte:fragment slot="header">
    <AppBar background="bg-transparent container mx-auto">
      <svelte:fragment slot="lead">
        <a href="/" title="Home page"><Logo class="h-10 md:h-20" /></a>
      </svelte:fragment>
      <svelte:fragment slot="trail">
        <LightSwitch />
        <Wallet />
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>
  <slot />
  <svelte:fragment slot="footer">
    <a
      href="https://github.com/beeb/lp-rescue-frontend"
      title="Visit the project's page on GitHub"
      class="opacity-50 hover:opacity-100"
    >
      <Github width="3rem" />
    </a>
  </svelte:fragment>
</AppShell>
