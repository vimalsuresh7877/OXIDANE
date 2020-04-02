pragma solidity ^0.5.0;

contract OxidaneToken {
    string  public name = "Oxidane Token";
    string  public symbol = "OXD";
    string  public standard = "OXD Token v1.0";
    uint256 public totalSupply =  1000000000000000000000000;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor () public {
        balanceOf[msg.sender] = totalSupply;
        }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value,"Not enough Balance");

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;

       emit Approval(msg.sender, _spender, _value);

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from],"Not Enough balance to transfer");
        require(_value <= allowance[_from][msg.sender],"Not Enough allowance");

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;

       emit Transfer(_from, _to, _value);

        return true;
    }
}