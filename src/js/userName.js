App = {
  web3Provider: null,
  contracts: {},
  account: "",

  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
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

  initContract: async function () {
    let data = await $.getJSON('Travel.json');
    App.contracts.Travel = TruffleContract(data);
    // Set the provider for our contract
    App.contracts.Travel.setProvider(App.web3Provider);
    // 渲染姓名
    App.renderName();
    App.listenForEvents();
    console.log("合约加载完成");
  },

  // 监听设置姓名事件
  listenForEvents: function () {
    $('#setName').click(function (event) {
      event.preventDefault();
      App.setName();
    });
    $('#final_order').click(function(event) {
      event.preventDefault();
      App.finalName();
    });
  },

  setName: function () {
    $('#myModal').modal('show');
  },

  finalName: async function () {
    let newName = $('#newName').val();
    let instance = await App.contracts.Travel.deployed();
    await instance.changeUserName(newName);
    console.log("设置新用户名成功");
    window.location.reload();
  },

  renderName: async function () {

    $("#accountAddress").html("Your Account: " + web3.eth.coinbase);

    // 加载原先用户名
    let instance = await App.contracts.Travel.deployed();
    let name = await instance.getUserName.call();

    if (name == "") {
      // 如果未设置姓名
      $('#rawName').text("还未设置过姓名哦~");
      $('#userName').text("快去设置姓名吧~")
    } else {
      $('#rawName').text(name);
      $('#userName').text(name)
    }
  },


}
$(function () {
  $(window).load(function () {
    App.init();
  });
});