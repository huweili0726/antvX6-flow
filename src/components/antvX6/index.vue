<template>
  <div class="flow-container" ref="graphContainer" />
  <div class="minimap-container" ref="minimapContainer" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useGraph } from '@/composables/useGraph'

const graphContainer = ref<HTMLDivElement>()
const minimapContainer = ref<HTMLDivElement>()
const { width, height } = useWindowSize()

const { 
  initGraph, 
  getGraphInstance, 
  registerNodeTypes,
} = useGraph()

watch([width, height], ([newWidth, newHeight]) => {
  const graph = getGraphInstance()
  if (graph && newWidth && newHeight) {
    graph.resize(newWidth, newHeight)
    graph.centerContent()
  }
})

onMounted(() => {
  // 初始化图 【 graph初始化 + 对齐线 + 小地图】
  const graph = initGraph(graphContainer.value!, minimapContainer.value!)
  registerNodeTypes()
  graph.centerContent()
})

</script>
<style scoped lang="less">
.flow-container {
  width: 100%;
  height: 100%;
}
.minimap-container {
  position: absolute;
  top: 10px;
  left: 10px;
  width: auto;
  height: auto;
  border: 1px solid black;
}
</style>
