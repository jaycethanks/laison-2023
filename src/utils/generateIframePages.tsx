import { Transition, defineComponent, ref } from 'vue';
import { type RouteMeta, useRoute } from 'vue-router';
import type { AppRouteRecordRaw } from '@/router/routes/types';

interface RouteMetaExt extends RouteMeta {
  _path?: string
}

const Iframes = (records: AppRouteRecordRaw[]) => {
  return defineComponent({
    name: 'Iframes',
    setup() {
      // const { t } = useI18n();
      const iframe = ref<HTMLIFrameElement | null>(null);
      return () => (
        <div class="iframes-cached-page" style={{ overflow: 'hidden' }}>
          {
            records.map((record) => {
              const meta = record.meta as RouteMetaExt;
              const { _path } = meta;
              return <div>
                {/* bugfix: 解构会丢失响应性从而导致query变化，页面不刷新 */}
                <Transition name="fade" mode="out-in">
                  <iframe v-show={useRoute().query.name === record.name} ref={iframe} style={{ height: '100vh', width: '100%' }} src={_path} frameborder="0"></iframe>
                </Transition>
              </div>;
            })
          }
        </div>
      );
    },
  });
};

export default Iframes;
