# Derby-dapp
A dapp for the flow of data in the Travel.
## Dependencies
You should have truffle、git、ganache、node.js、metamask installed.
```
Truffle: https://truffleframework.com/truffle, truffle is the most popular development framework for Ethereum.
Ganache: https://truffleframework.com/ganache, this provides local Ethereum network and accounts for test.
Metamask: This is a Chrome extension working as Ethereum wallets, you can import/delete accounts, confirm transactions and manage your balance here.
```
<hr>

## Usage
1. Clone the repo.

```
git clone https://github.com/CISL-blockchain/travel-dapp.git
```

2. Install npm dependcies.

```
npm install
```

3. Make sure your metamask connected to your blockchain like geth or ganache whatever. And have a avaliable account.

4. Compile and migrate your smart contract.
```
truffle compile
truffle migrate --reset
```
5. Start your server to see the front-end page.
```
npm run dev
```

6. Now you can interact with your Dapp.
