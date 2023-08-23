import { defineComponent, ref } from 'vue';
import type { RouteMeta } from 'vue-router';

interface RouteMetaExt extends RouteMeta {
  _path?: string
}

const generateIframePage = (_meta: RouteMetaExt) => {
  const { _path } = _meta;
  return defineComponent({
    setup() {
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
        <div style={{ overflow: 'hidden' }}>
          <iframe ref={iframe} style={{ height: '100vh', width: '100%' }} src={_path} frameborder="0"></iframe>
        </div>
      );
    },
  });
};

export default generateIframePage;
