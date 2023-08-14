<script setup lang="ts">

import Menu from '@/components/Menu/index.vue';
import type { RouteRecordRaw } from 'vue-router';

const props = defineProps<{
  subMenu: RouteRecordRaw[]
  parentPath?: String
}>();
</script>
<template>
  <nav class="text-lg text-blue-600 flex flex-col ml-6 ">
    <template v-for="route in props.subMenu">
      <RouterLink class="w-fit px-2 inline-block border-b border-blue-500" :to="`${props.parentPath || ''}` + `${props.parentPath  ?  '/' : '' }` + route.path">{{route.name}}</RouterLink>
      <template v-if="route?.children?.length">
        <Menu :subMenu="route?.children" :parentPath="route.path"/>
      </template>
    </template>
  </nav>
</template>
