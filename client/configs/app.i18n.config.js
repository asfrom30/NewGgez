import translationsEN from '../const/lang/en.translation.const';
import translationsKO from '../const/lang/kr.translation.const';


export default function($translateProvider) {
    
    $translateProvider.translations('en', translationsEN)
    $translateProvider.translations('ko', translationsKO);
    $translateProvider.fallbackLanguage('ko');
    $translateProvider.preferredLanguage('ko');

}