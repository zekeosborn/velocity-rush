import '@nomicfoundation/hardhat-toolbox-viem';
import 'dotenv/config';
import type { HardhatUserConfig } from 'hardhat/config';

const privateKey = process.env.PRIVATE_KEY;
const monadRpcUrl = process.env.MONAD_RPC_URL ?? 'https://testnet-rpc.monad.xyz';

const hardhatConfig: HardhatUserConfig = {
  solidity: '0.8.28',
  networks: {
    monad: {
      url: monadRpcUrl,
      accounts: privateKey ? [privateKey] : [],
    },
  },
  sourcify: {
    enabled: true,
    apiUrl: 'https://sourcify-api-monad.blockvision.org',
    browserUrl: 'https://testnet.monadexplorer.com',
  },
  etherscan: {
    enabled: false,
  },
};

export default hardhatConfig;
