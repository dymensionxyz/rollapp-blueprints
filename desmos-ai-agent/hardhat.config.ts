import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@openzeppelin/hardhat-upgrades';

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts:{
        mnemonic: "depend version wrestle document episode celery nuclear main penalty hundred trap scale candy donate search glory build valve round athlete become beauty indicate hamster",
      }
    },
    testnet: {
      url: "https://json-rpc.ra-2.rollapp.network",
      accounts:{
        mnemonic: "",
      }
    },
    mainnet: {
      url: "https://json-rpc.desmosai.evm.ra.mn.rollapp.network",
      accounts:{
        mnemonic: "",
      }
    },
  },
};

export default config;