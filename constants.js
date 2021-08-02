import moment from "https://cdn.jsdelivr.net/npm/moment@2.29.1/dist/moment.js";

const symbols = [
    'AMZN',
    'AAPL',
    'ETH',
    'BTC',
    'USD'
];
moment.locale('en');
const months = moment.monthsShort();

export { symbols, months };