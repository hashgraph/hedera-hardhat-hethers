/*-
 * ‌
 * Hedera Hardhat Hethers
 * ​
 * Copyright (C) 2022 - 2023 Hedera Hashgraph, LLC
 * ​
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ‍
 */

require("../../../src");
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