App = {
  web3Provider: null,
  contracts: {},
  
  initDatepicker: function () {
    var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    $('#startDate').datepicker({
        uiLibrary: 'bootstrap4',
        iconsLibrary: 'fontawesome',
        minDate: today,
        maxDate: function () {
          return $('#endDate').val();
        },
        format: 'yyyy-mm-dd'
    });
    $('#endDate').datepicker({
        uiLibrary: 'bootstrap4',
        iconsLibrary: 'fontawesome',
        minDate: function () {
            return $('#startDate').val();
        },
        format: 'yyyy-mm-dd'
    });
  },

  init: function() {
    // 初始化时间选择器
    App.initDatepicker();

    $(".alert").hide();

    // Load hotel.
    $.getJSON('../hotel.json', function(data) {
      let hotel = data[0];
 

      // 设置酒店名字和信息
      $('#hotel_name').text(hotel.name);
      $('#hotel_location').text(hotel.location);
      $('#hotel_img').attr("src","../images/hotel.jpg");

     

      // 设置酒店房间
      let roomType = hotel.roomType;
      let rooms = $('tbody');
     
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
        roomTypeBtn.append($('<button>').text("预定").attr("class", "btn btn-success order-btn"));
        oneType.append(roomTypeBtn);
        rooms.append(oneType);
      }

      App.bindEvents();

    });

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
    console.log("合约加载完成");
    $.getJSON('Travel.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var TravelArtifact = data;
      App.contracts.Travel = TruffleContract(TravelArtifact);
    
      // Set the provider for our contract
      App.contracts.Travel.setProvider(App.web3Provider);
      // 渲染姓名
      App.renderName();
    });

    
   

    
  },

  renderName: function() {
    // 加载姓名
    App.contracts.Travel.deployed().then(function(instance) {
      return instance.getUserName.call();
    }).then(function(name) {
      if (name == "") {
        // 如果未设置姓名
        $('#userName').text("快去设置姓名吧~");
      } else {
        $('#userName').text(name);
      }
    });
  },

  bindEvents: function() {
    console.log("绑定事件完成");
    $('.order-btn').click(App.handleOrder);
  },

  // 检查日期是否填写
  isDateFilled: function() {
    return $('#startDate').val() != "" && $('#endtDate').val() != "";
  },

  // 计算两个日期差的函数
  getDateDifference: function (sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式  
    sDate1 = Date.parse(sDate1);
    sDate2 = Date.parse(sDate2);
    var dateSpan = sDate2 - sDate1;
    dateSpan = Math.abs(dateSpan);
    return Math.floor(dateSpan / (24 * 3600 * 1000));
  },


  getCurrentOrder: function (event) {
    let order = {}

    let tds = $(event.target).parent().prevAll();
    order.roomType = $(tds[1]).text();
    order.roomPrice = $(tds[0]).text().substring(1,);
    order.hotelName = $('#hotel_name').text();
    order.OTA = $('#OTAImg').attr("data-OTA");
    order.fromDate = $('#startDate').val();
    order.toDate = $('#endDate').val();
    
    // 住的天数乘以单价得到总价格
    order.price = App.getDateDifference(order.fromDate,order.toDate) * order.roomPrice;
    
   



  },
  
  handleOrder: function(event) {

    event.preventDefault();
    let order = App.getCurrentOrder(event);

    if (App.isDateFilled()) {

    } else {
      
      $('.alert').show();
     
    }
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
