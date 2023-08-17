import { type RouteMeta, type RouteRecordNormalized, RouterView } from 'vue-router';
import { cloneDeep } from 'lodash';
import walk from './traverse';
import generateIframePage from './generateIframePage';
import { appRoutes } from '@/router/routes';
import type { AppRouteRecordRaw } from '@/router/routes/types';
import router from '@/router';
import { regexUrl } from '@/utils';
import { DEFAULT_LAYOUT } from '@/router/routes/base';

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

  walk<RouteRecordNormalized>((item, _index, _arr, deep) => {
    const { children, meta, name, path } = item;
    const _meta = { ...meta, ...(isIframeLink(path, meta) ? { _path: path } : {}) };
    const record: AppRouteRecordRaw = {
      /**
       * 1. 判断递归的层级， 如果是在第一层,那么使用 DEFAULT_LAYOUT 这个 router-view, 否则， 使用一个最简单的 Routerview, 这么做的目的是为了 fix 多层 layout 嵌套
       * 2. 如果 路由 指定的 path 是一个 iframe 链接 (!meta.external === true), 那么使用其 name 属性覆盖 path, 将 path 指定到 meta._path
       */
      component: children
        ? deep === 1 ? DEFAULT_LAYOUT : RouterView
        : generateIframePage(_meta),
      path: isIframeLink(path, meta) ? (name || 'noname') as any : path,
      meta: _meta,
      name,
      children: children as AppRouteRecordRaw[],
    };

    (_arr[_index] as unknown as AppRouteRecordRaw) = record;
  }, preDynamicRoutes, 'children');

  preDynamicRoutes.forEach((it) => {
    router.addRoute(it);
  });
};

export default patchingDynamicRoutes;

/**
 * ! 这里把所有的从serve端拉取的路由表都作为 iframe page 处理是不对的，如果后续允许在前端配置动态生成路由，
 * ! 应该新增对普通非 iframe 页面的支持(component: children ? _ : 这个分支)，通过 import.mate.glob 去预加载所有本地路由模块
 * ! 现阶段， 在没有支持这一新特性的时候， 如果需要配置本地路由， 应该在  src/router/routes/modules 中去定义本地路由模块
 */
