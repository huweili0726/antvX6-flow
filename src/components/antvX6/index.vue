<template>
  <div class="flow-container" ref="graphContainer" />
  <div class="minimap-container" ref="minimapContainer" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGraph } from '@/composables/useGraph'

const graphContainer = ref<HTMLDivElement>()
const minimapContainer = ref<HTMLDivElement>()

onMounted(() => {
  const { graph, registerPlugins, registerNodeTypes, createNodes } = useGraph(graphContainer.value!, minimapContainer.value!)
  
  registerPlugins() // 对齐线 + 小地图
  registerNodeTypes() // 注册自定义节点类型 (html)
  createNodes() // 创建普通图片节点和连线
  graph.centerContent() // 将内容居中显示
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
