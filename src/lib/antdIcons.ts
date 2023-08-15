import type { App } from 'vue';
import * as antIcons from '@ant-design/icons-vue';

// 引入ant icons
// 全局使用图标，遍历引入

export default {
  install: (app: App<any>) => {
    for (const i in antIcons) {
      app.component(i, (antIcons as any)[i]);
    }
  },
};
