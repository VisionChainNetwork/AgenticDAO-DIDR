import * as dotenv from 'dotenv'

import { HardhatUserConfig, task } from 'hardhat/config'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-gas-reporter'
import 'solidity-coverage'

dotenv.config()

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.28',
        settings: {
          evmVersion: "paris",
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      }
    ],
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || '',
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    geth: {
      url: "http://localhost:40000",
      accounts: [
        /*p0*/  "b03ddbc95b42380ce8c1dee760d14bd84881750a50817b33852791b0d1b30ccf",
        /*p1*/  "5ed0082260a7b93b804b04f6b486b367c9c914401916a634788b5585304e622b",
        /*p2*/  "45477be52c19e1e4104c09e1977017f1415d5d0d8db3b16e7bbb70e2c541fcb4",
        /*p3*/  "77e127fdab7e566fb99c4a09684f3fb679ce4a567ea7ab9a44405169c548caff",
        /*p4*/  "8b9905b8aff790e75e9a6e970bf057a93fd4d776b6cff4190196fc736d6ce7be",
        /*p5*/  "235ba8bf2ca82ae86f63cf420fe72cdb9e7b897c5bf9b69b5d85a922c11ba428",
        /*p6*/  "f0b05c93d5a7d86fff6bdb69bc972ef93c553d80f0ad5361fd8aadfe86db6c6f",
        /*p7*/  "c8608407a51689e853559a404c24b7fd515777d5fa3097b492045b7c78619c33",
        /*p8*/  "d40b79d9920bc0811694e584bf52b9d37be92947f977371b22351c064ab94f25",
        /*p9*/  "083ce9142d78e0d20737c70c1b58758ef390b4fefb49459199c49ba556075214",
        // /*p10*/ "b81ddaee535279b6a86f5711f87b3691a46f693f433fce2ec8e9868bdc57d3ca"
      ]
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
}

export default config
