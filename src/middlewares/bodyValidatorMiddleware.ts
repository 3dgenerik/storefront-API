import { NextFunction, Request, RequestHandler, Response } from 'express';
import { CustomError } from '../errors/customError';
import { IBodyValidator, TCategory, TStatus, categories, statuses} from '../interface';
import { isValueString } from '../utils/isValueString';



const checkTypeLiteral = (typeLiteral: typeof categories | typeof statuses, maybeItemName: string):TCategory | TStatus=>{

    const items = typeLiteral.find((item: string)=>{
        return item === maybeItemName
    })

    if(items){
        return items
    }
        throw new CustomError(`Bad request. Status must be ${[...typeLiteral].join(' | ')}.`, 400)
}


const stringOrNumberThrowError = (
    key: keyof IBodyValidator,
    body: IBodyValidator,
    isString: boolean,
) => {

    
    const keySplit = key.split('_');
    const keyValue = keySplit.length >= 2 ? keySplit.join(' ') : keySplit;
    
    const bodyValue = body[key];
    
    if (key === 'status') {
        if(bodyValue)
            checkTypeLiteral(statuses, bodyValue as string)
    }

    if (key === 'category') {
        if(bodyValue)
            checkTypeLiteral(categories, bodyValue as string)
    }

    // if (key === 'status') {
        // if (
        //     bodyValue !== undefined &&
        //     bodyValue !== 'active' &&
        //     bodyValue !== 'complete'
        // ) {
        //     throw new CustomError(
        //         `Bad request. Status must be 'active' or 'complete'.`,
        //         400,
        //     );
        // }
    // }


    if (bodyValue) {
        if (!isValueString(bodyValue) && isString) {
            throw new CustomError(
                `Bad request. ${keyValue} must be string. Please provide correct ${keyValue}`,
                400,
            );
        } else if (isValueString(bodyValue) && !isString)
            throw new CustomError(
                `Bad request. ${keyValue} must be number. Please provide correct ${keyValue}`,
                400,
            );
    }

    if (key === 'password') {
        const passwordLengthLimit = 4;
        const passwordLength = bodyValue?.toString().length || 0;
        if (passwordLength < passwordLengthLimit) {
            throw new CustomError(
                `Bad request. Password must contain minimum ${passwordLengthLimit} characters.`,
                400,
            );
        }
    }
};

export const bodyValidatorMiddleware = (...keys: string[]): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body as IBodyValidator;
            const invalidKeys: string[] = [];

            for (const key of keys) {
                const bodyKey = body[key as keyof IBodyValidator];
                if (!bodyKey) {
                    invalidKeys.push(key);
                }
            }

            if (invalidKeys.length > 0)
                throw new CustomError(
                    `Bad request. Invalid values: ${[...invalidKeys].join(
                        ', ',
                    )}. Please provide correct values.`,
                    400,
                );

            for (const key of keys) {
                switch (key) {
                    case 'first_name':
                        stringOrNumberThrowError(key, body, true);
                        break;
                    case 'last_name':
                        stringOrNumberThrowError(key, body, true);
                        break;
                    case 'password':
                        stringOrNumberThrowError(key, body, true);
                        break;
                    case 'name':
                        stringOrNumberThrowError(key, body, true);
                        break;
                    case 'price':
                        stringOrNumberThrowError(key, body, false);
                        break;
                    case 'category':
                        stringOrNumberThrowError(key, body, true);
                        break;
                    case 'status':
                        stringOrNumberThrowError(key, body, true);
                        break;
                    case 'quantity':
                        stringOrNumberThrowError(key, body, false);
                        break;
                    case 'product_id':
                        stringOrNumberThrowError(key, body, false);
                        break;
                    case 'order_id':
                        stringOrNumberThrowError(key, body, false);
                        break;
                    default:
                }
            }

            next();
        } catch (err) {
            if (err instanceof CustomError) next(err);
            next(new CustomError(`${err}`, 500));
        }
    };
};
