<template>
  <Layout class="layout" :class="{ mobile: appStore.hideMenu }">
    <NavBar v-if="navbar" />
    <Layout>
      <LayoutSider
        v-if="renderMenu"
        v-show="!hideMenu"
        :trigger="null"
        class="layout-sider"
        breakpoint="xl"
        :collapsed="collapsed"
        :collapsible="true"
        :collapsed-width="48"
        :width="menuWidth"
        :style="layoutSiderStyles"
        :hide-trigger="true"
        @collapse="setCollapsed"
      >
        <Menu />
        <div class="trigger-wrapper">
          <a-button v-if="collapsed" size="small" @click="setCollapsed(false)">
            <menu-unfold-outlined />
          </a-button>
          <a-button v-else size="small" @click="setCollapsed(true)">
            <menu-fold-outlined />
          </a-button>
        </div>
      </LayoutSider>
      <a-drawer
        v-if="hideMenu"
        :visible="drawerVisible"
        placement="left"
        :footer="false"
        mask-closable
        :closable="false"
        @cancel="drawerCancel"
      >
        <Menu />
      </a-drawer>
      <Layout class="layout-content" :style="layoutContentStyles">
        <TabBar v-if="appStore.tabBar" />
        <LayoutContent>
          <PageLayout />
        </LayoutContent>
        <Footer v-if="footer" />
      </Layout>
    </Layout>
  </Layout>
</template>

<script lang="ts" setup>
import { Layout, LayoutContent, LayoutSider, theme as antdTheme } from 'ant-design-vue';
import { computed, onMounted, provide, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PageLayout from './page-layout.vue';
import { useAppStore, useUserStore } from '@/store';
import NavBar from '@/components/navbar/index.vue';
import Menu from '@/components/menu/index.vue';
import Footer from '@/components/footer/index.vue';
import TabBar from '@/components/tab-bar/index.vue';
import usePermission from '@/hooks/permission';
import useResponsive from '@/hooks/responsive';

const isInit = ref(false);
const appStore = useAppStore();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const permission = usePermission();
useResponsive(true);
const navbarHeight = '60px';

// const { isDark } = useThemes();
const { token } = antdTheme.useToken();

const navbar = computed(() => appStore.navbar);
const renderMenu = computed(() => appStore.menu && !appStore.topMenu);
const hideMenu = computed(() => appStore.hideMenu);
const footer = computed(() => appStore.footer);
const menuWidth = computed(() => {
  return appStore.menuCollapse ? 48 : appStore.menuWidth;
});
const collapsed = computed(() => {
  return appStore.menuCollapse;
});

const layoutSiderStyles = computed(() => {
  const colors = { backgroundColor: token.value.colorBgContainer };
  const layout = { paddingTop: navbar.value ? '60px' : '' };
  return { ...colors, ...layout };
});

const layoutContentStyles = computed(() => {
  const paddingLeft
      = renderMenu.value && !hideMenu.value
        ? { paddingLeft: `${menuWidth.value}px` }
        : {};
  const paddingTop = navbar.value ? { paddingTop: navbarHeight } : {};
  // @jayce: 需要修改颜色， 去  src/App.vue 提供 provider 配置， 不要写死
  const background = { backgroundColor: token.value.colorBgLayout };
  return { ...paddingLeft, ...paddingTop, ...background };
});
const setCollapsed = (val: boolean) => {
  if (!isInit.value) return; // for page initialization menu state problem
  appStore.updateSettings({ menuCollapse: val });
};
watch(
  () => userStore.role,
  (roleValue) => {
    if (roleValue && !permission.accessRouter(route)) {
      router.push({ name: 'notFound' });
    }
  },
);
const drawerVisible = ref(false);
const drawerCancel = () => {
  drawerVisible.value = false;
};
provide('toggleDrawerMenu', () => {
  drawerVisible.value = !drawerVisible.value;
});
onMounted(() => {
  isInit.value = true;
});
</script>

<style scoped lang="less">
  @nav-size-height: 60px;
  @layout-max-width: 1100px;

  .layout {
    width: 100%;
    height: 100%;

  }

  .layout-sider {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    height: 100%;
    transition: all 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
    &::after {
      position: absolute;
      top: 0;
      right: -1px;
      display: block;
      width: 1px;
      height: 100%;
      background-color: var(--color-border);
      content: '';
    }

    > :deep(.arco-layout-sider-children) {
      overflow-y: hidden;
    }

    .trigger-wrapper {
      position: absolute;
      bottom: 0;
      right: 0;
      padding: .6em;
    }

  }

  .layout-content {
    min-height: 100vh;
    overflow-y: hidden;
    transition: padding 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
  }
</style>
