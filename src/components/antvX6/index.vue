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
  loadGraphData, // 加载图数据（用于回显）
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
  
  // 测试数据：节点数据
  const testNodesData = [
    {
      id: 'node_1',
      x: 100,
      y: 50,
      name: '交换机类型1'
    },
    {
      id: 'node_2',
      x: 300,
      y: 150,
      name: '交换机类型2'
    },
    {
      id: 'node_3',
      x: 500,
      y: 250,
      name: '交换机类型3'
    },
    {
      id: 'node_4',
      x: 200,
      y: 350,
      name: '防火墙'
    },
    {
      id: 'node_5',
      x: 400,
      y: 450,
      name: '网闸'
    }
  ]
  
  // 测试数据：连线数据
  const testEdgesData = [
    {
      id: 'edge_1',
      source: 'node_1',
      target: 'node_2'
    },
    {
      id: 'edge_2',
      source: 'node_2',
      target: 'node_3'
    },
    {
      id: 'edge_3',
      source: 'node_1',
      target: 'node_4'
    },
    {
      id: 'edge_4',
      source: 'node_4',
      target: 'node_5'
    }
  ]
  
  // 加载测试数据（用于回显测试）
  loadGraphData(testNodesData, testEdgesData)
  
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
