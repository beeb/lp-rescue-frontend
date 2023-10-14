<script>
  import { Step } from '@skeletonlabs/skeleton'
  import LinkIcon from 'virtual:icons/mingcute/external-link-line'
</script>

<Step>
  <svelte:fragment slot="header"><h2 class="h2">Before we begin...</h2></svelte:fragment>
  <div>
    <h3 class="h3">What is LP+Rescue?</h3>
    <p>
      <strong>LP+Rescue</strong> is a tool you can use when a Liquidity Pool (LP) has been created on an AMM (Uniswap
      v2, Pancakeswap) but no liquidity can be added to it. Most commonly, some malicious actor makes the contract
      "stuck" by adding a tiny amount of one of the tokens (usually WETH or WBNB) and calls the
      <code class="code">sync</code>
      function of the smart contract. This leads to one of the
      <code class="code">reserve</code>s of the pair to be non-zero, which is not supported by the AMM's Router for
      adding liquidity.<br />
      Here is an
      <a href="https://github.com/beeb/lp-rescue-contract" target="_blank" class="anchor" rel="noreferrer">
        in-depth explanation
      </a>
      <LinkIcon class="inline opacity-60" />.
    </p>
  </div>
  <div>
    This tool replaces the AMM Router and allows to re-establish the correct balances and reserves in a single
    transaction, which effectively makes the LP "unstuck". For this, it uses a <a
      href="https://github.com/beeb/lp-rescue-contract/blob/main/src/LPRescue.sol"
      target="_blank"
      class="anchor"
      rel="noreferrer"
    >
      custom contract
    </a>
    <LinkIcon class="inline opacity-60" />.
  </div>
  <div>First off, your wallet needs to be connected and on the right network.</div>
</Step>
