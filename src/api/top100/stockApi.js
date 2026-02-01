import { STOCK_API_ENDPOINTS } from './serviceKeys';

export const getTopGainers = (basDt) => {
    const rows = 200;
    const FltRt = 5;
    const targetDate = basDt || new Date(Date.now() - 86400000).toISOString().slice(0, 10).replace(/-/g, '');
    console.log(targetDate);
    return `${STOCK_API_ENDPOINTS.GET_PRICE_INFO}&numOfRows=${rows}&beginFltRt=${FltRt}&basDt=${targetDate}&resultType=json`;
};
