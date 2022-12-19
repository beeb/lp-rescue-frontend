![LP-Rescue](./logo-readme.svg)

# LP Rescue Frontend

This web application allows to interact with the [LP Rescue Contract](https://github.com/beeb/lp-rescue-contract) to
get Uniswap v2 or Pancakeswap v2 liquidity pools unstuck after they have been exploited by malicious actors. Check the
link above for more details.

## Supported chains and AMMs

At the moment, only **BNB Smart Chain** and **PancakeSwap v2** are supported. If you need it for another chain or DEX, please [open
a new issue](https://github.com/beeb/lp-rescue-frontend/issues/new).

## Developing

**NOTE**: currently, using `pnpm run dev` doesn't work due to an indirect dependency to `rxjs` from `@web3-onboard`.
Use `npm install` and `npm run dev` for the moment.

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
