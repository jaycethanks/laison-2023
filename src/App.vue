<template>
  <a-config-provider
    :locale="locale"
    :theme="{
      algorithm: isDark ? theme.darkAlgorithm : null,
      token: {
        colorPrimary: '#FA541C',
      },
    }"
  >
    <router-view />
    <GlobalSetting />
  </a-config-provider>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { theme } from 'ant-design-vue';
import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import useThemes from '@/hooks/themes';
import GlobalSetting from '@/components/global-setting/index.vue';
import useLocale from '@/hooks/locale';

const { isDark } = useThemes();

const { currentLocale } = useLocale();
const locale = computed(() => {
  switch (currentLocale.value) {
    case 'zh-CN':
      return zhCN;
    case 'en-US':
      return enUS;
    default:
      return enUS;
  }
});
</script>
