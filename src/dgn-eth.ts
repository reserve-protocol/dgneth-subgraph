import { Address } from "@graphprotocol/graph-ts";
import { Transfer as TransferEvent } from "../generated/dgnETH/dgnETH";
import { decreaseAmount, increaseAmount, tokenSupply } from "../utils/amount";
import { recordDailyTokenSupply } from "../utils/dailySupply";

export function handleTransfer(event: TransferEvent): void {
  const isMint = event.params.from == Address.zero();
  const isBurn = event.params.to == Address.zero();

  if (isMint) {
    increaseAmount(
      tokenSupply,
      event.params.value.toBigDecimal(),
      event.block.timestamp
    );
    recordDailyTokenSupply();
  }

  if (isBurn) {
    decreaseAmount(
      tokenSupply,
      event.params.value.toBigDecimal(),
      event.block.timestamp
    );
    recordDailyTokenSupply();
  }
}
