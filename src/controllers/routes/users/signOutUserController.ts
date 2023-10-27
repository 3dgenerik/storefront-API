import { Request, Response } from 'express';
import { AppRoutePath } from '../../../constants';
import { controller, post } from '../../decorators';

@controller(AppRoutePath.PREFIX_ROUTE)
class SignOutUser {
    @post(`${AppRoutePath.ENDPOINT_USERS}/signout`)
    signOutUser(req: Request, res: Response) {
        if (req.session?.token) {
            req.session.token = undefined;
        }

        res.send('OK');
    }
}
