import colorize from 'json-colorizer';

const log = (payload: any) => console.log(colorize(payload, { pretty: true }));

export default log;
