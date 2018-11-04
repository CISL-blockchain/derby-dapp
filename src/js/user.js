App = {
    web3Provider: null,
    contracts: {},
    account: "",
  
  
    init: function() {
      return App.initWeb3();
    },
  
    initWeb3: function() {
       // Is there an injected web3 instance?
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider;
      } else {
        // If no injected web3 instance is detected, fall back to Ganache
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      }
      web3 = new Web3(App.web3Provider);

      return App.initContract();
    },
  
    initContract: function() {
      $.getJSON('Travel.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract
        var TravelArtifact = data;
        App.contracts.Travel = TruffleContract(TravelArtifact);
      
        // Set the provider for our contract
        App.contracts.Travel.setProvider(App.web3Provider);
      });
  
      return App.initPage();
    },

    initPage: function () {
      // 加载账户数据
      web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
          App.account = account;
          $("#accountAddress").html("Your Account: " + account);
        }
      });

      
  
  },
  
  
}
$(function() {
  $(window).load(function() {
    App.init();
  });
});