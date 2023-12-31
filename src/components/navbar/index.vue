<template>
  <LayoutHeader :style="layoutHeaderStyles">
    <div class="left-side">
      <!-- <Logo /> -->
      <!-- <a-typography-title :level="5" content="LAI_TECH" /> -->
      <!-- <span style="font-size: 18px;">LAI_TECH</span> -->
      <menuCollapseSwitcher v-if="!topMenu" />
    </div>
    <div class="center-side">
      <Menu v-if="topMenu" />
    </div>
    <a-menu
      :selectable="false"
      class="right-side"
      :style="menuStyles"
      mode="horizontal"
    >
      <a-menu-item>
        <a-tooltip :title="$t('settings.search')">
          <a-button class="nav-btn" type="text" :icon="h(SearchOutlined)">
            <template #icon>
              <SearchOutlined />
            </template>
          </a-button>
        </a-tooltip>
      </a-menu-item>

      <a-menu-item>
        <a-tooltip :title="$t('settings.language')">
          <a-button
            class="nav-btn"
            type="text"
            :icon="h(GlobalOutlined)"
            @click="setDropDownVisible"
          />
        </a-tooltip>
        <a-dropdown trigger="click">
          <div ref="triggerBtn" class="trigger-btn" />
          <template #overlay>
            <a-menu selectable @select="changeLocale as any">
              <a-menu-item v-for="item in locales" :key="item.value">
                <CheckSquareOutlined v-show="item.value === currentLocale" />
                {{ item.label }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-menu-item>
      <a-menu-item
        style="display: flex; justify-content: center; align-items: center"
      >
        <a-tooltip
          :title="
            theme === 'light'
              ? $t('settings.navbar.theme.toDark')
              : $t('settings.navbar.theme.toLight')
          "
        >
          <a-button
            class="nav-btn"
            type="text"
            style="display: flex; justify-content: center; align-items: center"
            @click="handleToggleTheme"
          >
            <template #icon>
              <IconMoonOutlined v-if="theme === 'dark'" />
              <IconSunOutlined v-else />
            </template>
          </a-button>
        </a-tooltip>
      </a-menu-item>
      <a-menu-item>
        <a-tooltip :title="$t('settings.navbar.alerts')">
          <div class="message-box-trigger">
            <a-badge :count="9" dot>
              <a-button
                class="nav-btn"
                type="text"
                :icon="h(BellOutlined)"
                @click="setPopoverVisible"
              />
            </a-badge>
          </div>
        </a-tooltip>
        <a-popover
          trigger="click"
          :arrow-style="{ display: 'none' }"
          :content-style="{ padding: 0, minWidth: '400px' }"
          content-class="message-popover"
        >
          <div ref="refBtn" class="ref-btn" />
          <template #content>
            <MessageBox />
          </template>
        </a-popover>
      </a-menu-item>
      <a-menu-item>
        <a-tooltip
          :title="
            isFullscreen
              ? $t('settings.navbar.screen.toExit')
              : $t('settings.navbar.screen.toFull')
          "
        >
          <a-button
            class="nav-btn"
            type="text"
            :icon="isFullscreen ? h(CompressOutlined) : h(ExpandOutlined)"
            @click="toggleFullScreen"
          />
        </a-tooltip>
      </a-menu-item>
      <a-menu-item>
        <a-tooltip :title="$t('settings.title')">
          <a-button
            class="nav-btn"
            type="text"
            :icon="h(SettingOutlined)"
            @click="setVisible"
          />
        </a-tooltip>
      </a-menu-item>
      <a-menu-item>
        <a-dropdown trigger="click">
          <a-avatar
            :size="32"
            :style="{ marginRight: '8px', cursor: 'pointer' }"
          >
            <img alt="avatar" :src="avatar">
          </a-avatar>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a-space @click="switchRoles">
                  <TagOutlined />
                  <span>
                    {{ $t('messageBox.switchRoles') }}
                  </span>
                </a-space>
              </a-menu-item>
              <a-menu-item>
                <a-space @click="$router.push({ name: 'Info' })">
                  <UserOutlined />
                  <span>
                    {{ $t('messageBox.userCenter') }}
                  </span>
                </a-space>
              </a-menu-item>
              <a-menu-item>
                <a-space @click="$router.push({ name: 'Setting' })">
                  <SettingOutlined />
                  <span>
                    {{ $t('messageBox.userSettings') }}
                  </span>
                </a-space>
              </a-menu-item>
              <a-menu-item>
                <a-space @click="handleLogout">
                  <LogoutOutlined />
                  <span>
                    {{ $t('messageBox.logout') }}
                  </span>
                </a-space>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-menu-item>
    </a-menu>
  </LayoutHeader>
</template>

<script lang="ts" setup>
import { computed, h, inject, ref } from 'vue';
import {
  LayoutHeader,
  message as Message,
  theme as antTheme,
} from 'ant-design-vue';

import {
  BellOutlined,
  CheckSquareOutlined,
  CompressOutlined,
  ExpandOutlined,
  GlobalOutlined,
  LogoutOutlined,
  SearchOutlined,
  SettingOutlined,
  TagOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { useDark, useFullscreen, useToggle } from '@vueuse/core';
import MessageBox from '../message-box/index.vue';
import { useAppStore, useUserStore } from '@/store';
import { LOCALE_OPTIONS } from '@/locale';
import useLocale from '@/hooks/locale';
import useUser from '@/hooks/user';
import Menu from '@/components/menu/index.vue';
import menuCollapseSwitcher from '@/components/menuCollapseSwitcher/index.vue';
import IconMoonOutlined from '@/assets/svgIcons/icon-moon-outlined.vue';
import IconSunOutlined from '@/assets/svgIcons/icon-sun-outlined.vue';

const props = defineProps<{
  navHeight: number
  offset?: number
}>();

const appStore = useAppStore();
const userStore = useUserStore();
const { logout } = useUser();
const { changeLocale, currentLocale } = useLocale();
const { isFullscreen, toggle: toggleFullScreen } = useFullscreen();
const menuWidth = computed(() => {
  return appStore.menuCollapse ? 48 : appStore.menuWidth;
});
const { token } = antTheme.useToken();

const locales = [...LOCALE_OPTIONS];
const avatar = computed(() => {
  return userStore.avatar;
});
const theme = computed(() => {
  return appStore.theme;
});
const layoutHeaderStyles = computed(() => {
  const colors = { backgroundColor: token.value.colorBgContainer, borderBottom: `1px solid ${token.value.colorBorder}` };
  const layout = {
    position: 'fixed',
    zIndex: 100,
    width: `calc(100% - ${menuWidth.value - (props?.offset ?? 0)}px)`,
    height: `${props.navHeight}px`,
    display: 'flex',
    justifyContent: 'space-between',
    borderRadius: '30px 0 0 0',
    padding: 0,
  };
  return { ...colors, ...layout };
});
const menuStyles = computed(() => {
  return { backgroundColor: token.value.colorBgContainer };
});
const topMenu = computed(() => appStore.topMenu && appStore.menu);
const isDark = useDark({
  selector: 'body',
  attribute: 'laison-theme',
  valueDark: 'dark',
  valueLight: 'light',
  storageKey: 'laison-theme',
  onChanged(dark: boolean) {
    // overridden default behavior
    appStore.toggleTheme(dark);
  },
});
const toggleTheme = useToggle(isDark);
const handleToggleTheme = () => {
  toggleTheme();
};
const setVisible = () => {
  appStore.updateSettings({ globalSettings: true });
};
const refBtn = ref();
const triggerBtn = ref();
const setPopoverVisible = () => {
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  refBtn.value.dispatchEvent(event);
};
const handleLogout = () => {
  logout();
};
const setDropDownVisible = () => {
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  triggerBtn.value.dispatchEvent(event);
};
const switchRoles = async () => {
  const res = await userStore.switchRoles();
  Message.success(res as string);
};
// eslint-disable-next-line unused-imports/no-unused-vars
const toggleDrawerMenu = inject('toggleDrawerMenu') as () => void;
</script>

<style scoped lang="less">
  .navbar {
    display: flex;
    justify-content: space-between;
    height: 100%;
    // background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);
  }

  .left-side {
    display: flex;
    gap: 1em;
    align-items: center;
    padding-left: 20px;
  }

  .nav-btn {
    &:hover {
      background-color: #b8b8b869;
    }
    font-size: 16px;
  }
</style>

<style scoped lang="less">
  :deep(.ant-menu-horizontal) {
    border: none;
    .ant-menu-item::after {
      display: none !important;
    }
  }
</style>
