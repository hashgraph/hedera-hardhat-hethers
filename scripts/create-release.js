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

const { exec } = require("child_process");
const { getLatestRelease, deleteRelease, createRelease } = require("./helpers");

const sleep = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

(async () => {
  let latestRelease = await getLatestRelease();
  if (latestRelease && latestRelease.prerelease) {
    if (latestRelease && latestRelease.prerelease) {
      await deleteRelease(latestRelease.id.toString());

      const { tag_name } = latestRelease;

      // Delete the tag:
      await exec(`git push --delete origin ${tag_name}`);

      // Recreate the tag:
      await exec(`git tag ${tag_name}`);
      await exec(`git push origin --tags`);
    }

    latestRelease.name = latestRelease.name
      .replace("minor", "")
      .replace("major", "")
      .trim();

    await sleep(5000);
    await createRelease(latestRelease);

  }
})();