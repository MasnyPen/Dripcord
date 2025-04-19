import i18n from 'i18n';
import {Bot} from "../interfaces/Bot";

export function initI18n(client: Bot, defaultLanguage: string = "en", locales: string[] = ["en"]) {
    i18n.configure({
        locales: locales,
        defaultLocale: defaultLanguage,
        directory: `${process.cwd()}/locales`,
        retryInDefaultLocale: true,
        objectNotation: true,
        register: global,
        logWarnFn: client.getLogger().warn,
        logErrorFn: client.getLogger().error,
        missingKeyFn: (_locale, value) => {
            return value;
        },
        mustacheConfig: {
            tags: ['{', '}'],
            disable: false,
        },
    });

    client.getLogger().info('I18n has been initialized');
}

export { i18n };

export function Translate(locale: string, text: string | i18n.TranslateOptions, ...params: any) {
    i18n.setLocale(locale);
    return i18n.__mf(text, ...params);
}