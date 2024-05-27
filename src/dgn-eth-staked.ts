import { Address } from "@graphprotocol/graph-ts"
import {
  Deposit as DepositEvent,
  RewardDistributionUpdated as RewardDistributionUpdatedEvent,
  Transfer as TransferEvent,
  Withdraw as WithdrawEvent,
  dgnETHStaked
} from "../generated/dgnETHStaked/dgnETHStaked"
import {
  Deposit,
  RewardDistributionUpdated,
  Transfer,
  Withdraw
} from "../generated/schema"

export function handleDeposit(event: DepositEvent): void {
  let entity = new Deposit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender = event.params.sender
  entity.owner = event.params.owner
  entity.assets = event.params.assets
  entity.shares = event.params.shares

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRewardDistributionUpdated(
  event: RewardDistributionUpdatedEvent
): void {
  let entity = new RewardDistributionUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.periodStart = event.params.periodStart
  entity.periodEnd = event.params.periodEnd
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  const isMint = event.params.from == Address.zero()
  const isBurn = event.params.to == Address.zero()

  // If it's not a mint or burn, treat it as a deposit and withdrawal
  if (!isMint && !isBurn) {
    let contract = dgnETHStaked.bind(event.address)
    let assets = contract.convertToAssets(event.params.value)
    
    let depositEntity = new Deposit(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    depositEntity.sender = event.params.from
    depositEntity.owner = event.params.to
    depositEntity.assets = assets
    depositEntity.shares = event.params.value

    depositEntity.blockNumber = event.block.number
    depositEntity.blockTimestamp = event.block.timestamp
    depositEntity.transactionHash = event.transaction.hash

    depositEntity.save()

    let withdrawEntity = new Withdraw(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    withdrawEntity.sender = event.params.to
    withdrawEntity.owner = event.params.from
    withdrawEntity.assets = assets
    withdrawEntity.shares = event.params.value

    withdrawEntity.blockNumber = event.block.number
    withdrawEntity.blockTimestamp = event.block.timestamp
    withdrawEntity.transactionHash = event.transaction.hash

    withdrawEntity.save()
  }
}

export function handleWithdraw(event: WithdrawEvent): void {
  let entity = new Withdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender = event.params.sender
  entity.receiver = event.params.receiver
  entity.owner = event.params.owner
  entity.assets = event.params.assets
  entity.shares = event.params.shares

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
