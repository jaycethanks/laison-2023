import type { RouteRecordNormalized, RouteRecordRaw } from 'vue-router';

// 定义路由配置的类型
// interface RouteNode {
//   path: string;
//   name: string;
//   children?: RouteNode[];
//   // 添加其他需要的路由属性
// }
type RouteNode = Pick<RouteRecordNormalized, 'path' | 'name' | 'children'>;

let map = new Map();
// 递归函数用于构建树结构
function buildTree(routes: RouteRecordRaw[], parentPath = ''): RouteRecordRaw[] {
  // const tree: RouteNode[] = [];
  // routes.forEach(route => {
  //   const fullPath = `${parentPath}/${route.path}`.replace(/\/+/g, '/');
  //   const node: RouteNode = {
  //     path: fullPath,
  //     name: route.name!,
  //     children:[]
  //   };
  //   if (route.children && route.children.length > 0) {
  //     node.children = buildTree(route.children, fullPath);
  //   }

  //   tree.push(node);
  // });
  // return tree;
  const cloneRoutes = JSON.parse(JSON.stringify(routes)) as Array<RouteRecordRaw | null>;

  cloneRoutes.forEach((route,index) => {
    if (route) {
      const { name, path, children } = route;
      // 1. 对于每一项扁平的 路由, 对于没有 children 的路由, 只有两种可能: 根路由/某个嵌套路由的最后端点
      // 2. 对于每一项扁平的 路由, 如果不属于其他项的 children-item, 那么一定是根路由
      if (!children?.length) {
        cloneRoutes.forEach((_route, _index) => {
          if (_route) {
            const hasParent = _route.children?.findIndex((it) => it.name === name);
            if (hasParent !== -1) {
              // 当前路由在其他路由项children中存在
              // 将当前路由项设为 null
              cloneRoutes.splice(index, 1, null);
            }
          }
        });
      }
    }
  });
  
  return cloneRoutes.filter(it=>it !== null) as RouteRecordRaw[]
}

export default buildTree;
