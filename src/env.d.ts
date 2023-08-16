/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}


// https://router.vuejs.org/zh/guide/advanced/meta.html#TypeScript

import 'vue-router'
declare module 'vue-router' {
  interface RouteMeta {
    // 是否为外部链接 (要不要使用 window.open 打开这个链接 ？)
    external?: boolean
  }
}