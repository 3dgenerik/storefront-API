import { Request, Response } from 'express';
import { controller, get } from '../../decorators';
import { AppRoutePath } from '../../../constants';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
@controller(AppRoutePath.ROOT)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class StartController {
    @get('/')
    start(req: Request, res: Response) {
        res.send('Please use README file for instructions.');
    }
}
