const jwt = require('jsonwebtoken');
const User = require('../models/UserModel.js');
const user = new User({_id: 'testUserId'});
const requireAuth = require('../middleware/requireAuth');
const token = jwt.sign({ _id: user._id }, 'fianncemesecretjwt');

describe('requireAuth middleware', () => {
  it('should return 401 if authorization token is missing', async () => {
    const req = {
      headers: {}
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await requireAuth(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Authorization token required' });
  });

  it('should return 401 if authorization token is invalid', async () => {
    const req = {
      headers: {
        authorization: 'Bearer invalidToken'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await requireAuth(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Request is not authorized' });
  });

  it('should set req.user and call next if authorization token is valid', async () => {
    const user = {
      _id: 'testUserId'
    };

    const token = jwt.sign({ _id: user._id }, process.env.SECRET = 'fianncemesecretjwt');

    const req = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };

    const res = {};
    const next = jest.fn();

    User.findOne = jest.fn().mockResolvedValue(user);

    await requireAuth(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ _id: user._id });
    expect(req.user).toBe(user);
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if user is not found', async () => {
    const user = {
      _id: 'testUserId'
    };

    const token = jwt.sign({ _id: user._id }, process.env.SECRET = 'fianncemesecretjwt');

    const req = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    User.findOne = jest.fn().mockResolvedValue(null);

    await requireAuth(req, res, jest.fn());

    expect(User.findOne).toHaveBeenCalledWith({ _id: user._id });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Request is not authorized' });
  });
});