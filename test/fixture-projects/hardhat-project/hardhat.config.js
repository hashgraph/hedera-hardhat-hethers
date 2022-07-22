require("../../../src/internal");
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../../.env')});

module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "local",
  hedera: {
    gasLimit: 300000,
    networks: {
      testnet: {
        chainId: 291,
        accounts: [
          {
            "account": process.env['TESTNET_ACCOUNT_ID_1'],
            "privateKey": process.env['TESTNET_PRIVATEKEY_1']
          },
          {
            "account": process.env['TESTNET_ACCOUNT_ID_2'],
            "privateKey": process.env['TESTNET_PRIVATEKEY_2']
          }
        ]
      },
      previewnet: {
        chainId: 292,
        accounts: [
          {
            "account": process.env['PREVIEWNET_ACCOUNT_ID_1'],
            "privateKey": process.env['PREVIEWNET_PRIVATEKEY_1']
          },
          {
            "account": process.env['PREVIEWNET_ACCOUNT_ID_2'],
            "privateKey": process.env['PREVIEWNET_PRIVATEKEY_2']
          }
        ]
      },
      local: {
        chainId: 298,
        accounts: [
          {
            "account": '0.0.1002',
            "privateKey": '0x7f109a9e3b0d8ecfba9cc23a3614433ce0fa7ddcc80f2a8f10b222179a5a80d6'
          },
          {
            "account": '0.0.1003',
            "privateKey": '0x6ec1f2e7d126a74a1d2ff9e1c5d90b92378c725e506651ff8bb8616a5c724628'
          }
        ]
      }
    }
  },
};