const { check } = require('../middleware/role');

describe('Role Middleware Unit Test', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  it('should return 401 if user is not authenticated', () => {
    const middleware = check('Admin', 'User');

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Unauthorized');
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if user does not have the required role', () => {
    req.user = { role: 'Guest' }; // Mock user with a role not allowed
    const middleware = check('Admin', 'User');

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith(
      'You are not allowed to make this request.'
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next() if user has the required role', () => {
    req.user = { role: 'Admin' }; // Mock user with an allowed role
    const middleware = check('Admin', 'User');

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
});
