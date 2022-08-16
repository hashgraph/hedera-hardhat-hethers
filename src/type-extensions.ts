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

import type {hethers} from "@hashgraph/hethers";
import {SignerWithAddress} from "./signers";
import {Artifact} from "hardhat/types";

export interface Libraries {
    [libraryName: string]: string;
}

export interface FactoryOptions {
    signer?: hethers.Signer;
    libraries?: Libraries;
}

export interface HederaAccount {
    account?: string;
    address?: string;
    alias?: string;
    privateKey: string;
}

export interface HederaNodeConfig {
    url: string;
    nodeId: string;
}

export interface HederaNetwork {
    accounts: Array<HederaAccount>;
    nodeId?: string;
    consensusNodes?: Array<HederaNodeConfig>;
    mirrorNodeUrl?: string;
    chainId?: number;
}

export interface HederaNetworks {
    [name: string]: HederaNetwork
}

export interface HederaConfig {
    gasLimit: number;
    networks: HederaNetworks;
}

export declare function getContractFactory(
    name: string,
    signerOrOptions?: hethers.Signer | FactoryOptions
): Promise<hethers.ContractFactory>;
export declare function getContractFactory(
    abi: any[],
    bytecode: hethers.utils.BytesLike,
    signer?: hethers.Signer
): Promise<hethers.ContractFactory>;

type HethersT = typeof hethers;

interface HethersTExtended extends HethersT {
    provider: any,

    getSigners(): Promise<SignerWithAddress[]>;

    getSigner(identifier: any): Promise<SignerWithAddress>;

    getContractFactory(
        nameOrAbi: string | any[],
        bytecodeOrFactoryOptions?:
            | (hethers.Signer | FactoryOptions)
            | hethers.utils.BytesLike,
        signer?: hethers.Signer
    ): Promise<hethers.ContractFactory>;

    getContractFactoryFromArtifact(
        artifact: Artifact,
        signerOrOptions?: hethers.Signer | FactoryOptions
    ): Promise<hethers.ContractFactory>;

    getContractAt(
        nameOrAbi: string | any[],
        address: string,
        signer?: hethers.Signer
    ): Promise<hethers.ContractFactory>;

    getContractAtFromArtifact(
        artifact: Artifact,
        address: string,
        signer?: hethers.Signer
    ): Promise<hethers.ContractFactory>;
}

declare module "hardhat/types/runtime" {
    export interface HardhatRuntimeEnvironment {
        hethers: HethersTExtended;
    }
}

declare module "hardhat/types/config" {
    export interface HardhatUserConfig {
        hedera: HederaConfig;
    }

    export interface HardhatConfig {
        hedera: HederaConfig;

        // We need to change the type of `networks`, but TS does not allow overriding of existing properties
        // @ts-ignore
        networks: HederaNetworks;
    }
}