<template>
  <div class="flow-container" ref="graphContainer" />
  <div class="minimap-container" ref="minimapContainer" />
</template>

<script setup lang="ts">
import { Graph, Shape, Snapline, MiniMap } from '@antv/x6'
import { ref, onMounted } from 'vue'

const graphContainer = ref<HTMLDivElement>()
const minimapContainer = ref<HTMLDivElement>()

onMounted(() => {
  const graph = new Graph({
    container: graphContainer.value!,
    width: graphContainer.value?.clientWidth || 800,
    height: graphContainer.value?.clientHeight || 600,
    grid: true,
    panning: {
      enabled: true, // 普通画布(未开启 scroller 模式)通过开启 panning 选项来支持拖拽平移
      eventTypes: ['leftMouseDown', 'rightMouseDown', 'mouseWheel']
    },
    mousewheel: {
      enabled: true, // 启用鼠标滚轮功能
      modifiers: ['ctrl', 'meta'], //指定需要按住的修饰键，只有当按住 Ctrl 键（Windows/Linux）或 Meta 键（Mac）时，鼠标滚轮才能控制画布的缩放
    }
  })

  // 对齐线
  graph.use(
    new Snapline({
      enabled: true,
    }),
  )

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

  graph.use(
    new MiniMap({
      container: minimapContainer.value!,
      width: 200,
      height: 100,
      padding: 0,
    }),
  )

  // 注册HTML节点类型
  Shape.HTML.register({
    shape: 'custom-html',
    width: 160,
    height: 80,
    html() {
      const div = document.createElement('div')
      div.className = 'custom-html'
      div.innerHTML = '<div class="custom-html-content" style="background: #f0f0f0; border: 1px solid #ccc;">HTML节点</div>'
      return div
    },
  })

  // 创建HTML节点实例
  const htmlNode = graph.addNode({
    id: 'html1',
    shape: 'custom-html',
    x: 400,
    y: 120,
    width: 40,
    height: 40,
    zIndex: 2,
  })

  // 创建连线
  const edge1 = graph.addEdge({
    id: 'edge1',
    shape: 'edge',
    source: 'node1', 
    target: 'html1',
    labels: ['通信中'],
    attrs: {
      line: {
        stroke: "#7c68fc", // 指定 path 元素的填充色
      },
    },
    zIndex: 1,
  })

  // 创建另一条连线
  const edge2 = graph.addEdge({
    id: 'edge2',
    shape: 'edge',
    source: 'html1', 
    target: 'node2',
    labels: ['连接'],
    attrs: {
      line: {
        stroke: "#42b883", // 指定 path 元素的填充色
      },
    },
    zIndex: 1,
  })

  graph.addNode(imageNode1)
  graph.addNode(imageNode2)
  graph.addNode(htmlNode)

  graph.addEdge(edge1)
  graph.addEdge(edge2)

  // 居中显示画布内容
  graph.centerContent()
})
</script>
<style scoped lang="less">
.flow-container {
  width: 100%;
  height: 100%;
}
.custom-html-content{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid blue;
}
.minimap-container {
  position: absolute;
  top: 10px;
  left: 10px;
  width: auto;
  height: auto;
  border: 1px solid #ccc;
}
</style>
