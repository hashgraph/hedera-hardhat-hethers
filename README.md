# ⛔️ DEPRECATED

Deprecation of Hethers.js by October 20, 2023\
As we continue to evolve the Hedera ecosystem, we are committed to ensuring that our developer tools and resources remain easy to use and up-to-date. With this goal in mind, the Hethers.js library will be deprecated by October 20, 2023
If you are currently using or planned to use Hethers in your projects, please consider instead [ethers.js](https://docs.ethers.org/v6/) or [web3js](https://web3js.org/) in combination with [hedera-json-rpc-relay](https://github.com/hashgraph/hedera-json-rpc-relay) before the deprecation date. For ED25519 focused scenarios the [hedera-sdk-js](https://github.com/hashgraph/hedera-sdk-js) may be utilized

---
[![No Maintenance Intended](https://unmaintained.tech/badge.svg)]()
[![npm](https://img.shields.io/npm/v/@hashgraph/hardhat-hethers.svg)](https://www.npmjs.com/package/@hashgraph/hardhat-hethers) [![hardhat](https://hardhat.org/buidler-plugin-badge.svg?1)](https://hardhat.org)[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)


# @hashgraph/hardhat-hethers

[Hardhat](https://hardhat.org) plugin for integration with [hethers.js](https://github.com/hashgraph/hethers.js).

## What

This plugin brings to Hardhat the Hedera library `hethers.js`, which allows you to interact with the Hedera hashgraph in a simple way.

## Installation

```bash
npm install --save-dev '@hashgraph/hardhat-hethers'
```

And add the following statement to your `hardhat.config.js`:

```js
require("@hashgraph/hardhat-hethers");
```

Or if you're using `Typescript`:

```typescript
import "@hashgraph/hardhat-hethers";
```

## Configuration

This plugin extends the `HardhatConfig` object with `hedera` and updates the type of the `networks` field.

Here is an example network configuration in `hardhat.config.js`:

```js
module.exports = {
  defaultNetwork: 'testnet',  // The selected default network. It has to match the name of one of the configured networks.
  hedera: {
    gasLimit: 300000, // Default gas limit. It is added to every contract transaction, but can be overwritten if required.
    networks: {
      testnet: {      // The name of the network, e.g. mainnet, testnet, previewnet, customNetwork
        accounts: [   // An array of predefined Externally Owned Accounts
          {
            "account": '0.0.123',
            "privateKey": '0x...'
          },
          ...
        ]
      },
      previewnet: {
        accounts: [
          {
            "account": '0.0.123',
            "privateKey": '0x...'
          },
          ...
        ]
      },
      
      // Custom networks require additional configuration - for conesensusNodes and mirrorNodeUrl
      // The following is an integration example for the local-hedera package
      customNetwork: {
        consensusNodes: [
          {
            url: '127.0.0.1:50211',
            nodeId: '0.0.3'
          }
        ],
        mirrorNodeUrl: 'http://127.0.0.1:5551',
        chainId: 0,
        accounts: [
          {
            'account': '0.0.1002',
            'privateKey': '0x7f109a9e3b0d8ecfba9cc23a3614433ce0fa7ddcc80f2a8f10b222179a5a80d6'
          },
          {
            'account': '0.0.1003',
            'privateKey': '0x6ec1f2e7d126a74a1d2ff9e1c5d90b92378c725e506651ff8bb8616a5c724628'
          },
        ]
      },
      ...
    }
  }
};
```

The following networks have their respective settings pre-defined. You will only need to specify the accounts when using `testnet`, `mainnet`, `previewnet` or `local`. For any other networks the full configuration needs to be provided, as in the `customNetwork` example above.

Read more about Externally Owned Accounts [here](https://docs.hedera.com/hethers/application-programming-interface/signers#externallyownedaccount).


## Tasks

This plugin creates no additional tasks.

## Environment extensions

This plugin adds a `hethers` object to the Hardhat Runtime Environment.

This object has the [same API](https://docs.hedera.com/hethers/) as `hethers.js`, with some extra Hardhat-specific functionality.

### Provider object

A `provider` field is added to `hethers`, which is an [`hethers.providers.BaseProvider`](https://docs.hedera.com/hethers/application-programming-interface/providers/provider/base-provider) automatically connected to the selected network.

### Helpers

These helpers are added to the `hethers` object:

#### Interfaces
```typescript
interface Libraries {
  [libraryName: string]: string;
}

interface FactoryOptions {
  signer?: hethers.Signer;
  libraries?: Libraries;
}

interface HederaAccount {
    account?: string;
    address?: string;
    alias?: string;
    privateKey: string;
}

interface HederaNodeConfig {
    url: string;
    nodeId: string;
}

interface HederaNetwork {
    accounts: Array<HederaAccount>;
    nodeId?: string;
    consensusNodes?: Array<HederaNodeConfig>;
    mirrorNodeUrl?: string;
    chainId?: number;
}

interface HederaNetworks {
    [name: string]: HederaNetwork
}

interface HederaConfig {
    gasLimit: number;
    networks: HederaNetworks;
}

```

#### Functions
- `function getSigners() => Promise<hethers.Signer[]>;`
```typescript
const signers = await hre.hethers.getSingers();
```

- `function getSigner(identifier: any) => Promise<hethers.Signer>;`
```typescript
const signer = await hre.hethers.getSigner({
    "account": "0.0.123",
    "privateKey": "0x..."
});
```

- `function getContractFactory(name: string, signer?: hethers.Signer): Promise<hethers.ContractFactory>;`
```typescript
const contractFactoryWithDefaultSigner = await hre.hethers.getContractFactory('Greeter');
const signer = (await hre.getSigners())[1];

const contractFactoryWithCustomSigner = await hre.hethers.getContractFactory('Greeter', signer);
```

- `function getContractFactory(name: string, factoryOptions: FactoryOptions): Promise<hethers.ContractFactory>;`
```typescript
const libraryFactory = await hre.hethers.getContractFactory("contracts/TestContractLib.sol:TestLibrary");
const library = await libraryFactory.deploy();

const contract = await hre.hethers.getContractFactory("Greeter", {
    libraries: {
        "contracts/Greeter.sol:TestLibrary": library.address
    }
});
```

- `function getContractFactory(abi: any[], bytecode: hethers.utils.BytesLike, signer?: hethers.Signer): Promise<hethers.ContractFactory>;`
```typescript
const greeterArtifact = await hre.artifacts.readArtifact("Greeter");

const contract = await hre.hethers.getContractFactory(greeterArtifact.abi, greeterArtifact.bytecode);
```

- `function getContractAt(name: string, address: string, signer?: hethers.Signer): Promise<hethers.Contract>;`
```typescript
const Greeter = await hre.hethers.getContractFactory("Greeter");
const deployedGreeter = await Greeter.deploy();

const contract = await hre.hethers.getContractAt("Greeter", deployedGreeter.address);
```

- `function getContractAt(abi: any[], address: string, signer?: hethers.Signer): Promise<hethers.Contract>;`
```typescript
const greeterArtifact = await hre.artifacts.readArtifact("Greeter");

const contract = await hre.hethers.getContractAt(greeterArtifact.abi, deployedGreeter.address);
```

- `function getContractFactoryFromArtifact(artifact: Artifact, signer?: hethers.Signer): Promise<ethers.ContractFactory>;`
```typescript
const greeterArtifact = await hre.artifacts.readArtifact("Greeter");

const contractFactoryFromArtifact = await hre.hethers.getContractFactoryFromArtifact(greeterArtifact);
```

- `function getContractFactoryFromArtifact(artifact: Artifact, factoryOptions: FactoryOptions): Promise<hethers.ContractFactory>;`
```typescript
const greeterArtifact = await hre.artifacts.readArtifact("Greeter");
const libraryFactory = await hre.hethers.getContractFactory(
    "contracts/TestContractLib.sol:TestLibrary"
);
const library = await libraryFactory.deploy();

const contract = await hre.hethers.getContractFactory(greeterArtifact, {
    libraries: {
        "contracts/TestContractLib.sol:TestLibrary": library.address
    }
});
```

- `function getContractAtFromArtifact(artifact: Artifact, address: string, signer?: hethers.Signer): Promise<hethers.Contract>;`
```typescript
const Greeter = await hre.hethers.getContractFactory("Greeter");
const deployedGreeter = await Greeter.deploy();
const greeterArtifact = await hre.artifacts.readArtifact("Greeter");

const contract = await hre.getContractAtFromArtifact(greeterArtifact, deployedGreeter.address);
```

The [`Contract's`](https://docs.hedera.com/hethers/application-programming-interface/contract-interaction/contract) and [`ContractFactory's`](https://docs.hedera.com/hethers/application-programming-interface/contract-interaction/contractfactory) returned by these helpers are connected to the first [signer](https://docs.hedera.com/hethers/application-programming-interface/signers#wallet) returned by `getSigners` by default.

## Usage

There are no additional steps you need to take for this plugin to work.

Install it and access hethers through the Hardhat Runtime Environment anywhere you need it (tasks, scripts, tests, etc). For example, in your `hardhat.config.js`:

```typescript
require("@hashgraph/hardhat-hethers");

// task action function receives the Hardhat Runtime Environment as second argument
task('getBalance', 'Prints the the balance of "0.0.29631749"', async (_, {hethers}) => {
    const balance = (await hethers.provider.getBalance('0.0.29631749')).toString();
    console.log(`Balance of "0.0.29631749": ${balance} tinybars`);
});

module.exports = {};
```

And then run `npx hardhat getBalance` to try it.

Read the documentation on the [Hardhat Runtime Environment](https://hardhat.org/advanced/hardhat-runtime-environment.html) to learn how to access the HRE in different ways to use hethers.js from anywhere the HRE is accessible.

### Library linking

Some contracts need to be linked with libraries before they are deployed. You can pass the addresses of their libraries to the `getContractFactory` function with an object like this:

```typescript
const contractFactory = await this.env.hethers.getContractFactory("Example", {
    libraries: {
        ExampleLib: "0x...",
    },
});
```

This allows you to create a contract factory for the `Example` contract and link its `ExampleLib` library references to the address `"0x..."`.

To create a contract factory, all libraries must be linked. An error will be thrown informing you of any missing library.

## Troubleshooting

### Events are not being emitted

Hethers.js polls the network to check if some event was emitted (except when a `WebSocketProvider` is used; see below). This polling is done every 4 seconds. If you have a script or test that is not emitting an event, it's likely that the execution is finishing before the event is detected by the polling mechanism.

If you are connecting to a Hardhat node using a `WebSocketProvider`, events should be emitted immediately. But keep in mind that you'll have to create this provider manually, since Hardhat only supports configuring networks via http. That is, you can't add a `localhost` network with a URL like `ws://localhost:8545`.

## Contributing

Contributions are welcome. Please see the
[contributing guide](https://github.com/hashgraph/.github/blob/main/CONTRIBUTING.md)
to see how you can get involved.

## Code of Conduct

This project is governed by the
[Contributor Covenant Code of Conduct](https://github.com/hashgraph/.github/blob/main/CODE_OF_CONDUCT.md). By
participating, you are expected to uphold this code of conduct. Please report unacceptable behavior
to [oss@hedera.com](mailto:oss@hedera.com).

## License

[Apache License 2.0](LICENSE)
