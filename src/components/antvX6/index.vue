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
let confirmNodeNameFn: any = null
let editNodeNameFn: any = null
let getAllNodesDataFn: any = null

onMounted(() => {
  const { graph, registerPlugins, registerNodeTypes, createNodeByType, confirmNodeName, editNodeName, getAllNodesData } = useGraph(graphContainer.value!, minimapContainer.value!)
  graphInstance = graph
  createNodeByTypeFn = createNodeByType
  confirmNodeNameFn = confirmNodeName
  editNodeNameFn = editNodeName
  getAllNodesDataFn = getAllNodesData
  
  registerPlugins() // 对齐线 + 小地图
  registerNodeTypes() // 注册自定义节点类型 (html)
  // createNodes() // 创建普通图片节点和连线
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

// 获取 graph 实例方法
const getGraph = () => {
  return graphInstance
}

// 确认节点名称（退出编辑状态）
const confirmNodeName = (nodeId: string) => {
  if (confirmNodeNameFn) {
    confirmNodeNameFn(nodeId)
  }
}

// 进入编辑状态
const editNodeName = (nodeId: string) => {
  if (editNodeNameFn) {
    editNodeNameFn(nodeId)
  }
}

// 获取所有节点数据
const getAllNodesData = () => {
  if (getAllNodesDataFn) {
    return getAllNodesDataFn()
  }
  return []
}

// 确认所有节点（批量退出编辑状态）
const confirmAllNodes = () => {
  if (getAllNodesDataFn && confirmNodeNameFn) {
    const nodes = getAllNodesDataFn()
    nodes.forEach((node: any) => {
      confirmNodeNameFn(node.id)
    })
  }
}

// 暴露方法给父组件
defineExpose({
  createNode,
  getGraph,
  confirmNodeName,
  editNodeName,
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
