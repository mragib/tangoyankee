export enum AddressType {
  BILLING = 'billing',
  SHIPPING = 'shipping',
}

export enum CouponType {
  FIXED_COUPON = 'fixed',
  PERCENTAGE_COUPON = 'percentage',
  FREE_SHIPPING_COUPON = 'free_shipping',
}

export enum PaymentGatewayType {
  STRIPE = 'stripe',
  CASH_ON_DELIVERY = 'cod',
}
export enum ProductStatus {
  PUBLISH = 'publish',
  DRAFT = 'draft',
}

export enum ProductType {
  SIMPLE = 'simple',
  VARIABLE = 'variable',
}

export enum RefundStatus {
  APPROVED = 'Approved',
  PENDING = 'Pending',
  REJECTED = 'Rejected',
  PROCESSING = 'Processing',
}

export enum WithdrawStatus {
  APPROVED = 'Approved',
  PENDING = 'Pending',
  ON_HOLD = 'On hold',
  REJECTED = 'Rejected',
  PROCESSING = 'Processing',
}

export enum ShippingType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
  FREE = 'free',
}

export enum QueryUsersOrderByColumn {
  NAME = 'name',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
  IS_ACTIVE = 'IS_ACTIVE',
}
