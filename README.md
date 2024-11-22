# ENS Transfer with Flashbot buddle

My ENS PK got compromised. The hackers drained all my ETH anytime I make the transfer to the compromized wallet to make the ENS transfers. At first, I thought the bot might run for a week or so. But after like 3 months, they still running. 

I thought to denounce the ENS and give up on it. But I felt like it might be the thing I should get overwith. 

First, I tried with the ui flashbot made by others. It didn't work. Wasted gas fees. 

A week after, I summon my team to help me gone through it. It didn't work. Wasted more gas fees. Not their fault. We never faced anything like that. 

Then, I left it another month or so. It still bugs me. This time I decide to go on Twitter and tell the world about it. Many replies and recommend a lot of shitheads. More scammers to me. Wasted gas fees and also small fees sending to them. 

Ask more help from ENS team. They sent me a few links and recommended me somethings. Didn't work. 

Frustrated, I ask some new friends in the crypto space. None of them can help. Not that they don't want but they can't. They never faced the situation either. 

Annoyed and a bit of anger, I decided to give it a try myself. Getting some help from AI, now i got this. Look like it could work bese on the test result. 

```bash 

❯ npm test 

> ens-transfer-script@1.0.0 test
> mocha test/**/*.t.js --timeout 30000

(node:97463) ExperimentalWarning: CommonJS module /home/pi/projects/ens-transfer-script/test/transfer.t.js is loading ES Module /home/pi/projects/ens-transfer-script/node_modules/chai/chai.js using require().
Support for loading ES Module in require() is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)


  ENS Transfer Tests
    ✔ Should validate wallet addresses
Current owner: 0xe025937463DB1D1cDF4F654D4684983726Deb0fa
Compromised wallet: 0xe025937463DB1D1cDF4F654D4684983726Deb0fa
    ✔ Should check ENS ownership (611ms)
Relay wallet balance: 0.022441861994205786 ETH
    ✔ Should check relay wallet balance (586ms)
Transfer transaction: {
  data: '0x5b0fc9c3b7288040635a443efb08810aeb3cbfecc1e222fefa2883c59e83802f237f3989000000000000000000000000a7f5f726b2395af66a2a4f5cb6fd903e596c37c7',
  to: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  nonce: 25,
  gasLimit: BigNumber { _hex: '0x0186a0', _isBigNumber: true },
  maxFeePerGas: BigNumber { _hex: '0x0ba43b7400', _isBigNumber: true },
  maxPriorityFeePerGas: BigNumber { _hex: '0x09502f9000', _isBigNumber: true },
  from: '0xe025937463DB1D1cDF4F654D4684983726Deb0fa'
}
    ✔ Should prepare bundle transaction (1256ms)


  4 passing (

```

It requires around 0.02 ETH in order to work.

## Run the script 

First, ```cp mv .env.example .evn```, then add yours

### Rust the test 

```npm test```

### Run the script

```chmod +x transfer.js```

```node transfer.js```

## Note

For best practice we should not use .env, but I am in a rust and can't be borther for this one.
