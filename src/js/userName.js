App = {
  web3Provider: null,
  contracts: {},
  account: "",
  oldName: "",
  newName: "",
  

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

    // 加载账户数据
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });


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
    let newName = $('#newName').val();
    App.newName = newName;
    $('#old_name').text(App.oldName);
    $('#new_name').text(App.newName);
  },

  finalName: async function () {
    let instance = await App.contracts.Travel.deployed();
    await instance.changeUserName(App.newName);
    console.log("设置新用户名成功");
    window.location.reload();
  },

  renderName: async function () {

    $("#accountAddress").html("Your Account: " + App.account);


    // 加载原先用户名
    let instance = await App.contracts.Travel.deployed();
    let name = await instance.getUserName.call();

    App.oldName = name;

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