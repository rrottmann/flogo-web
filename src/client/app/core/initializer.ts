import { TranslateService } from 'ng2-translate';

export function initializer(translateService: TranslateService) {
  return () => {
    const defaultLanguage = 'en';
    translateService.setDefaultLang(defaultLanguage);
    const userLang = translateService.getBrowserLang();
    if (userLang && userLang !== defaultLanguage) {
      return translateService.use(userLang).toPromise();
    } else {
      return Promise.resolve();
    }
  };
}
