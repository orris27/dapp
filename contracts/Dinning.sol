pragma solidity ^0.4.24;

contract Dinning {


  /*
   * Student
   */


    struct Student {
        address studentAddr; //学生的address
        bytes32 password; //学生的密码
        uint balance; //余额
        bytes32[] boughtFoods; //已经购买的食物
    }


    mapping(address => Student) student; // 通过address来获得学生的结构体

    address[] students; // 所有学生



    // 学生注册
    event NewStudent(address sender, bool isSuccess, string password);
    function newStudent(address _studentAddr, string _password) public {
        // 判断是否已经注册
        if (!isStudentRegistered(_studentAddr)) {
            // 还未注册
            student[_studentAddr].studentAddr = _studentAddr;
            student[_studentAddr].password = stb32(_password);
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


    //判断学生是否已经注册
    function isStudentRegistered(address _studentAddr) internal view returns (bool)  {
        for (uint i = 0; i < students.length; i++) {
            if (students[i] == _studentAddr) {
                return true;
            }
        }
        return false;
    }

    // 查询学生密码
    function getStudentPassword(address _studentAddr) constant public returns (bool, bytes32) {
        // 先判断该用户是否注册
        if (isStudentRegistered(_studentAddr)) {
            return (true, student[_studentAddr].password);
        }
        else {
            return (false, "");
        }
    }


    // 学校给学生点餐的钱
    event SendMoneyToStudent(address sender, string message);

    function sendMoneyToStudent(address _receiver, uint _amount) onlyOwner public {
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

    //根据学生的address查找余额
    function getStudentBalance(address studentAddr) constant public returns (uint) {
        return student[studentAddr].balance;
    }


    //两个学生转移金额
    event TransferMoney(address sender, string message);
    function transferMoney(uint _senderType,
        address _sender,
        address _receiver,
        uint _amount) public {

        if (!isStudentRegistered(_receiver)) {
            //目的账户不存在
            emit TransferMoney(msg.sender, "目的账户不存在，请确认后再转移！");
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
                emit TransferMoney(msg.sender, "金额转让成功！");
                return;
            } else {
                emit TransferMoney(msg.sender, "你的余额不足，转让失败！");
                return;
            }
        }
    }



    // 学生购买食物
    event BuyFood(address sender, bool isSuccess, string message);
    function buyFood(address _studentAddr, string _foodId) public {
        bytes32 tempId = stb32(_foodId);
        if (isFoodAdded(tempId)) {
            if (student[_studentAddr].balance < food[tempId].price) {
                emit BuyFood(msg.sender, false, "余额不足，购买食物失败");
                return;
            }
            else {
                student[_studentAddr].balance -= food[tempId].price;
                student[_studentAddr].boughtFoods.push(tempId);
                emit BuyFood(msg.sender, true, "购买食物成功");
                return;
            }
        }
        else {
            emit BuyFood(msg.sender, false, "输入食物Id不存在，请确定后购买");
            return;
        }
    }

    // 获得学生购买的所有食物
    function getFoodsByStudent(address _studentAddr) constant public returns (bytes32[]) {
        return student[_studentAddr].boughtFoods;
    }




  /*
   * Cook
   */


    struct Cook {
        address cookAddr; //厨师的address
        bytes32 password; //厨师密码
        bytes32[] madeFoods; //厨师烹饪好的食物
    }

    mapping(address => Cook) cook; // 通过address来获得厨师的结构体
    address[] cooks; // 所有厨师



    // 厨师注册
    event NewCook(address sender, bool isSuccess, string message);
    function newCook(address _cookAddr,
        string _password) public {

        //判断是否已经注册
        if (!isCookRegistered(_cookAddr)) {
            //还未注册
            cook[_cookAddr].cookAddr = _cookAddr;
            cook[_cookAddr].password = stb32(_password);
            cooks.push(_cookAddr);
            emit NewCook(msg.sender, true, "注册成功");
            return;
        }
        else {
            emit NewCook(msg.sender, false, "该账户已经注册");
            return;
        }
    }



    //判断厨师是否已经注册
    function isCookRegistered(address _cookAddr) public view returns (bool) {
        for (uint i = 0; i < cooks.length; i++) {
            if (cooks[i] == _cookAddr) {
                return true;
            }
        }
        return false;
    }

    //查询厨师密码
    function getCookPassword(address _cookAddr) constant public returns (bool, bytes32) {
        //先判断该厨师是否注册
        if (isCookRegistered(_cookAddr)) {
            return (true, cook[_cookAddr].password);
        }
        else {
            return (false, "");
        }
    }



    // 厨师烹饪食物
    event AddFood(address sender, bool isSuccess, string message);
    function addFood(address _cookAddr, string _foodId, uint _price) public {
        bytes32 tempId = stb32(_foodId);

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

    // 获得厨师烹饪的所有食物
    function getFoodsByCook(address _cookAddr) constant public returns (bytes32[]) {
        return cook[_cookAddr].madeFoods;
    }
  /*
   * Admin / School
   */

    address owner; //合约的拥有者:学校
    uint issuedAmount; //银行发行的金额数量

    modifier onlyOwner(){
        if (msg.sender == owner) _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function getOwner() constant public  returns (address) {
        return owner;
    }



    // 获得学校发出的钱的数量
    function getIssuedAmount() constant public returns (uint) {
        return issuedAmount;
    }
  /*
   * Food
   */


    struct Food {
        bytes32 foodId; //食物id;
        uint price; //食物的价格；
        address belong; //食物是被哪个厨师给烹饪的
    }


    mapping(bytes32 => Food) food; // 通过商品id查找该件商品
    bytes32[] foods; // 所有食物

    // 增加权限控制，某些方法只能由合约的创建者调用




    // 判断食物是不是已经被烹饪好了
    function isFoodAdded(bytes32 _foodId) internal view returns (bool) {
        for (uint i = 0; i < foods.length; i++) {
            if (foods[i] == _foodId) {
                return true;
            }
        }
        return false;
    }



    function stb32(string memory source)  internal pure  returns (bytes32 result) {
        assembly{ result := mload(add(source, 32))}



        



    }

    function b32tb(bytes32 x)  internal pure  returns (string) {

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
