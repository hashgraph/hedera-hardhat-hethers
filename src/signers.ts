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
import {Deferrable} from "@ethersproject/properties";
import {TransactionRequest} from "@hethers/abstract-provider";
import {NomicLabsHardhatPluginError} from "hardhat/plugins";

const pluginName = "hardhat-hethers";

export class SignerWithAddress extends hethers.Wallet {
    // @ts-ignore
    address: string;

    private static populateDefaultGasLimit(tx: TransactionRequest): TransactionRequest {
        // do not force add gasLimit, if the user wants to execute a simple crypto transfer
        if (tx.to && tx.value && Object.keys(tx).length == 2) {
            return tx;
        }

        if (!tx.gasLimit) {
            const env = require('hardhat');
            if (!env.config.hedera.gasLimit) {
                throw new NomicLabsHardhatPluginError(
                    pluginName,
                    `No default gas limit found. Please specify a default 'gasLimit' value in your hardhat.config.js: > config > hedera > gasLimit`
                );
            }

            tx.gasLimit = env.config.hedera.gasLimit;
        }
        return tx;
    }

    public static async create(signer: hethers.Wallet) {
        // @ts-ignore
        let signerWithAddress = await new SignerWithAddress(signer._signingKey(), signer);
        // @ts-ignore
        signerWithAddress.address = signer.address;
        return signerWithAddress;
    }

    constructor(
        public readonly identity: HederaAccount,
        private readonly _signer: hethers.Signer
    ) {
        // @ts-ignore
        super(identity, _signer.provider);
    }

    public async getAddress(): Promise<string> {
        return this._signer.getAddress();
    }

    public signMessage(message: string | hethers.utils.Bytes): Promise<string> {
        return this._signer.signMessage(message);
    }

    public signTransaction(transaction: hethers.providers.TransactionRequest): Promise<string> {
        transaction = SignerWithAddress.populateDefaultGasLimit(transaction);
        return this._signer.signTransaction(transaction);
    }

    public sendTransaction(transaction: hethers.providers.TransactionRequest): Promise<hethers.providers.TransactionResponse> {
        transaction = SignerWithAddress.populateDefaultGasLimit(transaction);
        return this._signer.sendTransaction(transaction);
    }

    // @ts-ignore
    public connect(provider: hethers.providers.BaseProvider): SignerWithAddress {
        // @ts-ignore
        return new SignerWithAddress(this.identity, this._signer.connect(provider));
    }

    public createAccount(pubKey: hethers.utils.BytesLike, initialBalance?: BigInt): Promise<hethers.providers.TransactionResponse> {
        return this._signer.createAccount(pubKey, initialBalance);
    }

    public toJSON() {
        return `<SignerWithAddress ${this._signer.getAddress()}>`;
    }

    public async call(txRequest: Deferrable<TransactionRequest>): Promise<string> {
        txRequest = SignerWithAddress.populateDefaultGasLimit(<TransactionRequest>txRequest);
        if (!txRequest.to) {
            throw new NomicLabsHardhatPluginError(
                pluginName,
                `The transaction is missing a required field: 'to'`
            );
        }
        return this._signer.call(txRequest);
    }
}
