import { Request, Response, NextFunction } from 'express';

type UserReqRes = (req: Request, res: Response, next: NextFunction) => void;

export interface IUserController {
	login: UserReqRes;
	register: UserReqRes;
}
