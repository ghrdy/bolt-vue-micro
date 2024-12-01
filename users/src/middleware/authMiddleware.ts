import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, verifyRefreshToken, generateTokens, generateCookieOptions } from '../services/TokenService';

interface AuthRequest extends Request {
  user?: any;
}

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    // Verify access token
    const decoded = verifyAccessToken(accessToken);
    if (decoded) {
      req.user = decoded;
      next();
      return;
    }

    // If access token is invalid, try refresh token
    const refreshDecoded = verifyRefreshToken(refreshToken);
    if (!refreshDecoded) {
      res.status(401).json({ message: 'Invalid refresh token' });
      return;
    }

    // Generate new tokens
    const tokens = generateTokens(refreshDecoded.id, refreshDecoded.role);

    // Set new cookies
    res.cookie('accessToken', tokens.accessToken, generateCookieOptions(new Date(Date.now() + 15 * 60 * 1000)));
    res.cookie('refreshToken', tokens.refreshToken, generateCookieOptions(new Date(Date.now() + 2 * 60 * 60 * 1000)));

    req.user = refreshDecoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

export default authMiddleware;