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

    // 加载账户数据
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
      App.initContract();
    });

   
  },

  initContract: async function () {
    let data = await $.getJSON('Travel.json');
    App.contracts.Travel = TruffleContract(data);
    // Set the provider for our contract
    App.contracts.Travel.setProvider(App.web3Provider);
    console.log("合约加载完成");
    // 渲染页面
    App.render();
   
  },
  
  render: async function () {

    // 加载合约
    let instance = await App.contracts.Travel.deployed();
    App.renderName(instance);
    App.renderOrders(instance);

    console.log("页面渲染完成");
  },

  // 渲染姓名
  renderName: async function (instance) {
    let name = await instance.getUserName({from: App.account});
    console.log("智能合约取回的名字 ", name);
    
    if (name == "") {
      // 如果未设置姓名
      $('#rawName').text("还未设置过姓名哦~");
      $('#userName').text("快去设置姓名吧~")
    } else {
      $('#rawName').text(name);
      $('#userName').text(name)
    }

  },

  // 渲染订单
  renderOrders: async function (instance) {

    let ordersCount = await instance.getUserOrdersCount.call({from: App.account});
    // 智能合约返回的是big number类型，用tonumber转化为数字
    ordersCount = ordersCount.toNumber();
    
    
    let orders = $('#accordionExample');

    // 渲染每个订单
    for (let i = 0; i < ordersCount; i++) {
      let orderInfo = await instance.getUserOrdersInfo(i, App.account);
      let orderRoom = await instance.getUserOrdersRoom(i, App.account);
    
        let order = $('#user_order_template').clone();
    
        order.find('.card-header').attr('id', 'heading' + i);
        order.find('.collapse').attr('aria-labelledby', 'heading' + i);
        order.find('.collapse').attr('id', 'collapse' + i);

        order.find('button').text(orderRoom[0]).attr("data-target", '#collapse' + i);
      
        order.find('#order_time').text(new Date(orderInfo[0].toNumber() * 1000).toLocaleString());
        order.find('#OTA').text(orderInfo[1]);
        console.log(orderInfo[2]);

        // 判断订单状态
        if (orderInfo[2] == 'initialization') {
          order.find('#confirm_1').attr("class", "badge badge-pill badge-danger");
        } else if (orderInfo[2] == 'OTAconfirmed') {
          order.find('#confirm_1').attr("class", "badge badge-pill badge-danger");
          order.find('#confirm_2').attr("class", "badge badge-pill badge-warning");
          order.find('#confirm_2').text("OTA已确认");
        } else if (orderInfo[2] == 'Derbyconfirmed') {
          order.find('#confirm_1').attr("class", "badge badge-pill badge-danger");
          order.find('#confirm_2').attr("class", "badge badge-pill badge-warning");
          order.find('#confirm_3').attr("class", "badge badge-pill badge-info");
          order.find('#confirm_2').text("OTA已确认");
          order.find('#confirm_3').text("Derby已确认");
        } else {
          // orderInfo[2] == 'HotelConfirmed'
          order.find('#confirm_1').attr("class", "badge badge-pill badge-danger");
          order.find('#confirm_2').attr("class", "badge badge-pill badge-warning");
          order.find('#confirm_3').attr("class", "badge badge-pill badge-info");
          order.find('#confirm_4').attr("class", "badge badge-pill badge-success");
          order.find('#confirm_1').text("已确认");
          order.find('#confirm_2').text("OTA已确认");
          order.find('#confirm_3').text("Derby已确认");
          order.find('#confirm_4').text("Hotel已确认");
        }
       
        order.find('#room_type').text(orderRoom[1]);
        order.find('#from_date').text(orderRoom[2]);
        order.find('#to_date').text(orderRoom[3]);
        order.find('#total_price').text(orderRoom[4].toNumber());

        
        orders.append(order.html());
    }
  }




}
$(function () {
  $(window).load(function () {
    App.init();
  });
});