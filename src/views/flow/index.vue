<template>
  <div class="home-container">
    <div 
      ref="graphContainerRef"
      class="graph-container" 
      @drop="handleDrop" 
      @dragover="handleDragOver"
    >
      <AntvX6 />
    </div>
    <Control
      @confirm="handleConfirm"
      @edit="handleEdit"
     />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AntvX6 from '@/components/antvX6/index.vue'
import Control from './control.vue'
import { useGraph } from '@/composables/useGraph'

const graphContainerRef = ref<HTMLDivElement>()

const { 
  getGraphInstance, // 获取图表实例
  createNodeByType, // 根据类型创建节点
  getAllNodesData, // 获取所有节点数据
  getAllEdgesData, // 获取所有连线数据
  confirmNodeName, // 确认节点名称（退出编辑模式）
  editNodeName, // 编辑节点名称（进入编辑模式）
  hideEdgeRemoveButtons, // 隐藏所有连线的删除按钮
  showEdgeRemoveButtons, // 显示所有连线的删除按钮
  hideNodePorts, // 隐藏所有节点的锚点
  showNodePorts, // 显示所有节点的锚点
  disableGraphInteraction, // 禁用画布所有交互（锁定）
  enableGraphInteraction // 启用画布所有交互（解锁）
} = useGraph()

// 处理节点拖动到图表上的事件
const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  const nodeType = event.dataTransfer?.getData('nodeType')
  if (nodeType && graphContainerRef.value) {
    const rect = graphContainerRef.value.getBoundingClientRect()
    const clientX = event.clientX - rect.left
    const clientY = event.clientY - rect.top
    
    const graph = getGraphInstance()
    if (graph) {
      const localPoint = graph.clientToLocal({ x: clientX, y: clientY })
      createNodeByType(nodeType, localPoint.x, localPoint.y)
    } else {
      createNodeByType(nodeType, clientX, clientY)
    }
  }
}

// 处理节点拖动到图表上时的事件
const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}

// 处理确认按钮点击事件
const handleConfirm = () => {
  const nodes = getAllNodesData()
  nodes.forEach((node: any) => {
    confirmNodeName(node.id)
  })
  
  hideEdgeRemoveButtons()
  hideNodePorts()
  disableGraphInteraction()
  
  const edges = getAllEdgesData()
  console.log('所有节点数据:', nodes)
  console.log('所有连线数据:', edges)
}

// 处理编辑按钮点击事件
const handleEdit = () => {
  const nodes = getAllNodesData()
  nodes.forEach((node: any) => {
    editNodeName(node.id)
  })
  
  enableGraphInteraction()
  showEdgeRemoveButtons()
  showNodePorts()
}
</script>

<style scoped lang="less">
.home-container {
  position: relative;
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.graph-container {
  flex: 1;
  height: 100%;
  overflow: hidden;
}
</style>
