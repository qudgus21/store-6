import jwt from 'express-jwt';
import { Request } from 'express';
import config from '@/config';

const getTokenFromHeader = (req: Request) => {
  const { authorization } = req.headers;
  if (
    authorization &&
    (authorization.startsWith('Bearer') || authorization.startsWith('Token'))
  ) {
    return authorization.split(' ')[1];
  }
  return null;
};

const isAuth = jwt({
  secret: config.jwt.secret,
  algorithms: [config.jwt.algorithm],
  userProperty: 'token',
  getToken: getTokenFromHeader,
});

export default isAuth;
