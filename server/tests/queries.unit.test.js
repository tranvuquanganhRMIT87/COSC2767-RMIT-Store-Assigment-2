const { getStoreProductsQuery, getStoreProductsWishListQuery } = require('../utils/queries');

describe('Queries Utility Functions', () => {
  describe('getStoreProductsQuery', () => {
    it('should generate a query with price and rating filters', () => {
      const min = 100;
      const max = 500;
      const rating = 4;

      const query = getStoreProductsQuery(min, max, rating);

      expect(query).toBeInstanceOf(Array);
      expect(query).toHaveLength(9); 
      expect(query).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ $lookup: expect.any(Object) }),
          expect.objectContaining({ $match: expect.any(Object) }),
          expect.objectContaining({ $addFields: expect.any(Object) }),
        ])
      );
    });
  });

  describe('getStoreProductsWishListQuery', () => {
    it('should generate a query for a specific user', () => {
      const userId = '507f1f77bcf86cd799439011';

      const query = getStoreProductsWishListQuery(userId);

      expect(query).toBeInstanceOf(Array);
      expect(query).toHaveLength(2); 
      expect(query).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ $lookup: expect.any(Object) }),
          expect.objectContaining({ $addFields: expect.any(Object) }),
        ])
      );

      const lookupStage = query.find(stage => stage.$lookup);
      expect(lookupStage.$lookup.from).toBe('wishlists');
      expect(lookupStage.$lookup.let).toHaveProperty('product', '$_id');
    });

    it('should include the $addFields stage for isLiked', () => {
      const userId = '507f1f77bcf86cd799439011';

      const query = getStoreProductsWishListQuery(userId);

      const addFieldsStage = query.find(stage => stage.$addFields);
      expect(addFieldsStage).toBeDefined();
      expect(addFieldsStage.$addFields).toHaveProperty('isLiked');
    });
  });
});
