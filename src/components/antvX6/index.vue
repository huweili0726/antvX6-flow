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

let graphInstance: any = null
let createNodeByTypeFn: any = null

onMounted(() => {
  const { graph, registerPlugins, registerNodeTypes, createNodes, createNodeByType } = useGraph(graphContainer.value!, minimapContainer.value!)
  graphInstance = graph
  createNodeByTypeFn = createNodeByType
  
  registerPlugins() // 对齐线 + 小地图
  registerNodeTypes() // 注册自定义节点类型 (html)
  createNodes() // 创建普通图片节点和连线
  graph.centerContent() // 将内容居中显示
})

// 监听窗口大小变化
watch([width, height], ([newWidth, newHeight]) => {
  if (graphInstance && newWidth && newHeight) {
    graphInstance.resize(newWidth, newHeight)
    graphInstance.centerContent()
  }
})

// 创建节点方法
const createNode = (nodeType: string, x: number, y: number) => {
  if (createNodeByTypeFn) {
    return createNodeByTypeFn(nodeType, x, y)
  }
  return null
}

// 暴露方法给父组件
defineExpose({
  createNode
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
