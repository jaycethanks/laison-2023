import type { RouteRecordName, RouteRecordNormalized, Router } from 'vue-router';

import NProgress from 'nprogress'; // progress bar

import { appRoutes } from '../routes';
import { NOT_FOUND, WHITE_LIST } from '../constants';
import usePermission from '@/hooks/permission';
import { useAppStore, useUserStore } from '@/store';

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const appStore = useAppStore();
    const userStore = useUserStore();
    const Permission = usePermission();
    const permissionsAllow = Permission.accessRouter(to);
    if (appStore.menuFromServer) {
      // 针对来自服务端的菜单配置进行处理
      // Handle routing configuration from the server
      // 根据需要自行完善来源于服务端的菜单配置的permission逻辑
      // Refine the permission logic from the server's menu configuration as needed

      if (!appStore.appAsyncMenus.length) {
        await appStore.fetchServerMenuConfig();
        router.replace({ path: to.path });
      }

      // if (
      //   !appStore.appAsyncMenus.length
      //   && !WHITE_LIST.find(el => el.name === to.name)
      // ) {
      //   await appStore.fetchServerMenuConfig();
      // }

      /**
       * todo: 如果是 cacheIframePages 这个路由，则直接放行 (注意权限的控制受不受影响，如果有影响，就去标记为 mete.cache 的路由上重定向到这个路由)
       */
      if (to.name && (['cacheIframePages', 'combinedPages'] as RouteRecordName[]).includes(to.name)) {
        next();
      }

      const serverMenuConfig = [...appStore.appAsyncMenus, ...WHITE_LIST];

      let exist = false;
      while (serverMenuConfig.length && !exist) {
        const element = serverMenuConfig.shift();
        if (element?.name === to.name) exist = true;

        if (element?.children) {
          serverMenuConfig.push(
            ...(element.children as unknown as RouteRecordNormalized[]),
          );
        }
      }

      if (exist && permissionsAllow) {
        next();
      }
      else {
        next(NOT_FOUND);
      }
    }
    else {
      if (permissionsAllow) next();
      else {
        const destination
          = Permission.findFirstPermissionRoute(appRoutes, userStore.role)
          || NOT_FOUND;
        next(destination);
      }
    }
    NProgress.done();
  });
}
