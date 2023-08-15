<template>
  <div class="navbar">
    <div class="left-side">
      <a-space>
        <!-- <img
          alt="logo"
          src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/dfdba5317c0c20ce20e64fac803d52bc.svg~tplv-49unhts6dw-image.image"
        /> -->
        <Logo />
        <a-typography-title
          :style="{ margin: 0, fontSize: '18px' }"
          :heading="5"
        >
          Laison Tech
        </a-typography-title>
        <MenuFoldOutlined
          v-if="!topMenu && appStore.device === 'mobile'"
          style="font-size: 22px; cursor: pointer"
          @click="toggleDrawerMenu"
        />
      </a-space>
    </div>
    <div class="center-side">
      <Menu v-if="topMenu" />
    </div>
    <ul class="right-side">
      <li>
        <a-tooltip :content="$t('settings.search')">
          <a-button
            class="nav-btn"
            type="outline"
            shape="circle"
            :icon="h(SearchOutlined)"
          >
            <template #icon>
              <SearchOutlined />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-tooltip :content="$t('settings.language')">
          <a-button
            class="nav-btn"
            type="outline"
            shape="circle"
            :icon="h(GlobalOutlined)"
            @click="setDropDownVisible"
          />
        </a-tooltip>
        <a-dropdown trigger="click" @select="changeLocale as any">
          <div ref="triggerBtn" class="trigger-btn" />
          <template #overlay>
            <a-menu>
              <a-menu-item v-for="item in locales" :key="item.value">
                <CheckSquareOutlined v-show="item.value === currentLocale" />
                {{ item.label }}
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </li>
      <li>
        <a-tooltip
          :content="
            theme === 'light'
              ? $t('settings.navbar.theme.toDark')
              : $t('settings.navbar.theme.toLight')
          "
        >
          <a-button
            class="nav-btn"
            type="outline"
            shape="circle"
            @click="handleToggleTheme"
          >
            <template #icon>
              <IconMoonOutlined v-if="theme === 'dark'" />
              <IconSunOutlined v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-tooltip :content="$t('settings.navbar.alerts')">
          <div class="message-box-trigger">
            <a-badge :count="9" dot>
              <a-button
                class="nav-btn"
                type="outline"
                shape="circle"
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
      </li>
      <li>
        <a-tooltip
          :content="
            isFullscreen
              ? $t('settings.navbar.screen.toExit')
              : $t('settings.navbar.screen.toFull')
          "
        >
          <a-button
            class="nav-btn"
            type="outline"
            shape="circle"
            :icon="isFullscreen ? h(CompressOutlined) : h(ExpandOutlined)"
            @click="toggleFullScreen"
          />
        </a-tooltip>
      </li>
      <li>
        <a-tooltip :content="$t('settings.title')">
          <a-button
            class="nav-btn"
            type="outline"
            shape="circle"
            :icon="h(SettingOutlined)"
            @click="setVisible"
          />
        </a-tooltip>
      </li>
      <li>
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
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed, h, inject, ref } from 'vue';
import { message as Message } from 'ant-design-vue';
import {
  BellOutlined,
  CheckSquareOutlined,
  CompressOutlined,
  ExpandOutlined,
  GlobalOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  SearchOutlined,
  SettingOutlined,
  TagOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { useDark, useFullscreen, useToggle } from '@vueuse/core';
import MessageBox from '../message-box/index.vue';
import Logo from '@/assets/logo.svg';
import { useAppStore, useUserStore } from '@/store';
import { LOCALE_OPTIONS } from '@/locale';
import useLocale from '@/hooks/locale';
import useUser from '@/hooks/user';
import Menu from '@/components/menu/index.vue';
import IconMoonOutlined from '@/assets/svgIcons/icon-moon-outlined.vue';
import IconSunOutlined from '@/assets/svgIcons/icon-sun-outlined.vue';

const appStore = useAppStore();
const userStore = useUserStore();
const { logout } = useUser();
const { changeLocale, currentLocale } = useLocale();
const { isFullscreen, toggle: toggleFullScreen } = useFullscreen();
const locales = [...LOCALE_OPTIONS];
const avatar = computed(() => {
  return userStore.avatar;
});
const theme = computed(() => {
  return appStore.theme;
});
const topMenu = computed(() => appStore.topMenu && appStore.menu);
const isDark = useDark({
  selector: 'body',
  attribute: 'arco-theme',
  valueDark: 'dark',
  valueLight: 'light',
  storageKey: 'arco-theme',
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
const toggleDrawerMenu = inject('toggleDrawerMenu') as () => void;
</script>

<style scoped lang="less">
  .navbar {
    display: flex;
    justify-content: space-between;
    height: 100%;
    background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);
  }

  .left-side {
    display: flex;
    align-items: center;
    padding-left: 20px;
  }

  .center-side {
    flex: 1;
  }

  .right-side {
    display: flex;
    padding-right: 20px;
    list-style: none;
    :deep(.locale-select) {
      border-radius: 20px;
    }
    li {
      display: flex;
      align-items: center;
      padding: 0 10px;
    }

    a {
      color: var(--color-text-1);
      text-decoration: none;
    }
    .nav-btn {
      border-color: rgb(var(--gray-2));
      color: rgb(var(--gray-8));
      font-size: 16px;
    }
    .trigger-btn,
    .ref-btn {
      position: absolute;
      bottom: 14px;
    }
    .trigger-btn {
      margin-left: 14px;
    }
  }
</style>

<style lang="less">
  .message-popover {
    .arco-popover-content {
      margin-top: 0;
    }
  }
</style>
