import { createApp } from 'vue';

// import ArcoVue from '@arco-design/web-vue';
// import '@arco-design/web-vue/dist/arco.css';
// import ArcoVueIcon from '@arco-design/web-vue/es/icon';
// Styles are imported via arco-plugin. See config/plugin/arcoStyleImport.ts in the directory for details
// 样式通过 arco-plugin 插件导入。详见目录文件 config/plugin/arcoStyleImport.ts
// https://arco.design/docs/designlab/use-theme-package
import Antdv from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './locale';
import directive from './directive';
import globalComponents from '@/components';
import AntdvIconSet from '@/lib/antdIcons';
import './mock';

import '@/assets/style/global.less';
import '@/api/interceptor';

const app = createApp(App);

app.use(Antdv);
// app.use(ArcoVue, {});

// app.use(ArcoVueIcon);
app.use(AntdvIconSet);
app.use(router);
app.use(store);
app.use(i18n);
app.use(globalComponents);
app.use(directive);

app.mount('#app');
