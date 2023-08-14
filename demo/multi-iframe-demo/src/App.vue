<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import router from "@/router"
import buildRoutesTree from "@/utils/buildRoutesTree"
import Menu from "@/components/Menu/index.vue"
import { h, computed, watch, ref } from 'vue';

const routes = router.getRoutes()
const routeTree = ref(buildRoutesTree(routes))

// 递归函数用于构建树结构
const handleAddRoute = ()=>{
  router.addRoute({
    path:'/test',
    name:'test',
    component:h('iframe',{class:'text-3xl text-red-700',src:'https://www.typescriptlang.org/zh/play'},null)
  }) 
  const routes = router.getRoutes()
  routeTree.value = buildRoutesTree(routes)
}
</script>

<template>
  <main class="content flex gap-4">
    <header class="shrink-0 w-60">
      <div class="wrapper">
        <Menu :subMenu="routeTree" class="border p-6"/>
      </div>
      
      <button class="m-6 border p-2 active:bg-slate-100" @click="handleAddRoute">添加一个随机iframe</button>
    </header>
    <section class="router-view-wrapper border w-full">
      <RouterView />
    </section>
  </main>
</template>
