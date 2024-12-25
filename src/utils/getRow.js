import {get, isBoolean, isNil, isNumber} from 'lodash-es';

export function getRow(data, path, defaultValue = '', parseFun) {
    const value = get(data, path);
    if (!isNil(value) && parseFun)
        return fmt(parseFun(value), defaultValue);
    return fmt(value, defaultValue);
}

function fmt(v, defaultValue) {
    if (isNumber(v) || isBoolean(v))
        return v;
    return v || defaultValue;
}
