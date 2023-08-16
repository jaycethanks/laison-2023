import type { App } from 'vue';
import * as antIcons from '@ant-design/icons-vue';

// ant icons 全量引入
export default {
  install: (app: App<any>) => {
    for (const i in antIcons) {
      app.component(i, (antIcons as any)[i]);
    }
  },
};
