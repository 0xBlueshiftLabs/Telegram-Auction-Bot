/* eslint-disable prefer-const */
import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";

import { BIG_DECIMAL_ZERO, BIG_INT_ONE, BIG_INT_ZERO } from "const";
import { ERC20 } from "../../generated/LendingFactory/ERC20";
import { ERC20NameBytes } from "../../generated/LendingFactory/ERC20NameBytes";
import { ERC20SymbolBytes } from "../../generated/LendingFactory/ERC20SymbolBytes";
import { User } from "../../generated/schema";

export class Order {
  _userId: string;
  _buyAmount: BigInt;
  _sellAmount: BigInt;

  constructor(_userId: string, _buyAmount: BigInt, _sellAmount: BigInt) {
    this._userId = _userId;
    this._buyAmount = _buyAmount;
    this._sellAmount = _sellAmount;
  }

  get userId(): string {
    return this._userId;
  }

  get buyAmount(): BigInt {
    return this._buyAmount;
  }

  get sellAmount(): BigInt {
    return this._sellAmount;
  }
}

// rebass tokens, dont count in tracked volume
export let UNTRACKED_PAIRS: string[] = [""];

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString("1");
  for (
    let i = BIG_INT_ZERO;
    i.lt(decimals as BigInt);
    i = i.plus(BIG_INT_ONE)
  ) {
    bd = bd.times(BigDecimal.fromString("10"));
  }
  return bd;
}

export function bigDecimalExp18(): BigDecimal {
  return BigDecimal.fromString("1000000000000000000");
}

export function convertEthToDecimal(eth: BigInt): BigDecimal {
  return eth.toBigDecimal().div(exponentToBigDecimal(new BigInt(18)));
}

export function convertTokenToDecimal(
  tokenAmount: BigInt,
  exchangeDecimals: BigInt
): BigDecimal {
  if (exchangeDecimals == BIG_INT_ZERO) {
    return tokenAmount.toBigDecimal();
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals));
}

export function equalToZero(value: BigDecimal): boolean {
  const formattedVal = parseFloat(value.toString());
  const zero = parseFloat(BIG_DECIMAL_ZERO.toString());
  if (zero == formattedVal) {
    return true;
  }
  return false;
}

export function isNullEthValue(value: string): boolean {
  return (
    value ==
    "0x0000000000000000000000000000000000000000000000000000000000000001"
  );
}

export function fetchTokenSymbol(tokenAddress: Address): string {
  // static definitions overrides
  // let staticDefinition = TokenDefinition.fromAddress(tokenAddress);
  // if (staticDefinition != null) {
  //   return staticDefinition.symbol;
  // }

  let contract = ERC20.bind(tokenAddress);
  let contractSymbolBytes = ERC20SymbolBytes.bind(tokenAddress);

  // try types string and bytes32 for symbol
  let symbolValue = "unknown";
  let symbolResult = contract.try_symbol();
  if (symbolResult.reverted) {
    let symbolResultBytes = contractSymbolBytes.try_symbol();
    if (!symbolResultBytes.reverted) {
      // for broken pairs that have no symbol function exposed
      if (!isNullEthValue(symbolResultBytes.value.toString())) {
        symbolValue = symbolResultBytes.value.toString();
      }
    }
  } else {
    symbolValue = symbolResult.value;
  }

  return symbolValue;
}

export function fetchTokenName(tokenAddress: Address): string {
  // static definitions overrides
  // let staticDefinition = TokenDefinition.fromAddress(tokenAddress);
  // if (staticDefinition != null) {
  //   return (staticDefinition as TokenDefinition).name;
  // }

  let contract = ERC20.bind(tokenAddress);
  let contractNameBytes = ERC20NameBytes.bind(tokenAddress);

  // try types string and bytes32 for name
  let nameValue = "unknown";
  let nameResult = contract.try_name();
  if (nameResult.reverted) {
    let nameResultBytes = contractNameBytes.try_name();
    if (!nameResultBytes.reverted) {
      // for broken exchanges that have no name function exposed
      if (!isNullEthValue(nameResultBytes.value.toHexString())) {
        nameValue = nameResultBytes.value.toString();
      }
    }
  } else {
    nameValue = nameResult.value;
  }

  return nameValue;
}

export function fetchTokenTotalSupply(tokenAddress: Address): BigInt {
  let contract = ERC20.bind(tokenAddress);
  let totalSupplyResult = contract.try_totalSupply();
  if (!totalSupplyResult.reverted) {
    return totalSupplyResult.value;
  }
  return BIG_INT_ZERO;
}

export function fetchTokenDecimals(tokenAddress: Address): BigInt {
  // static definitions overrides
  // let staticDefinition = TokenDefinition.fromAddress(tokenAddress);
  // if (staticDefinition != null) {
  //   return (staticDefinition as TokenDefinition).decimals;
  // }

  let contract = ERC20.bind(tokenAddress);
  // try types uint8 for decimals
  let decimalResult = contract.try_decimals();
  if (!decimalResult.reverted) {
    return BigInt.fromI32(decimalResult.value);
  }
  return BIG_INT_ZERO;
}

export function getOrCreateUser(address: Address): User {
  let user = User.load(address.toHexString());
  if (user === null) {
    user = new User(address.toHexString());
    user.usdSwapped = BIG_DECIMAL_ZERO;
    user.stakedCreditAllocation = BIG_INT_ZERO;
    user.save();
  }
  return user;
}

export function equalTo(orderLeft: Order, orderRight: Order): boolean {
  return (
    orderLeft.userId === orderRight.userId &&
    orderLeft.buyAmount.equals(orderRight.buyAmount) &&
    orderLeft.sellAmount.equals(orderRight.sellAmount)
  );
}

export function smallerThan(orderLeft: Order, orderRight: Order): boolean {
  if (
    orderLeft.buyAmount.times(orderRight.sellAmount) <
    orderRight.buyAmount.times(orderLeft.sellAmount)
  )
    return true;
  if (
    orderLeft.buyAmount.times(orderRight.sellAmount) >
    orderRight.buyAmount.times(orderLeft.sellAmount)
  )
    return false;

  if (orderLeft.buyAmount < orderRight.buyAmount) return true;
  if (orderLeft.buyAmount > orderRight.buyAmount) return false;
  if (orderLeft.userId < orderRight.userId) {
    return true;
  }
  return false;
}
