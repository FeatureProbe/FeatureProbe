import { useCallback, useEffect, useRef } from 'react';
import { FieldErrors } from 'react-hook-form';
import { createContainer } from 'unstated-next';
import { useLocalStorage } from 'utils/hooks';

export const useI18N = () => {
  const localLanguage = navigator.language.toLocaleLowerCase().slice(0, 2);
  const defaultLanguage = localLanguage === 'zh' ? 'zh-CN' : 'en-US';
  const [i18n, setI18n] = useLocalStorage('i18n', defaultLanguage);

  return {
    i18n,
    setI18n,
  };
};

export const I18NContainer = createContainer(useI18N);

export const useRequestTimeCheck = () => {
  const requestTimes = useRef(new Map());

  const creatRequestTimeCheck = useCallback((key: string) => {
    const requestTime = Date.now();
    requestTimes.current.set(key, requestTime);

    const check = () => {
      return requestTimes.current.get(key) === requestTime;
    };

    return check;
  }, [requestTimes]);

  return creatRequestTimeCheck;
};

export const useFormErrorScrollIntoView = (errors?: FieldErrors) => {
  const errorRef = useRef(errors);
  const beforeScroll = useRef<(names: string[]) => void>();

  useEffect(() => {
    errorRef.current = errors;
  }, [errors]);

  const scrollToError = useCallback(() => {
    if(errorRef.current) {
      const names = Object.keys(errorRef.current);
      if(beforeScroll.current) {
        beforeScroll.current(names);
      }
      setTimeout(() => {
        document.querySelector(`[name=${names[0]}]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }, [errorRef]);

  const registerErrorName = useCallback((name: string) => {
    return {
      ref: (ref: unknown) => {
        (ref as HTMLElement)?.setAttribute('name', name);
      }
    };
  }, []);

  const setBeforeScrollCallback = useCallback((fc: (names: string[]) => void) => {
    beforeScroll.current = fc;
  }, [beforeScroll]);

  return {
    scrollToError,
    registerErrorName,
    setBeforeScrollCallback,
  };
};