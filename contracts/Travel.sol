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

    // 类似于指针，指向用户的订单，只保存地址和索引
    struct PendingOrder {
        address userAddr;
        uint idx;
    }

    mapping (address => User) public userInfo;

    // 存储账户类型
    mapping (address => string) public accountType; 

    constructor() public  { 
        // 事先设定好几个账户
        address a = 0x9963C328918892bd240B3c6d39e64dd05d17b942; // OTA
        address b = 0xaB6d902741Cd54fe78b213a28aaBE551BB8294BE; // Derby
        address c = 0x59bac92689BB60A452DAd0D168F6f1066f0045ab; // Hotel
        
        accountType[a] = "OTA";
        accountType[b] = "Derby";
        accountType[c] = "Hotel";
    }


    // 待确认交易池
    PendingOrder[] pendingPool;
    
    // 改变用户姓名
    function changeUserName(string _name) public {
        userInfo[msg.sender].userName = _name;
    }

    // 获得用户姓名
    function getUserName() public view returns (string) {
        return userInfo[msg.sender].userName;
    }

    // 获得用户身份
    function getAccountType() public view returns (string) {
        return accountType[msg.sender];
    }

    // 发起订购
    function initializeOrder(string _hotel, string _roomType, string _fromDate, string _toDate, string _OTA, uint _totalPrice) public {
        Room memory room = Room(_hotel, _roomType, _fromDate, _toDate, _totalPrice);
        UserOrder memory userOrder = UserOrder(now, room, _OTA, "initialization");
        userInfo[msg.sender].orders.push(userOrder);

        PendingOrder memory pendingOrder = PendingOrder(msg.sender,  userInfo[msg.sender].orders.length - 1);
        // 把订单推到PendingPool;
        pendingPool.push(pendingOrder);
    }

    // solidity 不能返回结构体，更不能返回结构体数组...
    // 所以这里的操作有点麻烦
    // 得到用户订单的附加信息 用户订单分为info(userOrder结构体里的其他信息)和room
    function getUserOrdersInfo(uint _idx, address _addr) public view returns (uint, string, string){
       uint _time =  userInfo[ _addr].orders[_idx].time;
       string storage _OTA = userInfo[ _addr].orders[_idx].OTA;
       string storage _state = userInfo[ _addr].orders[_idx].state;

       return (_time, _OTA, _state);
    }

    // 得到用户订单的酒店信息
    function getUserOrdersRoom(uint _idx, address _addr) public view returns (string, string, string, string, uint){
        string storage _hotel = userInfo[_addr].orders[_idx].room.hotel;
        string storage _roomType = userInfo[_addr].orders[_idx].room.roomType;
        string storage _fromDate = userInfo[_addr].orders[_idx].room.fromDate;
        string storage _toDate = userInfo[_addr].orders[_idx].room.toDate;
        uint _totalPrice = userInfo[_addr].orders[_idx].room.totalPrice;

        return (_hotel, _roomType, _fromDate, _toDate, _totalPrice);
    }


    // 得到用户订单数量
    function getUserOrdersCount() public view returns(uint) {
        return userInfo[msg.sender].orders.length;
    }

    // 得到pendingPool数量
    function getPendingPoolCount() public view returns(uint) {
        return pendingPool.length;
    }

    // 得到pendingPool里订单的信息
    function getPendingPoolInfo(uint _idx)  public view returns (uint, string, string){
        return getUserOrdersInfo(pendingPool[_idx].idx, pendingPool[_idx].userAddr);
    }

     // 得到pendingPool里订单的房间
    function getPendingPoolRoom(uint _idx) public view returns (string, string, string, string, uint){
        return getUserOrdersRoom(pendingPool[_idx].idx, pendingPool[_idx].userAddr);
    }

    // 设置该订单状态
    function setPendingPoolRoom(uint _idx, string _state) public {
        uint _orderIndex = pendingPool[_idx].idx;
        address _addr = pendingPool[_idx].userAddr;
        userInfo[ _addr].orders[_orderIndex].state = _state;
        // solidity只能用哈希值比较字符串
        string memory s = "Hotelconfirmed";
        if (keccak256(_state) == keccak256(s)) {
            _burn(_idx);
        }
    } 

    // 从pendingRoom里面删掉该订单 所以最后hotel确认需要消耗更多的gas,因为这个函数
    // Move the last element to the deleted spot.
    // Delete the last element, then correct the length.
    function _burn(uint index) internal {
        require(index < pendingPool.length);
        pendingPool[index] = pendingPool[pendingPool.length-1];
        delete pendingPool[pendingPool.length-1];
        pendingPool.length--;
    }
    

    
}