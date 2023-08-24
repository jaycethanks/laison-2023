<template>
  <Layout class="layout" :class="{ mobile: appStore.hideMenu }">
    <LayoutSider
      v-if="renderMenu"
      v-show="!hideMenu"
      :trigger="null"
      class="layout-sider"
      breakpoint="xl"
      :collapsed="collapsed"
      :collapsible="true"
      :collapsed-width="menuWidth"
      :width="menuWidth"
      :style="layoutSiderStyles"
      :hide-trigger="true"
    >
      <Menu />
      <!-- <div class="trigger-wrapper">
        <a-button v-if="collapsed" size="small" @click="setCollapsed(false)">
          <menu-unfold-outlined />
        </a-button>
        <a-button v-else size="small" @click="setCollapsed(true)">
          <menu-fold-outlined />
        </a-button>
      </div> -->
      <menuCollapseSwitcher />
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
      <NavBar
        v-if="navbar"
        :offset="offset"
        :nav-height="navHeight"
      />
      <TabBar v-if="appStore.tabBar" :offset="offset" :nav-height="navHeight" />
      <LayoutContent :style="{ paddingTop: `${navbar ? navHeight : 0}px` }">
        <PageLayout />
      </LayoutContent>
      <Footer v-if="footer" />
    </Layout>
  </Layout>
</template>

<script lang="ts" setup>
import { Layout, LayoutContent, LayoutSider, theme as antdTheme } from 'ant-design-vue';
import { computed, provide, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PageLayout from './page-layout.vue';
import { useAppStore, useUserStore } from '@/store';
import NavBar from '@/components/navbar/index.vue';
import Menu from '@/components/menu/index.vue';
import Footer from '@/components/footer/index.vue';
import TabBar from '@/components/tab-bar/index.vue';
import menuCollapseSwitcher from '@/components/menuCollapseSwitcher/index.vue';
import usePermission from '@/hooks/permission';
import useResponsive from '@/hooks/responsive';
import useThemes from '@/hooks/themes';

const appStore = useAppStore();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const permission = usePermission();
useResponsive(true);

const { isDark } = useThemes();
const { token } = antdTheme.useToken();
const navbar = computed(() => appStore.navbar);
const renderMenu = computed(() => appStore.menu && !appStore.topMenu);
const hideMenu = computed(() => appStore.hideMenu);
const footer = computed(() => appStore.footer);

const navHeight = ref(60);
const offset = ref(28);
const menuWidth = computed(() => {
  return appStore.menuCollapse ? 100 : appStore.menuWidth;
});
const collapsed = computed(() => {
  return appStore.menuCollapse;
});

const layoutSiderStyles = computed(() => {
  const colors = { backgroundImage: `linear-gradient(0deg, ${isDark.value ? '#2c2348' : '#7B6AB5'}, ${isDark.value ? '#091f58' : '#5A85EE'}` };
  // const colors = { backgroundColor: token.value.colorBgContainer };
  const layout = { paddingTop: 0 };
  return { ...colors, ...layout };
});

const layoutContentStyles = computed(() => {
  const paddingLeft
      = renderMenu.value && !hideMenu.value
        ? { left: `${menuWidth.value - offset.value}px` }
        : {};
  // @jayce: 需要修改颜色， 去  src/App.vue 提供 provider 配置， 不要写死
  const background = { backgroundColor: token.value.colorBgLayout };
  const border = { borderRadius: '30px 0 0 30px' };
  return { ...paddingLeft, ...background, ...border };
});

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
    // z-index: 99;
    height: 100%;
    padding-right: 18px;
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

  }

  .layout-content {
    overflow: hidden;
    min-height: 100vh;
    position: absolute;
    inset: 0;
    width: auto!important;
    transition: left 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
  }
</style>
