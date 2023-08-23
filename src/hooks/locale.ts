import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { message as Message } from 'ant-design-vue';
import type { SelectInfo } from 'ant-design-vue/es/menu/src/interface';

export default function useLocale() {
  const i18 = useI18n();
  const currentLocale = computed(() => {
    return i18.locale.value;
  });
  const changeLocale = (selected: SelectInfo) => {
    const key = selected.key as string;
    if (i18.locale.value === key) {
      return;
    }
    i18.locale.value = key;
    localStorage.setItem('laison-locale', key);
    Message.success(i18.t('navbar.action.locale'));
  };
  return {
    currentLocale,
    changeLocale,
  };
}
