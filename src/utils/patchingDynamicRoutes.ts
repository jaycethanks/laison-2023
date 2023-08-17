import type { RouteMeta, RouteRecordNormalized } from 'vue-router';
import { cloneDeep } from 'lodash';
import walk from './traverse';
import { appRoutes } from '@/router/routes';
import { DEFAULT_LAYOUT } from '@/router/routes/base';
import type { AppRouteRecordRaw } from '@/router/routes/types';
import router from '@/router';
import { regexUrl } from '@/utils';
import IframePage from '@/components/IframePage/index.vue';

const filterNotExistRoutes = (localRoutes: RouteRecordNormalized[], serveMenuList: RouteRecordNormalized[]) => {
  const localRoutesPath = localRoutes.map(it => it.path);
  return serveMenuList.filter(({ path }) => {
    return !localRoutesPath.includes(path);
  });
};

const isIframeLink = (path: string, meta: RouteMeta) => {
  return (regexUrl.test(path) && !meta?.external);
};

const patchingDynamicRoutes = (serveMenuList: RouteRecordNormalized[]) => {
  // 过滤本地没有的路由

  const preDynamicRoutes = filterNotExistRoutes(appRoutes, cloneDeep(serveMenuList));
  walk<RouteRecordNormalized>((item, _index, _arr) => {
    const { children, meta, name, path } = item;
    const record: AppRouteRecordRaw = {
      component: children ? DEFAULT_LAYOUT : IframePage,
      path: isIframeLink(path, meta) ? (name || 'noname') as any : path,
      meta: { ...meta, _path: path },
      name,
      children: children as AppRouteRecordRaw[],
    };

    (_arr[_index] as unknown as AppRouteRecordRaw) = record;
  }, preDynamicRoutes, 'children');

  preDynamicRoutes.forEach((it) => {
    router.addRoute(it);
  });
  console.log('[router.getRoutes()]: ', router.getRoutes());
};

export default patchingDynamicRoutes;
