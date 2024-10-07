import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export const NULL_CALL_RESULT_VALUE =
  "0x0000000000000000000000000000000000000000000000000000000000000001";

export const ADDRESS_ZERO = Address.fromString(
  "0x0000000000000000000000000000000000000000"
);

export const BIG_DECIMAL_1E2 = BigDecimal.fromString("1e2");

export const BIG_DECIMAL_1E6 = BigDecimal.fromString("1e6");

export const BIG_DECIMAL_1E16 = BigDecimal.fromString("1e16");

export const BIG_DECIMAL_1E12 = BigDecimal.fromString("1e12");

export const BIG_DECIMAL_1E18 = BigDecimal.fromString("1e18");

export const BIG_DECIMAL_ZERO = BigDecimal.fromString("0");

export const BIG_DECIMAL_ONE = BigDecimal.fromString("1");

export const BIG_INT_ONE = BigInt.fromI32(1);

export const BIG_INT_TWO = BigInt.fromI32(2);

export const BIG_INT_ONE_HUNDRED = BigInt.fromI32(100);

export const BIG_INT_ONE_DAY_SECONDS = BigInt.fromI32(86400);

export const BIG_INT_ZERO = BigInt.fromI32(0);

export const BIG_INT_18 = BigInt.fromI32(18);

export const ACC_CREDIT_PRECISION = BigInt.fromString(
  BIG_DECIMAL_1E12.toString()
);

export const BIG_INT_1E18 = BigInt.fromString(BIG_DECIMAL_1E18.toString());

export const BIG_INT_1E12 = BigInt.fromString(BIG_DECIMAL_1E12.toString());

export const BIG_INT_1E2 = BigInt.fromString(BIG_DECIMAL_1E2.toString());

export const BIG_INT_1E6 = BigInt.fromString(BIG_DECIMAL_1E6.toString());

export const BIG_INT_1E16 = BigInt.fromString(BIG_DECIMAL_1E16.toString());

////////////////////// ADDRESSES ///////////////////////////



// export const AUCTION_ADDRESS = Address.fromString(
//   "{{ auction.address }}{{^auction.address}}0x0000000000000000000000000000000000000000{{/auction.address}}"
// );

// export const REFERRAL_ADDRESS = Address.fromString(
//   "{{ referral.address }}{{^referral.address}}0x0000000000000000000000000000000000000000{{/referral.address}}"
// );
