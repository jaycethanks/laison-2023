<template>
  <a-dropdown
    :trigger="['contextmenu']"
    :popup-max-height="false"
  >
    <a-tag
      class="arco-tag arco-tag-size-medium arco-tag-checked"
      :class="{ 'link-activated': itemData.fullPath === $route.fullPath }"
      @click="goto(itemData)"
    >
      <span class="tag-link">
        {{ $t(itemData.title) }}
      </span>
      <span
        class="arco-icon-hover arco-tag-icon-hover arco-icon-hover-size-medium arco-tag-close-btn"
        @click.stop="tagClose(itemData, index)"
      >
        <CloseOutlined />
      </span>
    </a-tag>
    <template #overlay>
      <a-menu @click="actionSelect">
        <a-menu-item :key="Eaction.reload" :disabled="disabledReload">
          <a-space>
            <ReloadOutlined />
            <span>重新加载</span>
          </a-space>
        </a-menu-item>
        <a-menu-item
          :key="Eaction.current"
          class="sperate-line"
          :disabled="disabledCurrent"
        >
          <a-space>
            <CloseOutlined />
            <span>关闭当前标签页</span>
          </a-space>
        </a-menu-item>
        <a-menu-item :key="Eaction.left" :disabled="disabledLeft">
          <a-space>
            <VerticalRightOutlined />
            <span>关闭左侧标签页</span>
          </a-space>
        </a-menu-item>
        <a-menu-item
          :key="Eaction.right"
          class="sperate-line"
          :disabled="disabledRight"
        >
          <a-space>
            <VerticalLeftOutlined />
            <span>关闭右侧标签页</span>
          </a-space>
        </a-menu-item>
        <a-menu-item :key="Eaction.others">
          <a-space>
            <SwapOutlined />
            <span>关闭其它标签页</span>
          </a-space>
        </a-menu-item>
        <a-menu-item :key="Eaction.all">
          <a-space>
            <UngroupOutlined />
            <span>关闭全部标签页</span>
          </a-space>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTabBarStore } from '@/store';
import type { TagProps } from '@/store/modules/tab-bar/types';
import { DEFAULT_ROUTE_NAME, REDIRECT_ROUTE_NAME } from '@/router/constants';

const props = defineProps({
  itemData: {
    type: Object as PropType<TagProps>,
    default() {
      return [];
    },
  },
  index: {
    type: Number,
    default: 0,
  },
});

enum Eaction {
  reload = 'reload',
  current = 'current',
  left = 'left',
  right = 'right',
  others = 'others',
  all = 'all',
}

const router = useRouter();
const route = useRoute();
const tabBarStore = useTabBarStore();

const goto = (tag: TagProps) => {
  router.push({ ...tag });
};
const tagList = computed(() => {
  return tabBarStore.getTabList;
});

const disabledReload = computed(() => {
  return props.itemData.fullPath !== route.fullPath;
});

const disabledCurrent = computed(() => {
  return props.index === 0;
});

const disabledLeft = computed(() => {
  return [0, 1].includes(props.index);
});

const disabledRight = computed(() => {
  return props.index === tagList.value.length - 1;
});

const tagClose = (tag: TagProps, idx: number) => {
  tabBarStore.deleteTag(idx, tag);
  if (props.itemData.fullPath === route.fullPath) {
    const latest = tagList.value[idx - 1]; // 获取队列的前一个tab
    router.push({ name: latest.name });
  }
};

const findCurrentRouteIndex = () => {
  return tagList.value.findIndex(el => el.fullPath === route.fullPath);
};
const actionSelect = async ({ key: value }: any) => {
  const { itemData, index } = props;
  const copyTagList = [...tagList.value];
  if (value === Eaction.current) {
    tagClose(itemData, index);
  }
  else if (value === Eaction.left) {
    const currentRouteIdx = findCurrentRouteIndex();
    copyTagList.splice(1, props.index - 1);

    tabBarStore.freshTabList(copyTagList);
    if (currentRouteIdx < index) {
      router.push({ name: itemData.name });
    }
  }
  else if (value === Eaction.right) {
    const currentRouteIdx = findCurrentRouteIndex();
    copyTagList.splice(props.index + 1);

    tabBarStore.freshTabList(copyTagList);
    if (currentRouteIdx > index) {
      router.push({ name: itemData.name });
    }
  }
  else if (value === Eaction.others) {
    const filterList = tagList.value.filter((el, idx) => {
      return idx === 0 || idx === props.index;
    });
    tabBarStore.freshTabList(filterList);
    router.push({ name: itemData.name });
  }
  else if (value === Eaction.reload) {
    tabBarStore.deleteCache(itemData);
    await router.push({
      name: REDIRECT_ROUTE_NAME,
      params: {
        path: route.fullPath,
      },
    });
    tabBarStore.addCache(itemData.name);
  }
  else {
    tabBarStore.resetTabList();
    router.push({ name: DEFAULT_ROUTE_NAME });
  }
};
</script>

<style scoped lang="less">
  .tag-link {
    color: var(--color-text-2);
    text-decoration: none;
  }
  .link-activated {
    color: #f40;
    .tag-link {
      color: rgb(var(--link-6));
    }
    & + .arco-tag-close-btn {
      color: rgb(var(--link-6));
    }
  }
  :deep(.arco-dropdown-option-content) {
    span {
      margin-left: 10px;
    }
  }
  .arco-dropdown-open {
    .tag-link {
      color: rgb(var(--danger-6));
    }
    .arco-tag-close-btn {
      color: rgb(var(--danger-6));
    }
  }
  .sperate-line {
    border-bottom: 1px solid var(--color-neutral-3);
  }
</style>
