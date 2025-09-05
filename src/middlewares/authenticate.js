import createHttpError from "http-errors";
import SessionsCollection from "../models/session.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(createHttpError(401, "Authorization header missing"));
    }

    // Bearer <token> formatında olmalı
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      return next(createHttpError(401, "Invalid Authorization format"));
    }

    // Session içinde access token var mı kontrol et
    const session = await SessionsCollection.findOne({ accessToken: token });
    if (!session) {
      return next(createHttpError(401, "Invalid access token"));
    }

    // Token süresi dolmuş mu?
    if (new Date() > session.accessTokenValidUntil) {
      return next(createHttpError(401, "Access token expired"));
    }

    // Kullanıcıyı req.user içine koy
    req.user = {
      id: session.userId,
    };

    next();
  } catch (error) {
    next(error);
  }
};
