import { Graph, Shape, Snapline, MiniMap } from '@antv/x6'

/**
 * 图表逻辑封装钩子
 * @param container 图表容器
 * @param minimapContainer 小地图容器
 */
export function useGraph(container: HTMLDivElement, minimapContainer: HTMLDivElement) {
  // 初始化图表
  const graph = new Graph({
    container,
    width: container.clientWidth || 800,
    height: container.clientHeight || 600,
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

  // 注册图表插件
  const registerPlugins = () => {
    // 对齐线
    graph.use(
      new Snapline({
        enabled: true,
      }),
    )

    // 小地图
    graph.use(
      new MiniMap({
        container: minimapContainer,
        width: 200,
        height: 100,
        padding: 0,
      }),
    )
  }

  // 注册自定义节点类型
  const registerNodeTypes = () => {
    // 注册HTML节点类型
    Shape.HTML.register({
      shape: 'custom-html',
      width: 130,
      height: 45,
      html() {
        const div = document.createElement('div')
        div.className = 'custom-html'
        div.innerHTML = '<div class="custom-html-content">html节点</div>'
        return div
      },
    })
  }

  // 创建节点和连线
  const createNodes = () => {
    // 创建图片节点1
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

    // 创建图片节点2
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

    // 创建HTML节点实例
    const htmlNode = graph.addNode({
      id: 'html1',
      shape: 'custom-html',
      x: 400,
      y: 120,
      zIndex: 2,
    })

    // 创建折线拐弯的连线
    const edge1 = graph.addEdge({
      id: 'edge1',
      shape: 'edge',
      source: 'node1', 
      target: 'html1',
      labels: ['通信中'],
      router: { 
        name: 'orth',
        args: { 
          padding: 10
        }
      },
      attrs: {
        line: {
          stroke: "#79AACD", // 指定 path 元素的填充色
          strokeWidth: 2,
        },
      },
      zIndex: 1,
    })

    // 创建另一条折线拐弯的连线
    const edge2 = graph.addEdge({
      id: 'edge2',
      shape: 'edge',
      source: 'html1', 
      target: 'node2',
      labels: ['连接'],
      router: { 
        name: 'orth',
        args: { 
          padding: 10
        }
      },
      attrs: {
        line: {
          stroke: "#79AACD", // 指定 path 元素的填充色
          strokeWidth: 2,
        },
      },
      zIndex: 1,
    })

    // 添加节点和连线到图表
    graph.addNode(imageNode1)
    graph.addNode(imageNode2)
    graph.addNode(htmlNode)
    graph.addEdge(edge1)
    graph.addEdge(edge2)
  }

  // 调整画布大小
  const resizeGraph = () => {
    if (container && minimapContainer) {
      graph.resize(container.clientWidth, container.clientHeight)
      graph.centerContent()
    }
  }

  return {
    graph,
    registerPlugins,
    registerNodeTypes,
    createNodes,
    resizeGraph,
  }
}
