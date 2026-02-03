<template>
  <div class="flow-container" ref="graphContainer" />
</template>

<script setup lang="ts">
import { Graph, Shape } from '@antv/x6'
import { ref, onMounted } from 'vue'

const graphContainer = ref<HTMLDivElement>()

onMounted(() => {
  const graph = new Graph({
    container: graphContainer.value!,
    grid: true,
    panning: {
      enabled: true, // 普通画布(未开启 scroller 模式)通过开启 panning 选项来支持拖拽平移
      eventTypes: ['leftMouseDown', 'rightMouseDown', 'mouseWheel']
    },
  })

  graph.centerContent()


  const rect = new Shape.Rect({
    id: 'node1',
    x: 40,
    y: 40,
    width: 100,
    height: 40,
    label: 'rect',
    zIndex: 2,
  })

  const circle = new Shape.Circle({
    id: 'node2',
    x: 280,
    y: 200,
    width: 60,
    height: 60,
    label: 'circle',
    zIndex: 2,
  })

  const edge = new Shape.Edge({
    id: 'edge1',
    source: rect,
    target: circle,
    zIndex: 1,
  })

  graph.addNode(rect)
  graph.addNode(circle)
  graph.addEdge(edge)
})
</script>
<style scoped lang="less">
.flow-container {
  width: 100%;
  height: 100%;
}
</style>
