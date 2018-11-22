//If you encounter 'module undefined error' when running this dapp on Windows, you may try to rename this file to 'truffle-config.js'.
var HDWalletProvider = require("truffle-hdwallet-provider")
const MNEMONIC = "budget mirror toddler master similar media dune perfect furnace noise way cloud"

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/v3/f5515cecade24cb68c27d59764b4696e")
      },
      network_id: 3,
      gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
    }
  }
};

//QmWBGVVg3ZJxaw4tbBJLut7CZWcu7o5yUDGx4mqB94iKoH/