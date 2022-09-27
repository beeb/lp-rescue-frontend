![LP-Rescue](./src/lib/assets/logo-halftone.svg)

# LP Rescue Frontend

This web application allows to interact with the [LP Rescue Contract](https://github.com/beeb/lp-rescue-contract) to
get Uniswap v2 or Pancakeswap v2 liquidity pools unstuck after they have been exploited by malicious actors. Check the
link above for more details.

## Developing

Once you've installed dependencies with `pnpm install`, start a development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of this app:

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.
