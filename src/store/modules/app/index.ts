import { defineStore } from 'pinia';
import { notification as Notification } from 'ant-design-vue';
import type { RouteRecordNormalized } from 'vue-router';
import type { AppState } from './types';
import defaultSettings from '@/config/settings.json';
import { getMenuList } from '@/api/user';
import patchingDynamicRoutes from '@/utils/patchingDynamicRoutes';

const useAppStore = defineStore('app', {
  state: (): AppState => ({ ...defaultSettings }),

  getters: {
    appCurrentSetting(state: AppState): AppState {
      return { ...state };
    },
    appDevice(state: AppState) {
      return state.device;
    },
    appAsyncMenus(state: AppState): RouteRecordNormalized[] {
      return state.serverMenu as unknown as RouteRecordNormalized[];
    },
  },

  actions: {
    // Update app settings
    updateSettings(partial: Partial<AppState>) {
      // @ts-expect-error-next-line
      this.$patch(partial);
    },

    // Change theme color
    toggleTheme(dark: boolean) {
      if (dark) {
        this.theme = 'dark';
        document.body.setAttribute('laison-theme', 'dark');
      }
      else {
        this.theme = 'light';
        document.body.removeAttribute('laison-theme');
      }
    },
    toggleDevice(device: string) {
      this.device = device;
    },
    toggleMenu(value: boolean) {
      this.hideMenu = value;
    },
    async fetchServerMenuConfig() {
      try {
        Notification.info({
          key: 'menuNotice', // Keep the instance id the same
          description: 'loading',
          message: 'loading',
        });
        const { data } = await getMenuList();
        this.serverMenu = data;

        // @jayce 解析服务端返回的路由表，生成动态路由
        patchingDynamicRoutes(data);

        Notification.success({
          key: 'menuNotice',
          description: 'success',
          message: 'success',
        });
      }
      catch (error) {
        Notification.error({
          key: 'menuNotice',
          description: 'error',
          message: 'error',
        });
      }
    },
    clearServerMenu() {
      this.serverMenu = [];
    },
  },
});

export default useAppStore;
