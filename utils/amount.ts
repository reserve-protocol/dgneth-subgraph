import { Amount } from "../generated/schema";
import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export let tokenSupply = "tokenSupply";
export let stakeTokenSupply = "stakeTokenSupply";

export function getAmount(id: string): Amount {
  let amount = Amount.load(id);

  if (amount != null) {
    return amount;
  }
  amount = new Amount(id);
  amount.amount = BigDecimal.zero();
  amount.updatedAt = BigInt.zero();
  amount.save();

  return amount;
}

export function increaseAmount(
  id: string,
  increase: BigDecimal,
  updatedAt: BigInt
): BigDecimal {
  let amount = Amount.load(id);
  if (amount == null) {
    amount = new Amount(id);
    amount.amount = BigDecimal.zero();
  }

  amount.amount = amount.amount.plus(increase);
  amount.updatedAt = updatedAt;
  amount.save();

  return amount.amount;
}

export function decreaseAmount(
  id: string,
  increase: BigDecimal,
  updatedAt: BigInt
): BigDecimal {
  let amount = Amount.load(id);
  if (amount == null) {
    amount = new Amount(id);
    amount.amount = BigDecimal.zero();
  }

  amount.amount = amount.amount.minus(increase);
  amount.updatedAt = updatedAt;
  amount.save();

  return amount.amount;
}
