import knex from '@database';
// import User from '@models/User';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';

interface User {
  id: number;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export default class UsersController {
  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    try {
      const foundUser = await knex<User>('users').where({ email }).first();

      if (!foundUser) {
        return res
          .status(403)
          .json({ message: 'Usuário e/ou senha incorretos' });
      }

      const isMatched = await bcrypt.compare(password, foundUser.password);
      if (!isMatched) {
        return res
          .status(403)
          .json({ message: 'Usuário e/ou senha incorretos' });
      }

      return res.json(foundUser);
    } catch (error) {
      next(error);
    }
  }
}
