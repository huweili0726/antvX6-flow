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
    }
  })

  const imageNode1 = new Shape.Image({
    id: 'node1',
    x: 120,
    y: 120,
    width: 69,
    height: 64,
    zIndex: 2,
    attrs: {
      image: {
        // 使用本地图片
        'xlink:href': new URL('@/assets/img/lyq.png', import.meta.url).href,
        width: 80,
        height: 80,
        preserveAspectRatio: 'xMidYMid meet'
      }
    }
  })

  // 创建图片节点
  const imageNode2 = new Shape.Image({
    id: 'node2',
    x: 760,
    y: 120,
    width: 136,
    height: 64,
    zIndex: 2,
    attrs: {
      image: {
        // 使用本地图片
        'xlink:href': new URL('@/assets/img/jhj.png', import.meta.url).href,
        width: 80,
        height: 80,
        preserveAspectRatio: 'xMidYMid meet'
      }
    }
  })
  const edge = new Shape.Edge({
    id: 'edge1',
    source: imageNode1,
    target: imageNode2,
    zIndex: 1,
  })

  graph.addNode(imageNode1)
  graph.addNode(imageNode2)
  graph.addEdge(edge)

  graph.centerContent()
})
</script>
<style scoped lang="less">
.flow-container {
  width: 100%;
  height: 100%;
}
</style>
