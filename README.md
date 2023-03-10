![LP-Rescue](./logo-readme.svg)

# LP Rescue Frontend

This web application allows to interact with the [LP Rescue Contract](https://github.com/beeb/lp-rescue-contract) to
get Uniswap v2 or Pancakeswap v2 liquidity pools unstuck after they have been exploited by malicious actors. Check the
link above for more details.

## Supported chains and AMMs

At the moment, only **BNB Smart Chain** and **PancakeSwap v2** are supported. If you need it for another chain or DEX, please [open
a new issue](https://github.com/beeb/lp-rescue-frontend/issues/new).

## Developing

Once you've installed dependencies with `npm install`, start a development server:

```bash
npm run dev
```

## Building

To create a production version of this app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.
