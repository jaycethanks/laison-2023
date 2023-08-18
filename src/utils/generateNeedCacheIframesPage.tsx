import { defineComponent, ref } from 'vue';
import type { RouteMeta } from 'vue-router';
import type { AppRouteRecordRaw } from '@/router/routes/types';

interface RouteMetaExt extends RouteMeta {
  _path?: string
}

const generateIframePage = (records: AppRouteRecordRaw[]) => {
  return defineComponent({
    props: {
      name: {
        type: String,
      },
    },
    setup(props) {
      // const { t } = useI18n();
      const iframe = ref<HTMLIFrameElement | null>(null);
      // onMounted(() => {
      //   if (iframe.value && iframe.value.contentWindow) {
      //     const contentDocument = iframe.value.contentWindow.document;
      //     const bodyElement = contentDocument.body;
      //     const contentHeight = bodyElement.scrollHeight;

      //     console.log('Content Height:', contentHeight);
      //   }
      // });
      return () => (
        <div class="iframes-cached-page" style={{ overflow: 'hidden' }}>
          {
            records.map((record) => {
              const meta = record.meta as RouteMetaExt;
              const { _path } = meta;
              return <iframe v-show={props.name} ref={iframe} style={{ height: '100vh', width: '100%' }} src={_path} frameborder="0"></iframe>;
            })
          }
        </div>
      );
    },
  });
};

export default generateIframePage;
