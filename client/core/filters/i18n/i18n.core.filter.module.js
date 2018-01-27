import kr from './lang/kr.json';
import en from './lang/en.json';
import cn from './lang/cn.json';
import { isString } from 'util';

const lang = {
    kr : kr,
    en : en,
    cn : cn,
}

export function i18nDenominatorIndex() {
    return function (inputIndex, langIndex) {
        langIndex = langIndex || 'kr';
        const i18n = lang[langIndex];
        const result = i18n['denominatorIndex'][inputIndex];
        if(result == undefined) return inputIndex;
        else return result;
    }
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
        if(isString(langIndex)) {
            if(inputIndex.includes("_per_death")) {
                const index = inputIndex.indexOf("_per_death");
                inputIndex = inputIndex.substring(0, index);
            } else if(inputIndex.includes("_per_game")) {
                const index = inputIndex.indexOf("_per_game");
                inputIndex = inputIndex.substring(0, index);
            }
        }
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