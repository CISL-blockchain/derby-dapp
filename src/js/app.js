App = {
  web3Provider: null,
  contracts: {},
  order: {},

  init: async function () {
    // 初始化时间选择器
    Util.date.initDatepicker();
    $(".alert").hide();

    // Load hotel.
    let hotelData = await $.getJSON('../hotel.json');
    let hotel = hotelData[0];

    // 设置酒店名字和信息
    $('#hotel_name').text(hotel.name);
    $('#hotel_location').text(hotel.location);
    $('#hotel_img').attr("src", "../images/hotel.jpg");

    // 设置酒店房间
    let roomType = hotel.roomType;
    let rooms = $('tbody');

    // 渲染房型
    for (let i = 0; i < roomType.length; i++) {
      let oneType = $('<tr></tr>');
      rooms.append(oneType)
      let roomTypeImg = $('<td></td>').append($('<img/>'));
      roomTypeImg.find('img').attr('src', roomType[i].imageUrl).attr("class", "img-thumbnail");
      oneType.append(roomTypeImg)
      let roomTypeName = $('<td></td>').text(roomType[i].type);
      oneType.append(roomTypeName);
      let roomTypePrice = $('<td></td>').text("¥" + roomType[i].price);
      oneType.append(roomTypePrice);
      let roomTypeBtn = $('<td></td>');
      roomTypeBtn.append($('<button>').text("预定").attr(
        "class", "btn btn-success order-btn"
      ));

      oneType.append(roomTypeBtn);
      rooms.append(oneType);
    }

    // 页面渲染完成, 为订购按钮绑定事件
    App.bindEvents();

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
    console.log("合约加载完成");
  },

  // 从合约中获取姓名并加载
  renderName: async function () {
    let instance = await App.contracts.Travel.deployed();
    let userName = await instance.getUserName.call();
    if (userName == "") {
      userName = "去我的设置里设置姓名~"
    }
    $('#userName').text(userName);
  },

  // 为订购按钮绑定点击事件
  bindEvents: function () {
    $('.order-btn').click(App.handleOrder);
    $('#finalOrder').click(App.finalOrder);
    console.log("绑定事件完成");
  },

  // 从页面中获取用户点击的订单信息
  getCurrentOrder: function (event) {
    let order = {}

    let tds = $(event.target).parent().prevAll();
    order.roomType = $(tds[1]).text();
    order.roomPrice = $(tds[0]).text().substring(1);
    order.hotelName = $('#hotel_name').text();
    order.OTA = $('#OTAImg').attr("data-OTA");
    order.fromDate = $('#startDate').val();
    order.toDate = $('#endDate').val();

    

    // 住的天数乘以单价得到总价格
    order.price = Util.date.getDateDifference(order.fromDate, order.toDate) * order.roomPrice;
    return order;
  },

  // 处理订购函数
  handleOrder: async function (event) {
    // 阻止元素 默认行为
    event.preventDefault();
    if (Util.date.isDateFilled()) {
      App.order = App.getCurrentOrder(event);
      $('#myModal').modal('show');
      let order = App.order;
      let order_info = order.hotelName + "&nbsp;&nbsp;&nbsp;&nbsp;" + order.roomType + order.fromDate + " 到 " + order.toDate;
      $('#order_info').html(order_info);
    } else {
      $('.alert').show();
    }
  },

  finalOrder: async function (event) {
    // 阻止元素 默认行为
    event.preventDefault();

    // 获取到合约实例
    // 处理订单
    
    let instance = await App.contracts.Travel.deployed();
    let order = App.order;
    await instance.initializeOrder(order.hotelName, order.roomType, order.fromDate, order.toDate, order.OTA, order.price);
  }
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
