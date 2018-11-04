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

        App.listenForEvents();
        App.render();
      });
    },

    // 监听设置姓名事件
    listenForEvents: function () {
        $('#setName').click(function(){
            App.setName();
        });
    },

    setName: function() {
       let newName = $('#newName').val();
       App.contracts.Travel.deployed().then(function(instance) {
        return instance.changeUserName(newName);
      }).then(function(result) {
        alert("设置成功");
        window.location.reload();
      }).catch(function(err) {
        console.error(err);
      });
    }, 

    render: function () {
      // 加载账户数据
      web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
          App.account = account;
          $("#accountAddress").html("Your Account: " + account);
        }
      });

      // 加载原先用户名
      App.contracts.Travel.deployed().then(function(instance) {
        return instance.getUserName.call();
      }).then(function(name) {
        if (name == "") {
          // 如果未设置姓名
          $('#rawName').text("还未设置过姓名哦~");
        } else {
          $('#rawName').text(name);
        }
      });
  },
  
  
}
$(function() {
  $(window).load(function() {
    App.init();
  });
});