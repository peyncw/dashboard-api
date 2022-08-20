import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../errors/http.error';
import { IMiddleware } from './middleware.inteface';

export class GuardMiddleware implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.user) {
			next();
		} else {
			return next(new HTTPError(401, 'user is not authorized', 'guard'));
		}
	}
}
