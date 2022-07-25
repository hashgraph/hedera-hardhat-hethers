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

import {hethers} from "@hashgraph/hethers";
import {HederaAccount} from "./type-extensions";

export class HethersProviderWrapper extends hethers.providers.BaseProvider {
    private readonly _hardhatProvider: hethers.providers.BaseProvider;

    constructor(hardhatProvider: hethers.providers.BaseProvider) {
        let networkConfig: { [url: string]: string } = {};
        hardhatProvider.getHederaClient()._network._network.forEach((obj: any) => {
            const address = obj[0]._address;
            let addrString = address._address;
            if (address._port) addrString = `${addrString}:${address._port}`;
            networkConfig[addrString] = obj[0]._accountId.toString();
        });

        super({
            network: networkConfig,
            // @ts-ignore
            mirrorNodeUrl: hardhatProvider._mirrorNodeUrl
        });
        this._network.chainId = hardhatProvider._network.chainId;

        this._hardhatProvider = hardhatProvider;
    }

    public getSigner(identifier: HederaAccount): hethers.Wallet {
        // @ts-ignore
        return new hethers.Wallet(identifier, this._hardhatProvider);
    }

    public listAccounts(): any {
        const hre = require('hardhat');
        return hre.config.networks[this._hardhatProvider._network.name]?.accounts || [];
    }
}
