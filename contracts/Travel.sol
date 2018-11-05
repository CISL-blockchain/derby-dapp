pragma solidity ^0.4.24;

contract Travel {

    // 酒店房间
    struct Room {
        string hotel;   // 酒店名
        string roomType;    // 房间类型
        string fromDate;    // 入住日期 2018-11-3
        string toDate;      // 离开日期 2018-11-5
        uint totalPrice;    // 总价格     
    }

    // 用户交易
    struct UserOrder {
        uint time;          // 时间戳 unix
        Room room;          // 订购房间
        string OTA;         // 订购的平台
        string state;       // 表明订单状态：init/comfirmed
    }

    struct User {
        string userName;
        UserOrder[] orders;
    }

    mapping (address=>User) public userInfo;

    // 改变用户姓名
    function changeUserName(string _name) public {
        userInfo[msg.sender].userName = _name;
    }

    // 获得用户姓名
    function getUserName() public view returns (string) {
        return userInfo[msg.sender].userName;
    }

    // 发起订购
    function initializeOrder(string _hotel, string _roomType, string _fromDate, string _toDate, string _OTA, uint _totalPrice) public {
        Room memory room = Room(_hotel, _roomType, _fromDate, _toDate, _totalPrice);
        UserOrder memory userOrder = UserOrder(now, room, _OTA, "initialization");
        userInfo[msg.sender].orders.push(userOrder);
    }

    // solidity 不能返回结构体，更不能返回结构体数组...
    // 所以这里的操作有点麻烦
    // 得到用户订单的附加信息 用户订单分为info(userOrder结构体里的其他信息)和room
    function getUserOrdersInfo(uint _idx) public view returns (uint, string, string){
       uint _time =  userInfo[msg.sender].orders[_idx].time;
       string storage _OTA = userInfo[msg.sender].orders[_idx].OTA;
       string storage _state = userInfo[msg.sender].orders[_idx].state;

        return (_time, _OTA, _state);
    }

    // 得到用户订单的酒店信息
    function getUserOrdersRoom(uint _idx) public view returns (string, string, string, string, uint){
        string storage _hotel = userInfo[msg.sender].orders[_idx].room.hotel;
        string storage _roomType = userInfo[msg.sender].orders[_idx].room.roomType;
        string storage _fromDate = userInfo[msg.sender].orders[_idx].room.fromDate;
        string storage _toDate = userInfo[msg.sender].orders[_idx].room.toDate;
        uint _totalPrice = userInfo[msg.sender].orders[_idx].room.totalPrice;

         return (_hotel, _roomType, _fromDate, _toDate, _totalPrice);
    }


    // 得到用户订单数量
    function getUserOrdersCount() public view returns(uint) {
        return userInfo[msg.sender].orders.length;
    }


}