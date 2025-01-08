const mongoose = require('mongoose');
const Review = require('../models/review');
const { REVIEW_STATUS } = require('../constants');

describe('Review Model', () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create a review with default values', async () => {
    const review = new Review({
      title: 'Great Product!',
      rating: 5,
      review: 'I loved it.',
    });

    const savedReview = await review.save();

    expect(savedReview.status).toBe(REVIEW_STATUS.Waiting_Approval); 
    expect(savedReview.isRecommended).toBe(true); 
    expect(savedReview.created).toBeDefined(); 
  });

  it('should fail validation if required fields are missing', async () => {
    const review = new Review({});
    await expect(review.validate()).resolves.not.toThrow();
  });
});
