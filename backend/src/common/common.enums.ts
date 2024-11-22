export enum PaymentMethodType {
  digitalWallet = 'digital-wallet',
  InHand = 'in-hand',
  Bank = 'bank',
}

export enum DeliveryStatus {
  OrderReceived = 'Order Received',
  Processing = 'Processing',
  Packed = 'Packed',
  Shipped = 'Shipped',
  InTransit = 'In Transit',
  OutforDelivery = 'Out for Delivery',
  Delivered = 'Delivered',
  AttemptedDelivery = 'Attempted Delivery',
  AwaitingPickup = 'Awaiting Pickup',
  Cancelled = 'Cancelled',
  Returned = 'Returned',
  Refunded = 'Refunded',
}

export enum AccountType {
  Asset = 'Asset',
  Liability = 'Liability',
  Equity = 'Equity',
  Revenue = 'Revenue',
  Expense = 'Expense',
}

export enum TransactionType {
  TRANSFER = 'TRANSFER',
  WITHDRAW = 'WITHDRAW',
  DEPOSIT = 'DEPOSIT',
  PURCHASE = 'PURCHASE',
  SALE = 'SALE',
  PAYMENT = 'PAYMENT',
  RECEIPT = 'RECEIPT',
  ADJUSTMENT = 'ADJUSTMENT',
  OPENING_BALANCE = 'OPENING_BALANCE',
  CLOSING_BALANCE = 'CLOSING_BALANCE',
  REFUND = 'REFUND',
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
  REVERSAL = 'REVERSAL',
}

export enum DeliveryAction {
  PURCHASE = 'PURCHASE',
  SALE = 'SALE',
}
