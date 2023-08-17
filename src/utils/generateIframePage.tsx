import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import type { RouteMeta } from 'vue-router';

interface RouteMetaExt extends RouteMeta {
  _path?: string
}

const generateIframePage = (_meta: RouteMetaExt) => {
  const { _path, locale, icon } = _meta;
  return defineComponent({
    setup() {
      const { t } = useI18n();
      return () => (
        <div>
          {/* <h1>{t(locale || '')}</h1> */}
          <iframe style={{ height: '100vh', width: '100%' }} src={_path} frameborder="0"></iframe>
        </div>
      );
    },
  });
};

export default generateIframePage;
