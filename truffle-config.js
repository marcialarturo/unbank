const HDWalletProvider = require('@truffle/hdwallet-provider')
const mnemonic =
  'jacket various blame hero aunt involve hard goat reveal jaguar trumpet away'
require('babel-register')
require('babel-polyfill')
require('dotenv').config()

// const privateKeys = process.env.PRIVATE_KEYS || ''

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*', // Match any network id
    },
    // truffle migrate --network rinkeby
    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://rinkeby.infura.io/v3/59cc4bc5ba0b41128f916b97f539aa4c`,
        ),
      network_id: 4,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: '>=0.6.0 <0.8.0',
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
}
