const {
  disableProducts,
  caculateTaxAmount,
  caculateOrderTotal,
  caculateItemsSalesTax,
  formatOrders,
} = require('../utils/store');
const Product = require('../models/product');
const taxConfig = require('../config/tax');

// Mock dependencies
jest.mock('../models/product');
jest.mock('../config/tax', () => ({
  stateTaxRate: 10, // Mock tax rate for tests
}));

describe('Store Utilities', () => {
  describe('disableProducts', () => {
    it('should call bulkWrite with correct parameters', async () => {
      const mockProducts = [{ _id: '1' }, { _id: '2' }];
      Product.bulkWrite = jest.fn();

      disableProducts(mockProducts);

      expect(Product.bulkWrite).toHaveBeenCalledWith([
        { updateOne: { filter: { _id: '1' }, update: { isActive: false } } },
        { updateOne: { filter: { _id: '2' }, update: { isActive: false } } },
      ]);
    });
  });

  describe('caculateTaxAmount', () => {
    it('should handle orders with no products gracefully', () => {
      const order = { products: [] };

      const updatedOrder = caculateTaxAmount(order);

      expect(updatedOrder.totalTax).toBe(0);
    });
  });

  describe('caculateOrderTotal', () => {
    it('should calculate total price of non-cancelled items', () => {
      const order = {
        products: [
          { totalPrice: 200, status: 'Active' },
          { totalPrice: 100, status: 'Cancelled' },
        ],
      };

      const total = caculateOrderTotal(order);

      expect(total).toBe(200); 
    });
  });

  describe('caculateItemsSalesTax', () => {
    it('should calculate total price, tax, and price with tax for taxable items', () => {
      const items = [
        { price: 100, quantity: 2, taxable: true },
        { price: 50, quantity: 1, taxable: true },
      ];

      const updatedItems = caculateItemsSalesTax(items);

      expect(updatedItems[0].priceWithTax).toBe(2200); // 100 * 2 + tax (2000)
      expect(updatedItems[0].totalTax).toBe(2000); // Tax: 100 * (10/100) * 100 * 2
      expect(updatedItems[1].priceWithTax).toBe(550);
      expect(updatedItems[1].totalTax).toBe(500);
    });
  });

  describe('formatOrders', () => {
    it('should format orders and calculate tax for orders with products', () => {
      const orders = [
        {
          _id: 'order1',
          total: 100,
          created: new Date(),
          cart: {
            products: [
              { purchasePrice: 100, quantity: 1, taxable: true },
            ],
          },
        },
      ];

      const formattedOrders = formatOrders(orders);

      expect(formattedOrders).toHaveLength(1);
      expect(formattedOrders[0].products).toBeDefined();
      expect(formattedOrders[0].products[0].priceWithTax).toBeDefined();
    });

    it('should format orders even if no products are present', () => {
      const orders = [
        {
          _id: 'order2',
          total: 0,
          created: new Date(),
          cart: { products: [] },
        },
      ];

      const formattedOrders = formatOrders(orders);

      expect(formattedOrders).toHaveLength(1);
      expect(formattedOrders[0].products).toEqual([]);
    });
  });
});
