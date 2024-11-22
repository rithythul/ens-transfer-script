require('dotenv').config();
const { FlashbotsBundleProvider } = require('@flashbots/ethers-provider-bundle');
const { ethers } = require('ethers');

const ENS_REGISTRY_ABI = [
  "function setOwner(bytes32 node, address owner)",
  "function owner(bytes32 node) view returns (address)"
];

const ENS_REGISTRY_ADDRESS = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";

async function transferENSWithRelay() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  
  // Compromised wallet (will only sign, not pay gas)
  const compromisedWallet = new ethers.Wallet(process.env.OLD_PRIVATE_KEY, provider);
  
  // Relay wallet (will pay for gas)
  const relayWallet = new ethers.Wallet(process.env.RELAY_PRIVATE_KEY, provider);

  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    relayWallet,
    'https://relay.flashbots.net',
    'mainnet'
  );

  const ensRegistry = new ethers.Contract(
    ENS_REGISTRY_ADDRESS,
    ENS_REGISTRY_ABI,
    compromisedWallet
  );

  const namehash = ethers.utils.namehash(process.env.ENS_DOMAIN);
  
  // First transaction: Send gas from relay wallet to compromised wallet
  const gasAmount = ethers.utils.parseEther("0.01"); // Adjust amount as needed
  
  const fundingTx = {
    to: compromisedWallet.address,
    value: gasAmount,
    gasLimit: 21000,
    maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    maxPriorityFeePerGas: ethers.utils.parseUnits("40", "gwei")
  };

  // Second transaction: Transfer ENS ownership
  const transferTx = await ensRegistry.populateTransaction.setOwner(
    namehash,
    process.env.NEW_WALLET_ADDRESS
  );

  const block = await provider.getBlock("latest");
  
  const bundle = [
    {
      transaction: fundingTx,
      signer: relayWallet
    },
    {
      transaction: {
        ...transferTx,
        gasLimit: 100000,
        maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
        maxPriorityFeePerGas: ethers.utils.parseUnits("40", "gwei")
      },
      signer: compromisedWallet
    }
  ];

  // Simulate bundle
  const simulation = await flashbotsProvider.simulate(bundle, block.number + 1);
  
  if ("error" in simulation) {
    throw new Error(`Simulation Error: ${simulation.error.message}`);
  }

  console.log("Simulation successful, sending bundle...");

  // Send bundle to next 25 blocks
  for (let i = 1; i <= 25; i++) {
    const bundleResponse = await flashbotsProvider.sendBundle(bundle, block.number + i);
    const resolution = await bundleResponse.wait();
    if (resolution === 0) {
      console.log("Bundle included in block!");
      return;
    }
  }

  throw new Error("Bundle was not included in 25 blocks");
}

// Updated .env requirements
const requiredEnvVars = [
  'OLD_PRIVATE_KEY',
  'RELAY_PRIVATE_KEY',
  'NEW_WALLET_ADDRESS',
  'ENS_DOMAIN',
  'RPC_URL'
];

// Check for required environment variables
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

transferENSWithRelay()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
