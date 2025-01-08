// const AWS = require('aws-sdk');
// const { s3Upload } = require('../utils/storage');
// const keys = require('../config/keys');

// // Mock AWS S3
// jest.mock('aws-sdk', () => {
//   const S3 = {
//     upload: jest.fn().mockReturnThis(),
//     promise: jest.fn(),
//   };
//   return { S3: jest.fn(() => S3) };
// });

// describe('s3Upload', () => {
//   it('should return empty strings if AWS keys are missing', async () => {
//     const originalKeys = { ...keys.aws };
//     keys.aws.accessKeyId = null;

//     const result = await s3Upload(null);

//     expect(result).toEqual({ imageUrl: '', imageKey: '' });

//     keys.aws.accessKeyId = originalKeys.accessKeyId; 
//   });

//   it('should return image URL and key if upload is successful', async () => {
//     const mockS3UploadResponse = {
//       Location: 'https://mock-s3.amazonaws.com/image.jpg',
//       key: 'image.jpg',
//     };
//     AWS.S3.prototype.upload().promise.mockResolvedValueOnce(mockS3UploadResponse);

//     const image = {
//       originalname: 'image.jpg',
//       buffer: Buffer.from('mock data'),
//       mimetype: 'image/jpeg',
//     };

//     const result = await s3Upload(image);

//     expect(result).toEqual({
//       imageUrl: mockS3UploadResponse.Location,
//       imageKey: mockS3UploadResponse.key,
//     });
//   });

//   it('should return empty strings if upload fails', async () => {
//     AWS.S3.prototype.upload().promise.mockRejectedValueOnce(new Error('Upload failed'));

//     const image = {
//       originalname: 'image.jpg',
//       buffer: Buffer.from('mock data'),
//       mimetype: 'image/jpeg',
//     };

//     const result = await s3Upload(image);

//     expect(result).toEqual({ imageUrl: '', imageKey: '' });
//   });
// });
