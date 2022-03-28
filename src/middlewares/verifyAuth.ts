import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/auth';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function verifyAuth(req: Request, res: Response, next: NextFunction): void {
  // Validacao do token

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new Error('Está faltando o token JWT');
  }

  // Bearer Token

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as TokenPayload;

    req.headers.userId = sub

    return next();
  } catch {
    throw new Error('Token JWT inválido');
  }

}
