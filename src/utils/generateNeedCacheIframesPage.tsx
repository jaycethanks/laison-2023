import { defineComponent, reactive, ref } from 'vue';
import { type RouteMeta, useRoute } from 'vue-router';
import type { AppRouteRecordRaw } from '@/router/routes/types';

interface RouteMetaExt extends RouteMeta {
  _path?: string
}

const generateIframePage = (records: AppRouteRecordRaw[]) => {
  return defineComponent({
    name: 'CachePage',
    props: {
      name: {
        type: String,
      },
    },
    setup(props) {
      // const { t } = useI18n();
      const state = reactive({
        count: 0,
      });
      const { query } = useRoute();
      const { name } = query;
      console.log('[query]: ', query);
      const iframe = ref<HTMLIFrameElement | null>(null);
      return () => (
        <div class="iframes-cached-page" style={{ overflow: 'hidden' }}>
          <button onClick={() => { state.count++; }}>{state.count}</button>
          {
            records.map((record) => {
              const meta = record.meta as RouteMetaExt;
              const { _path } = meta
              ;
              return <div>
              <iframe v-show={name === record.name} ref={iframe} style={{ height: '100vh', width: '100%' }} src={_path} frameborder="0"></iframe>
              </div>;
            })
          }
        </div>
      );
    },
  });
};

export default generateIframePage;
