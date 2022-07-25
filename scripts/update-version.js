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

const {exec} = require('child_process');
const {getLatestRelease} = require('./helpers');

(async function() {
    let latestRelease = await getLatestRelease();
    if (latestRelease && latestRelease.prerelease) {
        let name = latestRelease.name.toLowerCase();

        let versionType = 'patch';

        if (name.includes('minor')) {
            versionType = 'minor';
        }
        else if (name.includes('major')) {
            versionType = 'major';
        }

        try {
            await exec(`npm version ${versionType} --no-git-tag-version`);
        }
        catch(err) {
            console.error(err);
        }
    }
})();