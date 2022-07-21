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

const axios = require("axios");
const githubRepo = "LimeChain/hardhat-hethers";

async function getLatestRelease() {
  const res = await axios.get(`https://api.github.com/repos/${githubRepo}/releases`, {
    headers: { "authorization": `Bearer ${process.env.GITHUB_TOKEN}` }
  });

  return res.data[0];
}

async function deleteRelease(releaseId) {
  return axios.delete(`https://api.github.com/repos/${githubRepo}/releases/${releaseId}`, {
    headers: { "authorization": `Bearer ${process.env.GITHUB_TOKEN}` }
  });
}

async function createRelease(data) {
  const { tag_name, target_commitish, name, body } = data;
  return axios({
    method: "post",
    url: `https://api.github.com/repos/${githubRepo}/releases`,
    data: {
      tag_name,
      target_commitish,
      name,
      body,
      draft: false,
      prerelease: false
    },
    headers: { "authorization": `Bearer ${process.env.GITHUB_TOKEN}` }
  });
}

module.exports = { getLatestRelease, deleteRelease, createRelease };