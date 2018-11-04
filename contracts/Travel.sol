pragma solidity ^0.4.24;

contract Migrations {
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
        string userName;    // 用户名
        uint time;          // 时间戳 unix
        Room room;          // 订购房间
        string OTA;         // 订购的平台
        string state;       // 表明订单状态：init/comfirmed
    }


}