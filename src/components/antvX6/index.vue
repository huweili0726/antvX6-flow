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
  confirmNodeName, 
  getAllNodesData 
} = useGraph()

onMounted(() => {
  const graph = initGraph(graphContainer.value!, minimapContainer.value!)
  registerNodeTypes()
  graph.centerContent()
})

watch([width, height], ([newWidth, newHeight]) => {
  const graph = getGraphInstance()
  if (graph && newWidth && newHeight) {
    graph.resize(newWidth, newHeight)
    graph.centerContent()
  }
})

const confirmAllNodes = () => {
  const nodes = getAllNodesData()
  nodes.forEach((node: any) => {
    confirmNodeName(node.id)
  })
}

defineExpose({
  confirmNodeName,
  getAllNodesData,
  confirmAllNodes
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
