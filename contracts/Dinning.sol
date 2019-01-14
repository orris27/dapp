pragma solidity ^0.4.24;

contract Utils {

    function stringToBytes32(string memory source)  internal pure  returns (bytes32 result) {
        assembly {
            result := mload(add(source, 32))
        }
    }

    function bytes32ToString(bytes32 x)  internal pure  returns (string) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }
}

contract Dinning is Utils {


    address owner; //合约的拥有者，学校
    uint issuedAmount; //银行已经发行的积分总数

    struct Student {
        address studentAddr; //客户address
        bytes32 password; //客户密码
        uint balance; //积分余额
        bytes32[] boughtFoods; //购买的商品数组
    }

    struct Cook {
        address cookAddr; //商户address
        bytes32 password; //商户密码
        bytes32[] madeFoods; //发布的商品数组
    }

    struct Food {
        bytes32 foodId; //商品Id;
        uint price; //价格；
        address belong; //商品属于哪个商户address；
    }


    mapping(address => Student) student;
    mapping(address => Cook) cook;
    mapping(bytes32 => Food) food; //根据商品Id查找该件商品

    address[] students; //已注册的客户数组
    address[] cooks; //已注册的商户数组
    bytes32[] foods; //已经上线的商品数组

    //增加权限控制，某些方法只能由合约的创建者调用
    modifier onlyOwner(){
        if (msg.sender == owner) _;
    }

    //构造函数
    constructor() public {
        owner = msg.sender;
    }


    //返回合约调用者地址
    function getOwner() constant public  returns (address) {
        return owner;
    }

    //注册一个客户
    event NewStudent(address sender, bool isSuccess, string password);

    function newStudent(address _studentAddr, string _password) public {
        //判断是否已经注册
        if (!isStudentRegistered(_studentAddr)) {
            //还未注册
            student[_studentAddr].studentAddr = _studentAddr;
            student[_studentAddr].password = stringToBytes32(_password);
            student[_studentAddr].balance = 50;
            students.push(_studentAddr);
            emit NewStudent(msg.sender, true, _password);
            return;
        }
        else {
            emit NewStudent(msg.sender, false, _password);
            return;
        }
    }

    //注册一个商户
    event NewCook(address sender, bool isSuccess, string message);

    function newCook(address _cookAddr,
        string _password) public {

        //判断是否已经注册
        if (!isCookRegistered(_cookAddr)) {
            //还未注册
            cook[_cookAddr].cookAddr = _cookAddr;
            cook[_cookAddr].password = stringToBytes32(_password);
            cooks.push(_cookAddr);
            emit NewCook(msg.sender, true, "注册成功");
            return;
        }
        else {
            emit NewCook(msg.sender, false, "该账户已经注册");
            return;
        }
    }

    //判断一个客户是否已经注册
    function isStudentRegistered(address _studentAddr) internal view returns (bool)  {
        for (uint i = 0; i < students.length; i++) {
            if (students[i] == _studentAddr) {
                return true;
            }
        }
        return false;
    }

    //判断一个商户是否已经注册
    function isCookRegistered(address _cookAddr) public view returns (bool) {
        for (uint i = 0; i < cooks.length; i++) {
            if (cooks[i] == _cookAddr) {
                return true;
            }
        }
        return false;
    }

    //查询用户密码
    function getStudentPassword(address _studentAddr) constant public returns (bool, bytes32) {
        //先判断该用户是否注册
        if (isStudentRegistered(_studentAddr)) {
            return (true, student[_studentAddr].password);
        }
        else {
            return (false, "");
        }
    }

    //查询商户密码
    function getCookPassword(address _cookAddr) constant public returns (bool, bytes32) {
        //先判断该商户是否注册
        if (isCookRegistered(_cookAddr)) {
            return (true, cook[_cookAddr].password);
        }
        else {
            return (false, "");
        }
    }

    //银行发送积分给客户,只能被银行调用，且只能发送给客户
    event SendMoneyToStudent(address sender, string message);

    function sendMoneyToStudent(address _receiver,
        uint _amount) onlyOwner public {

        if (isStudentRegistered(_receiver)) {
            //已经注册
            issuedAmount += _amount;
            student[_receiver].balance += _amount;
            emit SendMoneyToStudent(msg.sender, "发行金钱成功");
            return;
        }
        else {
            //还没注册
            emit SendMoneyToStudent(msg.sender, "该账户未注册，发行金钱失败");
            return;
        }
    }

    //根据客户address查找余额
    function getStudentBalance(address studentAddr) constant public returns (uint) {
        return student[studentAddr].balance;
    }


    //两个账户转移积分，任意两个账户之间都可以转移，客户商户都调用该方法
    //_senderType表示调用者类型，0表示客户，1表示商户
    event TransferMoneyToAnother(address sender, string message);

    function transferMoneyToAnother(uint _senderType,
        address _sender,
        address _receiver,
        uint _amount) public {

        if (!isStudentRegistered(_receiver)) {
            //目的账户不存在
            emit TransferMoneyToAnother(msg.sender, "目的账户不存在，请确认后再转移！");
            return;
        }
        if (_senderType == 0) {
            //客户转移
            if (student[_sender].balance >= _amount) {
                student[_sender].balance -= _amount;

                if (isStudentRegistered(_receiver)) {
                    //目的地址是客户
                    student[_receiver].balance += _amount;
                } else {
                    student[_receiver].balance += _amount;
                }
                emit TransferMoneyToAnother(msg.sender, "金额转让成功！");
                return;
            } else {
                emit TransferMoneyToAnother(msg.sender, "你的余额不足，转让失败！");
                return;
            }
        }
    }

    //银行查找已经发行的积分总数
    function getissuedAmount() constant public returns (uint) {
        return issuedAmount;
    }


    //商户添加一件商品
    event AddFood(address sender, bool isSuccess, string message);

    function addFood(address _cookAddr, string _foodId, uint _price) public {
        bytes32 tempId = stringToBytes32(_foodId);

        //首先判断该商品Id是否已经存在
        if (!isFoodAdded(tempId)) {
            food[tempId].foodId = tempId;
            food[tempId].price = _price;
            food[tempId].belong = _cookAddr;

            foods.push(tempId);
            cook[_cookAddr].madeFoods.push(tempId);
            emit AddFood(msg.sender, true, "生产食物成功");
            return;
        }
        else {
            emit AddFood(msg.sender, false, "该食物已经添加，请确认后操作");
            return;
        }
    }

    //商户查找自己的商品数组
    function getFoodsByCook(address _cookAddr) constant public returns (bytes32[]) {
        return cook[_cookAddr].madeFoods;
    }

    //用户用积分购买一件商品
    event BuyFood(address sender, bool isSuccess, string message);

    function boughtFoods(address _studentAddr, string _foodId) public {
        //首先判断输入的商品Id是否存在
        bytes32 tempId = stringToBytes32(_foodId);
        if (isFoodAdded(tempId)) {
            //该件商品已经添加，可以购买
            if (student[_studentAddr].balance < food[tempId].price) {
                emit BuyFood(msg.sender, false, "余额不足，购买食物失败");
                return;
            }
            else {
                //对这里的方法抽取
                student[_studentAddr].balance -= food[tempId].price;
                student[_studentAddr].boughtFoods.push(tempId);
                emit BuyFood(msg.sender, true, "购买食物成功");
                return;
            }
        }
        else {
            //没有这个Id的商品
            emit BuyFood(msg.sender, false, "输入食物Id不存在，请确定后购买");
            return;
        }
    }

    //客户查找自己的商品数组
    function getFoodsByStudent(address _studentAddr) constant public returns (bytes32[]) {
        return student[_studentAddr].boughtFoods;
    }

    //首先判断输入的商品Id是否存在
    function isFoodAdded(bytes32 _foodId) internal view returns (bool) {
        for (uint i = 0; i < foods.length; i++) {
            if (foods[i] == _foodId) {
                return true;
            }
        }
        return false;
    }

}
