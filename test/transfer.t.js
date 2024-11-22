const { expect } = require('chai');
const { ethers } = require('ethers');
const { FlashbotsBundleProvider } = require('@flashbots/ethers-provider-bundle');
require('dotenv').config();

describe('ENS Transfer Tests', function() {
  let provider;
  let compromisedWallet;
  let relayWallet;
  let newWallet;
  let ensRegistry;
  let flashbotsProvider;
  let namehash;

  before(async function() {
    provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    
    // Setup wallets
    compromisedWallet = new ethers.Wallet(process.env.OLD_PRIVATE_KEY, provider);
    relayWallet = new ethers.Wallet(process.env.RELAY_PRIVATE_KEY, provider);
    newWallet = new ethers.Wallet.createRandom();
    
    ensRegistry = new ethers.Contract(
      "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
      ["function setOwner(bytes32 node, address owner)", "function owner(bytes32 node) view returns (address)"],
      compromisedWallet
    );
    
    flashbotsProvider = await FlashbotsBundleProvider.create(
      provider,
      relayWallet
    );
    
    namehash = ethers.utils.namehash(process.env.ENS_DOMAIN);
  });

  it('Should validate wallet addresses', async function() {
    expect(ethers.utils.isAddress(compromisedWallet.address)).to.be.true;
    expect(ethers.utils.isAddress(relayWallet.address)).to.be.true;
    expect(ethers.utils.isAddress(newWallet.address)).to.be.true;
  });

  it('Should check ENS ownership', async function() {
    const currentOwner = await ensRegistry.owner(namehash);
    console.log('Current owner:', currentOwner);
    console.log('Compromised wallet:', compromisedWallet.address);
  });

  it('Should check relay wallet balance', async function() {
    const balance = await provider.getBalance(relayWallet.address);
    console.log('Relay wallet balance:', ethers.utils.formatEther(balance), 'ETH');
    expect(balance.gt(ethers.utils.parseEther("0.01"))).to.be.true;
  });

  it('Should prepare bundle transaction', async function() {
    const block = await provider.getBlock("latest");
    const nonce = await compromisedWallet.getTransactionCount();

    const transferTx = await ensRegistry.populateTransaction.setOwner(
      namehash,
      process.env.NEW_WALLET_ADDRESS,
      {
        nonce,
        gasLimit: 100000,
        maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
        maxPriorityFeePerGas: ethers.utils.parseUnits("40", "gwei")
      }
    );

    console.log('Transfer transaction:', transferTx);
  });
});
