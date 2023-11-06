import { ICreatedUserOutput, IUser } from '../../interface';
import { AppRoutePath } from '../../constants';
import { request } from './getRequest';

const userAlreadyExist: IUser = {
    first_name: 'Petar',
    last_name: 'Stojanovic',
    password: 'petar',
};

export const getToken = async (): Promise<string> => {
    const result = await request
        .post(
            `${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/signin`,
        )
        .send(userAlreadyExist);

    const body = (await result.body) as ICreatedUserOutput;
    return body.output.token;
};
