export const isValueString = (value: string | number) => {
    if (Number.isNaN(Number(value))) {
        return true;
    }
    return false;
};
