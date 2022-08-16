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

import 'mocha';
import {assert} from 'chai';
import {HethersProviderWrapper} from '../src/hethers-provider-wrapper';
import {hethers} from '@hashgraph/hethers';
import {useEnvironment} from './helpers';
import path from 'path';
import dotenv from "dotenv";
dotenv.config({path: path.resolve(__dirname, '../.env')});

const test_on = process.env['RUN_TEST_ON'];
// @ts-ignore
const activeNetwork = test_on.toLowerCase();


describe('Hethers provider wrapper', function () {
    let realProvider: hethers.providers.BaseProvider;
    let wrapperProvider: HethersProviderWrapper;

    useEnvironment('hardhat-project', activeNetwork);

    beforeEach(function () {
        realProvider = new hethers.providers.BaseProvider(activeNetwork);
        wrapperProvider = new HethersProviderWrapper(this.env.network.provider);
    });

    it('Should return the same as the real provider', async function () {
        const accountId = this.env?.config?.networks[activeNetwork]?.accounts[1]?.account;

        // @ts-ignore
        const realProviderResponse = (await realProvider.getBalance(accountId)).toString();
        // @ts-ignore
        const wrapperProviderResponse = (await wrapperProvider.getBalance(accountId)).toString();

        assert.deepEqual(realProviderResponse, wrapperProviderResponse);
    });

    it('Should return the same error', async function () {
        try {
            await realProvider.getCode('error_please');
            assert.fail('realProvider should have failed');
        } catch (_err) {
            const err = _err as Error;
            try {
                await wrapperProvider.getCode('error_please');
                assert.fail('wrapperProvider should have failed');
            } catch (_err2) {
                const err2 = _err2 as Error;
                assert.deepEqual(err2.message, err.message);
            }
        }
    });
});
