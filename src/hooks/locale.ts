import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { message as Message } from 'ant-design-vue';

export default function useLocale() {
  const i18 = useI18n();
  const currentLocale = computed(() => {
    return i18.locale.value;
  });
  const changeLocale = ({ key }: string) => {
    console.log('[value]: ', value);
    if (i18.locale.value === value) {
      return;
    }
    i18.locale.value = value;
    localStorage.setItem('laison-locale', value);
    Message.success(i18.t('navbar.action.locale'));
  };
  return {
    currentLocale,
    changeLocale,
  };
}
