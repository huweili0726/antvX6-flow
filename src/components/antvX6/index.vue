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
      "id": "node_1",
      "x": 100,
      "y": 50,
      "name": "交换机类型1"
    },
    {
      "id": "node_2",
      "x": 290,
      "y": -140,
      "name": "交换机类型2"
    },
    {
      "id": "node_3",
      "x": 530,
      "y": -140,
      "name": "交换机类型3"
    },
    {
      "id": "node_4",
      "x": 290,
      "y": 290,
      "name": "防火墙"
    },
    {
      "id": "node_5",
      "x": 630,
      "y": 290,
      "name": "网闸"
    },
    {
      "id": "node_d976e53b-dc42-4ffe-bb74-36d284d9a35f",
      "x": 740,
      "y": -140,
      "name": "交换机类型1"
    }
  ]
  
  // 测试数据：连线数据
  const testEdgesData = [
    {
      "id": "c2cf82fe-8c38-4d9d-b8a0-d1bc9b1772e8",
      "source": "node_1",
      "target": "node_2"
    },
    {
      "id": "2cb77276-f558-4bdc-aa78-45e6636f89fc",
      "source": "node_2",
      "target": "node_3"
    },
    {
      "id": "ed045f7c-21fd-4d25-9700-6f8ff26cf031",
      "source": "node_1",
      "target": "node_4"
    },
    {
      "id": "e84cb605-abf8-4027-8762-397cef33d121",
      "source": "node_4",
      "target": "node_5"
    },
    {
      "id": "2bf48a18-4271-49a9-81f1-d0006e5252ab",
      "source": "node_3",
      "target": "node_d976e53b-dc42-4ffe-bb74-36d284d9a35f"
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
