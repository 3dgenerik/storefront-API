import { CustomError } from '../../errors/customError';
import { TCategory, TStatus, categories, statuses } from '../../interface';

export const checkTypeLiteral = (
    typeLiteral: typeof categories | typeof statuses,
    maybeItemName: string,
    type: string,
): TCategory | TStatus => {
    const items = typeLiteral.find((item: string) => {
        return item === maybeItemName;
    });

    if (items) {
        return items;
    }
    throw new CustomError(
        `Bad request. ${type} must be ${[...typeLiteral].join(' | ')}.`,
        400,
    );
};
