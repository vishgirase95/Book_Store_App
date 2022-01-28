import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { Console } from 'winston/lib/winston/transports';

/**
 * Middleware to authenticate if user has a valid Authorization token
 * Authorization: Bearer <token>
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */

export const userAuth = (user) => {
  return async (req, res, next) => {
    try {
      let bearerToken = req.header('Authorization');
      if (!bearerToken)
        throw {
          code: HttpStatus.BAD_REQUEST,
          message: 'Authorization token is required'
        };
      bearerToken = bearerToken.split(' ')[1];
      const decoded = jwt.decode(bearerToken);
       req.body['USER_ID']=decoded.ID;
      const TokenVerification = jwt.verify(bearerToken, 'vishal');
      console.log("user..",decoded.Role)
      if (decoded.Role === user) {
        next();
      }else{
        next(Error("User Acess Denied"));
      }
    } catch (error) {
      next(error);
    }
  };
};
