const Order = require('../models/order');

describe('Order Model', () => {
  it('should create an order with default total and created date', async () => {
    const order = new Order({
      total: 500,
    });

    const savedOrder = await order.save();

    expect(savedOrder.total).toBe(500);
    expect(savedOrder.created).toBeDefined();
  });

  it('should pass validation even if fields are missing', async () => {
    const order = new Order({});
    const error = await order.validate(); 
    expect(error).toBeUndefined(); 
  });
  
});
