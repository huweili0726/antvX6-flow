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

const { getGraphInstance, createNodeByType, getAllNodesData, getAllEdgesData, confirmNodeName, editNodeName, hideEdgeRemoveButtons, showEdgeRemoveButtons, hideNodePorts, showNodePorts, disableGraphInteraction, enableGraphInteraction } = useGraph()

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
