import { ethers } from 'ethers'
import { default as Onboard } from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets'
import walletConnectModule from '@web3-onboard/walletconnect'
import { PUBLIC_DEFAULT_CHAIN } from '$env/static/public'

export const chains: Record<number, any> = {
	56: {
		id: '0x38',
		token: 'BNB',
		label: 'BNB Smart Chain',
		rpcUrl: 'https://bsc-dataseed.binance.org',
		blockExplorerUrl: 'https://bscscan.com'
	},
	97: {
		id: '0x61',
		token: 'tBNB',
		label: 'BSC Testnet',
		rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
		blockExplorerUrl: 'https://testnet.bscscan.com'
	}
}

export type SupportedChain = keyof typeof chains

export const chainData: Record<number, ChainData> = {
	56: {
		commonTokens: {
			WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
			BUSD: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
			USDT: '0x55d398326f99059fF775485246999027B3197955',
			USDC: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
			WETH: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8'
		},
		amm: {
			pcs: {
				name: 'PancakeSwap',
				routerAddress: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
				rescueAddress: '0xbaB1e26127D601407A1E29F55C848BCAB33f6258'
			}
		}
	},
	97: {
		commonTokens: {
			WBNB: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
			BUSD: '0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7',
			USDT: '0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684',
			DAI: '0x8a9424745056Eb399FD19a0EC26A14316684e274',
			WETH: '0x8babbb98678facc7342735486c851abd7a0d17ca'
		},
		amm: {
			pcs: {
				name: 'TPancakeSwap',
				routerAddress: '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3',
				rescueAddress: '0xE1284f70baeB5BD24344cB7c5ad66c023F831f04'
			}
		}
	}
}

type AllChainData = typeof chainData
export type SupportedAmm = keyof AllChainData[keyof AllChainData]['amm']

export const defaultChain: SupportedChain = parseInt(PUBLIC_DEFAULT_CHAIN || '56') as SupportedChain

export const defaultProvider = new ethers.providers.JsonRpcProvider(
	chains[defaultChain].rpcUrl || 'https://bsc-dataseed.binance.org'
)

const injected = injectedModule()
const walletConnect = walletConnectModule({
	qrcodeModalOptions: {
		mobileLinks: ['rainbow', 'metamask', 'argent', 'trust', 'imtoken', 'pillar']
	},
	connectFirstChainId: true
})

export const onboard = Onboard({
	wallets: [injected, walletConnect],
	chains: Object.values(chains),
	connect: {
		showSidebar: false
	},
	accountCenter: {
		desktop: {
			enabled: false
		},
		mobile: {
			enabled: false
		}
	},
	theme: 'dark'
})
