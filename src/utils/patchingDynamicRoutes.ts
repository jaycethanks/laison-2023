import { type RouteMeta, type RouteRecordNormalized } from 'vue-router';
import { cloneDeep } from 'lodash';
import walk from './traverse';
import generateIframePage from './generateIframePage';
import generateIframePages from './generateIframePages';
import { appRoutes } from '@/router/routes';
import type { AppRouteRecordRaw } from '@/router/routes/types';
import router from '@/router';
import { regexUrl } from '@/utils';
import { DEFAULT_LAYOUT, PAGE_LAYOUT } from '@/router/routes/base';

const filterNotExistRoutes = (
  localRoutes: RouteRecordNormalized[],
  serveMenuList: RouteRecordNormalized[],
) => {
  const localRoutesPath = localRoutes.map(it => it.path);
  return serveMenuList.filter(({ path }) => {
    return !localRoutesPath.includes(path);
  });
};

const isIframeLink = (path: string, meta: RouteMeta) => {
  return regexUrl.test(path) && !meta?.external;
};

const patchingDynamicRoutes = (serveMenuList: RouteRecordNormalized[]) => {
  // 过滤本地没有的路由
  const preDynamicRoutes = filterNotExistRoutes(
    appRoutes,
    cloneDeep(serveMenuList),
  );
  const needCacheIframePages: AppRouteRecordRaw[] = [];

  walk<RouteRecordNormalized>(
    (item, _index, _arr, deep) => {
      const { children, meta, name, path } = item;
      const _meta = {
        ...meta,
        ...(isIframeLink(path, meta) ? { _path: path } : {}),
      };
      const record: AppRouteRecordRaw = {
        /**
         * 1. 判断递归的层级， 如果是在第一层,那么使用 DEFAULT_LAYOUT 这个 router-view, 否则， 使用一个最简单的 Routerview, 这么做的目的是为了 fix 多层 layout 嵌套
         * 2. 如果 路由 指定的 path 是一个 链接,且没有被标记为 external (!meta.external === true),那么判定为 iframe 那么使用其 name 属性覆盖 path, 将 path 指定到 meta._path
         * 3. 有childen ? component 就是 layout , 否则， 动态生成 iframe 页面
         */
        component: (() => {
          if (children) {
            if (deep === 1) {
              // 有 children 子属性, 且所在层级为第一层 用 DEFAULT_LAYOUT 这个 router-view
              return DEFAULT_LAYOUT;
            }
            else {
              // 有 children 子属性, 但不再地一层级， 用 basic-router-view
              return PAGE_LAYOUT;
            }
          }
          else {
            // 没有 children 子属性, 说明是一个渲染页
            // ! 这里， 如果后续要支持动态配置菜单， 那么这里应该是一个 全量引入的 本地 component map, 然后用 path 匹配映射路径去动态引入对应的组件
            return isIframeLink(path, meta) ? generateIframePage(_meta) : null;
          }
        })(),
        path: isIframeLink(path, meta) ? ((name || 'noname') as any) : path,
        meta: _meta,
        name,
        children: children as AppRouteRecordRaw[],
      };

      if (isIframeLink(path, meta) && !meta.ignoreCache) {
        // 1.针对递归的每一个路由进行判断， 是否存在需要缓存的路由, 将所有需要缓存的路由摘取出来，生成一份 v-show 集合页面
        // 2.是 iframe 链接 + 要求缓存
        needCacheIframePages.push(record);
      }

      (_arr[_index] as unknown as AppRouteRecordRaw) = record;
    },
    preDynamicRoutes,
    'children',
  );

  preDynamicRoutes.forEach((it) => {
    router.addRoute(it);
  });

  const iframes = generateIframePages(needCacheIframePages);
  router.addRoute({
    path: '/iframeView',
    name: 'iframeView',
    component: DEFAULT_LAYOUT,
    children: [
      {
        path: 'iframes',
        name: 'iframes',
        component: iframes,
        // props: true, // https://router.vuejs.org/guide/essentials/passing-props.html
      },
    ],
  });
};

export default patchingDynamicRoutes;

/**
 * ! 这里把所有的从serve端拉取的路由表都作为 iframe page 处理是不对的，如果后续允许在前端配置动态生成路由，
 * ! 应该新增对普通非 iframe 页面的支持(component: children ? _ : 这个分支)，通过 import.mate.glob 去预加载所有本地路由模块
 * ! 现阶段， 在没有支持这一特性的时候， 如果需要配置本地路由， 应该在  src/router/routes/modules 中去定义本地路由模块
 */
