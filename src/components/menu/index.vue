<script lang="tsx">
  import { compile, computed, defineComponent, h, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import type { RouteMeta, RouteRecordRaw } from 'vue-router';
  import useMenuTree from './use-menu-tree';
  import { useAppStore } from '@/store';
  import { listenerRouteChange } from '@/utils/route-listener';
  import { openWindow, regexUrl } from '@/utils';

  export default defineComponent({
    emit: ['collapse'],
    setup() {
      const { t } = useI18n();
      const appStore = useAppStore();
      const router = useRouter();
      const route = useRoute();
      const { menuTree } = useMenuTree();
      const collapsed = computed({
        get() {
          if (appStore.device === 'desktop') return appStore.menuCollapse;
          return false;
        },
        set(value: boolean) {
          appStore.updateSettings({ menuCollapse: value });
        },
      });
      const topMenu = computed(() => appStore.topMenu);
      const openKeys = ref<string[]>([]);
      const selectedKey = ref<string[]>([]);
      // const { isDark } = useThemes();
      // const { token } = antdTheme.useToken();

      const goto = (item: RouteRecordRaw) => {
        // 要求缓存 + 是一个 url 链接 + 且不是外链 => 缓存的 iframe 页面
        if (
          !item.meta?.ignoreCache
          && regexUrl.test(item.path)
          && !item.meta?.external
        ) {
          // @jayce: 注意这里的逻辑应该在最前面
          selectedKey.value = [item.name as string];
          router.push({
            path: '/iframeView/iframes',
            query: { name: item?.name as string, locale: item?.meta?.locale },
          });
          return;
        }

        // Open external link
        if (regexUrl.test(item.path) && item.meta?.external) {
          openWindow(item.path);
          selectedKey.value = [item.name as string];
          return;
        }

        // Eliminate external link side effects
        const { hideInMenu, activeMenu } = item.meta as RouteMeta;
        if (route.name === item.name && !hideInMenu && !activeMenu) {
          selectedKey.value = [item.name as string];
          return;
        }
        // Trigger router change
        router.push({
          name: item.name,
        });
      };
      const findMenuOpenKeys = (target: string) => {
        const result: string[] = [];
        let isFind = false;
        const backtrack = (item: RouteRecordRaw, keys: string[]) => {
          if (item.name === target) {
            isFind = true;
            result.push(...keys);
            return;
          }
          if (item.children?.length) {
            item.children.forEach((el) => {
              backtrack(el, [...keys, el.name as string]);
            });
          }
        };
        menuTree.value.forEach((el: RouteRecordRaw) => {
          if (isFind) return; // Performance optimization
          backtrack(el, [el.name as string]);
        });
        return result;
      };
      listenerRouteChange((newRoute) => {
        const { requiresAuth, activeMenu, hideInMenu } = newRoute.meta;
        if (requiresAuth && (!hideInMenu || activeMenu)) {
          // if (requiresAuth && (!hideInMenu || activeMenu)) {
          const menuOpenKeys = findMenuOpenKeys(
            (activeMenu || newRoute.name) as string,
          );
          console.log('[menuOpenKeys]: ', menuOpenKeys);

          const keySet = new Set([...menuOpenKeys, ...openKeys.value]);
          openKeys.value = [...keySet];

          selectedKey.value = [
            activeMenu || menuOpenKeys[menuOpenKeys.length - 1],
          ];
        }
      }, true);
      const setCollapse = (val: boolean) => {
        if (appStore.device === 'desktop') {
          appStore.updateSettings({ menuCollapse: val });
        }
      };
      const renderSubMenu = () => {
        function travel(_route: RouteRecordRaw[], nodes = []) {
          if (_route) {
            _route.forEach((element) => {
              // This is demo, modify nodes as needed
              const icon = element?.meta?.icon
                ? () => h(compile(`<${element?.meta?.icon}/>`))
                : null;
              const node
                = element?.children && element?.children.length !== 0
                  ? (
                  <a-sub-menu
                    key={element?.name}
                    v-slots={{
                      icon,
                      title: () => h(compile(t(element?.meta?.locale || ''))),
                    }}
                  >
                    {travel(element?.children)}
                  </a-sub-menu>
                    )
                  : (
                  <a-menu-item
                    style={{
                      backgroundColor: 'transparent',
                      borderRadius: '100px 0 0 100px',
                    }}
                    key={element?.name}
                    v-slots={{ icon }}
                    onClick={() => goto(element)}
                  >
                    {t(element?.meta?.locale || '')}
                  </a-menu-item>
                    );
              nodes.push(node as never);
            });
          }
          return nodes;
        }
        return travel(menuTree.value);
      };

      return () => (
        <a-menu
          style={{
            backgroundColor: 'transparent',
            height: '100%',
            width: '100%',
          }}
          mode={topMenu.value ? 'vertical' : 'inline'}
          v-model:collapsed={collapsed.value}
          v-model:selectedKeys={openKeys.value}
          show-collapse-button={appStore.device !== 'mobile'}
          auto-open={false}
          selected-keys={selectedKey.value}
          auto-open-selected={true}
          level-indent={34}
          selectable
          onCollapse={setCollapse}
        >
          {renderSubMenu()}
        </a-menu>
      );
    },
  });
</script>

<style lang="less" scoped>
  :deep(.ant-menu-item.ant-menu-item-selected) {
    background-color: #fff !important;
  }
  body[laison-theme='dark'] {
     :deep(.ant-menu-item.ant-menu-item-selected) {
      background-color: #000 !important;
    }
  }
</style>
