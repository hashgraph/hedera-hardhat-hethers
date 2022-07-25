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

import {
    HARDHAT_NETWORK_RESET_EVENT,
    HARDHAT_NETWORK_REVERT_SNAPSHOT_EVENT,
} from "hardhat/internal/constants";
import {hethers} from "@hashgraph/hethers";

import {HethersProviderWrapper} from "./hethers-provider-wrapper";
import {createUpdatableTargetProxy} from "./updatable-target-proxy";

/**
 * This method returns a proxy that uses an underlying provider for everything.
 *
 * This underlying provider is replaced by a new one after a successful hardhat_reset,
 * because hethers providers can have internal state that returns wrong results after
 * the network is reset.
 */
export function createProviderProxy(
    hardhatProvider: hethers.providers.BaseProvider
): any {
    const initialProvider = new HethersProviderWrapper(hardhatProvider);
    const {proxy: providerProxy, setTarget} = createUpdatableTargetProxy(initialProvider);

    hardhatProvider.on(HARDHAT_NETWORK_RESET_EVENT, () => {
        setTarget(new HethersProviderWrapper(hardhatProvider));
    });
    hardhatProvider.on(HARDHAT_NETWORK_REVERT_SNAPSHOT_EVENT, () => {
        setTarget(new HethersProviderWrapper(hardhatProvider));
    });

    return providerProxy;
}
