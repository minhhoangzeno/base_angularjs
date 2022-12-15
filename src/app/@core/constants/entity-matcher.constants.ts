export enum EntityMatcherProperties {
  BRAND = 'brands',
  CATEGORY = 'category',
  CHANNEL = 'channel',
  CITY = 'city',
  CUSTOMER_REF = 'ref',
  COUNTRY = 'country',
  PRODUCT_ID = 'productId',
  PRODUCT_RANGE = 'productRange',
  REGION = 'region',
  SUB_CATEGORY = 'subCategory',
  SUB_CHANNEL = 'subChannel',
  KEY_ACCOUNT = 'keyAccount',
  SHIP_TO = 'shipTo',
}

/**
 * Lookup table of valid column groupings as key and it's proper label name as value.
 *
 * Check out the `entity-matcher` module for the list of valid keys.
 */
export const MATCHER_LABELS_LOOKUP: { [key in EntityMatcherProperties]: string } = {
  [EntityMatcherProperties.BRAND]: 'Brands',
  [EntityMatcherProperties.CATEGORY]: 'Category',
  [EntityMatcherProperties.CHANNEL]: 'Channel',
  [EntityMatcherProperties.CITY]: 'City',
  [EntityMatcherProperties.COUNTRY]: 'Country',
  [EntityMatcherProperties.CUSTOMER_REF]: 'Customer Ref',
  [EntityMatcherProperties.PRODUCT_ID]: 'Product ID',
  [EntityMatcherProperties.PRODUCT_RANGE]: 'Product Range',
  [EntityMatcherProperties.REGION]: 'Region',
  [EntityMatcherProperties.SUB_CATEGORY]: 'Sub Category',
  [EntityMatcherProperties.SUB_CHANNEL]: 'Sub Channel',
  [EntityMatcherProperties.KEY_ACCOUNT]: 'Key Account',
  [EntityMatcherProperties.SHIP_TO]: 'Ship To',
};

/** TS property name to MongoDB column lookup. */
export const PROP_TO_COLUMN_LOOKUP: { [key in EntityMatcherProperties]: string } = {
  [EntityMatcherProperties.BRAND]: 'Product.Brands',
  [EntityMatcherProperties.CATEGORY]: 'Product.Category',
  [EntityMatcherProperties.CHANNEL]: 'Customer.Channel',
  [EntityMatcherProperties.CITY]: 'Customer.City',
  [EntityMatcherProperties.COUNTRY]: 'Customer.Country',
  [EntityMatcherProperties.CUSTOMER_REF]: 'Customer.Ref',
  [EntityMatcherProperties.PRODUCT_RANGE]: 'Product.ProductRange',
  [EntityMatcherProperties.PRODUCT_ID]: 'Product.ProductID',
  [EntityMatcherProperties.REGION]: 'Customer.Region',
  [EntityMatcherProperties.SUB_CATEGORY]: 'Product.SubCategory',
  [EntityMatcherProperties.SUB_CHANNEL]: 'Customer.SubChannel',
  [EntityMatcherProperties.KEY_ACCOUNT]: 'Customer.KeyAccount',
  [EntityMatcherProperties.SHIP_TO]: 'Customer.ShipTo',
};
