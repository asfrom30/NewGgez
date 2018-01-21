import kr from './lang/kr.json';
import en from './lang/en.json';
import cn from './lang/cn.json';

const lang = {
    kr : kr,
    en : en,
    cn : cn,
}

export function i18nDateIndex() {
    return function (inputIndex, langIndex) {
        langIndex = langIndex || 'kr';
        const i18n = lang[langIndex];
        const result = i18n['dateIndex'][inputIndex];
        if(result == undefined) return inputIndex;
        else return result;
    }
}

export function i18nStatIndex() {
    return function (inputIndex, langIndex) {
        langIndex = langIndex || 'kr';
        const i18n = lang[langIndex];
        const result = i18n['statIndex'][inputIndex];
        if(result == undefined) return inputIndex;
        else return result;
    }
}

export function i18nTierIndex() {
    return function (inputIndex, langIndex) {
        langIndex = langIndex || 'kr';
        const i18n = lang[langIndex];
        const result = i18n['tierIndex'][inputIndex];
        if(result == undefined) return inputIndex;
        else return result;
    }
}