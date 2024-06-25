import { BigInt } from "@graphprotocol/graph-ts";
import { DailyStakeTokenSupply, DailyTokenSupply } from "../generated/schema";
import { getAmount, stakeTokenSupply, tokenSupply } from "./amount";

export function getOpenTime(timestamp: BigInt, interval: BigInt): BigInt {
  let excess = timestamp.mod(interval);
  return timestamp.minus(excess);
}

export function getDayOpenTime(timestamp: BigInt): BigInt {
  let day = BigInt.fromI32(86400);
  return getOpenTime(timestamp, day);
}

export function recordDailyTokenSupply(): void {
  let supply = getAmount(tokenSupply);

  let dailyTokenSupply = new DailyTokenSupply(
    getDayOpenTime(supply.updatedAt).toString()
  );

  dailyTokenSupply.amount = supply.amount;
  dailyTokenSupply.date = supply.updatedAt;
  dailyTokenSupply.save();
}

export function recordDailyStakeTokenSupply(): void {
  let supply = getAmount(stakeTokenSupply);

  let dailyStakeTokenSupply = new DailyStakeTokenSupply(
    getDayOpenTime(supply.updatedAt).toString()
  );

  dailyStakeTokenSupply.amount = supply.amount;
  dailyStakeTokenSupply.date = supply.updatedAt;
  dailyStakeTokenSupply.save();
}
