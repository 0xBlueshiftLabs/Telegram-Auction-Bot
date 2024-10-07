pragma solidity ^0.8.2;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IEasyAuction.sol";
import "../interfaces/IWETH.sol";

contract DepositAndPlaceOrder {
    IEasyAuction public immutable easyAuction;
    IWETH public immutable nativeTokenWrapper;

    constructor(IEasyAuction _easyAuction, address _nativeTokenWrapper) {
        nativeTokenWrapper = IWETH(_nativeTokenWrapper);
        easyAuction = _easyAuction;
        IERC20(_nativeTokenWrapper).approve(
            address(_easyAuction),
            type(uint256).max
        );
    }

    function depositAndPlaceOrder(
        uint256 auctionId,
        uint96[] calldata _minBuyAmounts,
        bytes32[] calldata _prevSellOrders,
        string calldata referralCode
    ) external payable returns (uint64 userId) {
        uint96[] memory sellAmounts = new uint96[](1);
        require(msg.value < 2 ** 96, "too much value sent");
        nativeTokenWrapper.deposit{value: msg.value}();
        sellAmounts[0] = uint96(msg.value);
        {
            return
                easyAuction.placeSellOrdersOnBehalf(
                    auctionId,
                    _minBuyAmounts,
                    sellAmounts,
                    _prevSellOrders,
                    msg.sender,
                    referralCode
                );
        }
    }
}
