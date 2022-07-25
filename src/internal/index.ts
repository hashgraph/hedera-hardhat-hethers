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
import {extendConfig, extendEnvironment} from "hardhat/config";
import {lazyObject} from "hardhat/plugins";
import {
    getInitialHederaProvider,
    getSigners,
    getSigner,
    getContractAt,
    getContractAtFromArtifact,
    getContractFactory,
    getContractFactoryFromArtifact,
} from "./helpers";
import {HederaHardhatConfig, HederaHardhatRuntimeEnvironment} from "./type-extensions";

extendConfig(
    (config: HederaHardhatConfig) => {
        config.networks = {...config.networks, ...config.hedera!.networks};
    }
);

extendEnvironment((hre: HederaHardhatRuntimeEnvironment) => {
    hre.network.provider = getInitialHederaProvider(hre);

    // @ts-ignore
    hre.hethers = lazyObject(() => {
        const {createProviderProxy} = require("./provider-proxy");

        const providerProxy = createProviderProxy(hre.network.provider);
        hre.network.provider = providerProxy;

        return {
            ...hethers,

            provider: providerProxy,
            getSigners: () => getSigners(hre),
            getSigner: (identifier: any) => getSigner(hre, identifier),
            getContractFactory: getContractFactory.bind(null, hre) as any,
            getContractFactoryFromArtifact: getContractFactoryFromArtifact.bind(null, hre),
            getContractAt: getContractAt.bind(null, hre),
            getContractAtFromArtifact: getContractAtFromArtifact.bind(null, hre),
        };
    });
});
