
const globalLogFlag = true;
const devLogFlag = (process.env.NODE_ENV == 'development') ? true : false;

export default {
    FLAG : globalLogFlag && devLogFlag,
    
}