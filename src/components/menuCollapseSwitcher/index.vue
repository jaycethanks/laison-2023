<template>
  <div>
    <a-button v-if="collapsed" size="small" @click="setCollapsed(false)">
      <menu-unfold-outlined />
    </a-button>
    <a-button v-else size="small" @click="setCollapsed(true)">
      <menu-fold-outlined />
    </a-button>
  </div>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue';
import { useAppStore } from '@/store';

const isInit = ref(false);

const appStore = useAppStore();

const collapsed = computed(() => {
  return appStore.menuCollapse;
});
const setCollapsed = (val: boolean) => {
  if (!isInit.value) return; // for page initialization menu state problem
  appStore.updateSettings({ menuCollapse: val });
};

onMounted(() => {
  isInit.value = true;
});
</script>
