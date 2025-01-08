const Merchant = require('../models/merchant');
const { MERCHANT_STATUS } = require('../constants/index');
const mongoose = require('mongoose');

describe('Merchant Model', () => {
  it('should create a merchant with default status', async () => {
    const merchant = new Merchant({
      name: 'Test Merchant',
      email: 'merchant@example.com',
    });

    const savedMerchant = await merchant.save();

    expect(savedMerchant.status).toBe(MERCHANT_STATUS.Waiting_Approval);
    expect(savedMerchant.isActive).toBe(false);
    expect(savedMerchant.created).toBeDefined();
  });

  it('should pass validation even if fields are missing', async () => {
    const merchant = new Merchant({}); 
  
    const error = await merchant.validate();
    expect(error).toBeUndefined(); 
  });
  
});
