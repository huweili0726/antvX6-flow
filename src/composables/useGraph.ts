import { Graph, Shape, Snapline, MiniMap } from '@antv/x6'
import { useGraphStore } from '@/stores/graph'

/**
 * 图表逻辑封装钩子
 */
export function useGraph() {

  const graphStore = useGraphStore()
  
  // 初始化图表
  const initGraph = (container: HTMLDivElement, minimapContainer: HTMLDivElement) => {
    // 初始化图表
    const graph = new Graph({
      container,
      width: container.clientWidth || 800,
      height: container.clientHeight || 600,
      grid: true,
      panning: {
        enabled: true,
        eventTypes: ['leftMouseDown', 'rightMouseDown', 'mouseWheel']
      },
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
      }
    })

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

    // 将 graph 实例存储到 Pinia store
    graphStore.setGraph(graph)
    
    return graph
  }

  // 获取图表实例
  const getGraphInstance = () => {
    return graphStore.getGraph()
  }

  // 节点类型配置（提取到外部以便复用）
  const nodeTypes = [
    { type: 'switch1', name: '一级交换机', image: '一级交换机@1x.png' },
    { type: 'switch2', name: '二级交换机', image: '二级交换机@1x.png' },
    { type: 'switch3', name: '三级交换机', image: '三级交换机@1x.png' },
    { type: 'firewall', name: '防火墙', image: '防火墙@1x.png' },
    { type: 'gateway', name: '网闸', image: '网闸@1x.png' },
    { type: 'database', name: '数据库', image: '数据库@1x.png' },
    { type: 'ip', name: '专网IP', image: '专网IP@1x.png' },
  ]

  // 注册自定义节点类型
  const registerNodeTypes = () => {
    const graph = graphStore.getGraph()
    if (!graph) {
      throw new Error('图表实例未初始化')
    }
    
    // 注册所有节点类型
    nodeTypes.forEach(({ type, name, image }) => {
      Shape.HTML.register({
        shape: `node-${type}`,
        width: 80,
        height: 80,
        html(cell) {
          const div = document.createElement('div')
          div.className = 'custom-html-node'
          
          const img = document.createElement('img')
          img.src = `${import.meta.env.BASE_URL}/src/assets/img/${image}`
          img.alt = name
          
          const nameContainer = document.createElement('div')
          nameContainer.className = 'name-container'
          
          const nodeData = cell.getData() || {}
          const nodeName = nodeData.name || name
          const isEditing = nodeData.isEditing !== false
          
          if (isEditing) {
            const input = document.createElement('input')
            input.type = 'text'
            input.value = nodeName
            input.className = 'node-name-input'
            input.addEventListener('mousedown', (e) => e.stopPropagation())
            input.addEventListener('keydown', (e) => {
              if (e.key === 'Enter') {
                input.blur()
              }
            })
            input.addEventListener('blur', (e) => {
              const target = e.target as HTMLInputElement
              const currentData = cell.getData() || {}
              cell.setData({ ...currentData, name: target.value })
            })
            setTimeout(() => {
              input.focus()
              input.select()
            }, 0)
            nameContainer.appendChild(input)
          } else {
            const span = document.createElement('span')
            span.textContent = nodeName
            nameContainer.appendChild(span)
          }
          
          div.appendChild(img)
          div.appendChild(nameContainer)
          return div
        },
      })
    })
  }

  // 创建指定类型的节点
  const createNodeByType = (nodeType: string, x: number, y: number) => {
    const graph = graphStore.getGraph()
    if (!graph) return null
    
    const nodeId = `node-${Date.now()}`
    const nodeTypeConfig = nodeTypes.find(n => n.type === nodeType)
    const defaultName = nodeTypeConfig?.name || ''
    
    const node = graph.addNode({
      id: nodeId,
      shape: `node-${nodeType}`,
      x,
      y,
      zIndex: 2,
      data: {
        isEditing: true,
        name: defaultName
      }
    })
    
    graphStore.addNode({ id: nodeId, type: nodeType, name: defaultName })
    
    return { nodeId, node }
  }

  // 确认节点名称（退出编辑状态）
  const confirmNodeName = (nodeId: string) => {
    const graph = graphStore.getGraph()
    if (!graph) return
    
    const node = graph.getCellById(nodeId)
    if (node) {
      const currentData = node.getData() || {}
      node.setData({ ...currentData, isEditing: false })
      graphStore.updateNode(nodeId, { isEditing: false, name: currentData.name })
    }
  }

  // 进入编辑状态
  const editNodeName = (nodeId: string) => {
    const graph = graphStore.getGraph()
    if (!graph) return
    
    const node = graph.getCellById(nodeId)
    if (node) {
      const currentData = node.getData() || {}
      node.setData({ ...currentData, isEditing: true })
      graphStore.updateNode(nodeId, { isEditing: true })
    }
  }

  // 获取所有节点数据
  const getAllNodesData = () => {
    const graph = graphStore.getGraph()
    if (!graph) return []
    
    return graph.getNodes().map(node => ({
      id: node.id,
      ...node.getData()
    }))
  }

  return {
    initGraph,
    getGraphInstance,
    registerNodeTypes,
    createNodeByType,
    confirmNodeName,
    editNodeName,
    getAllNodesData,
  }
}
