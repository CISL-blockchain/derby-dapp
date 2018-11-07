App = {
    web3Provider: null,
    contracts: {},
    account: "",
    accountType: "",
    nowConfirmOrderIndex: 0,

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
        console.log("合约加载完成");
        // 渲染页面
        App.render();

    },

    render: async function () {

        $("#accountAddress").html("Your Account: " + web3.eth.coinbase);

        // 加载合约
        let instance = await App.contracts.Travel.deployed();
        App.renderName(instance);
        App.renderAccountType(instance);

        // 根据账户类型渲染不同的页面并且绑定不同的事件
        App.renderOrders(instance, accountType);

        console.log("页面渲染完成");
    },

    renderAccountType: async function (instance) {
        let accountType = await instance.getAccountType();
        App.accountType = accountType;
        $('#accountType').text(accountType);
    },

    // 渲染姓名
    renderName: async function (instance) {
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

    insertOrders: function (orderInfo, orderRoom, idx) {

        let orders = $('#accordionExample');
        let order = $('#user_order_template');

        order.find('.card-header').attr('id', 'heading' + idx);
        order.find('.collapse').attr('aria-labelledby', 'heading' + idx);
        order.find('.collapse').attr('id', 'collapse' + idx);

        order.find('.collapsed').text(orderRoom[0]).attr("data-target", '#collapse' + idx);

        order.find('#order_time').text(new Date(orderInfo[0].toNumber() * 1000).toLocaleString());
        order.find('#OTA').text(orderInfo[1]);
        console.log(orderInfo[2]);

        order.find("#set_confirmed").attr("data-index", idx);

        // 判断订单状态
        if (orderInfo[2] == 'initialization') {
            order.find('#state').text("确认中");
        } else if (orderInfo[2] == 'OTAconfirmed') {
            order.find('#state').text("OTA已确认");
        } else if (orderInfo[2] == 'Derbyconfirmed') {
            order.find('#state').text("Derby已确认");
        } else {
            // orderInfo[2] == 'HotelConfirmed'
            order.find('#state').text("已通过");
            order.find('#state').attr("class", "badge badge-pill badge-success");
        }

        order.find('#room_type').text(orderRoom[1]);
        order.find('#from_date').text(orderRoom[2]);
        order.find('#to_date').text(orderRoom[3]);
        order.find('#total_price').text(orderRoom[4].toNumber());


        orders.append(order.html());

    },

    // 渲染订单
    renderOrders: async function (instance) {

        let ordersCount = await instance.getPendingPoolCount.call();
        // 智能合约返回的是big number类型，用tonumber转化为数字
        ordersCount = ordersCount.toNumber();
        console.log("pending pool总订单数:" + ordersCount);

        // 渲染每个订单
        for (let i = 0; i < ordersCount; i++) {
            let orderInfo = await instance.getPendingPoolInfo(i);
            let orderRoom = await instance.getPendingPoolRoom(i);
            console.log(orderInfo)
            if (App.accountType == "OTA" && orderInfo[2] == "initialization") {
                App.insertOrders(orderInfo, orderRoom,i);
            } else if (App.accountType == "Derby" && orderInfo[2] == "OTAconfirmed") {
                App.insertOrders(orderInfo, orderRoom, i);
            } else if (App.accountType == "Hotel" && orderInfo[2] == "Derbyconfirmed") {
                App.insertOrders(orderInfo, orderRoom, i);
            }
        }

        App.bindEvents();

    },

    bindEvents: function() {
        $('#set_confirmed').click(function (event) {
            console.log("fuck");
            event.preventDefault();
            App.nowConfirmOrderIndex = $(event.target).attr("data-index");
            $('#myModal').modal('show');
        });

        $('#final_confirmed').click(function(event) {
            event.preventDefault();
            App.confirmOrder();
        });
    },

    confirmOrder: async function () {
        // 调用智能合约设置状态函数
        let instance = await App.contracts.Travel.deployed();
        let toComfirmState = "";
        if (App.accountType == "OTA") {
            toComfirmState = "OTAconfirmed";
        } else if(App.accountType == "Derby") {
            toComfirmState = "Derbyconfirmed";
        }else if(App.accountType == "Hotel") {
            toComfirmState = "Hotelconfirmed";
        }
        instance.setPendingPoolRoom(App.nowConfirmOrderIndex, toComfirmState);

    }
}

$(function () {
    $(window).load(function () {
        App.init();
    });
});