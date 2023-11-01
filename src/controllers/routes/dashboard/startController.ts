import { Request, Response } from 'express';
import { controller, get } from '../../decorators';
import { AppRoutePath } from '../../../constants';

@controller(AppRoutePath.ROOT)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class StartController {
    @get('/')
    start(req: Request, res: Response) {
        res.send(`
            <div>
                <h3>Please use README file for instructions.</h3>
            </div>
        `);
    }
}
