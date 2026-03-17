import { Graph, Shape, Snapline, MiniMap } from '@antv/x6'
import { v4 as uuidv4 } from 'uuid'
import { useGraphStore } from '@/stores/graph'

/**
 * 图表逻辑封装钩子
 */
export function useGraph() {

  const graphStore = useGraphStore()
  
  // 初始化图表
  const initGraph = (container: HTMLDivElement, minimapContainer: HTMLDivElement) => {
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
      },
      connecting: {
        anchor: 'center',
        connectionPoint: 'boundary',
        allowBlank: false,
        allowLoop: false,
        highlight: true,
        snap: {
          radius: 20, // 自动吸附 : 连线会自动吸附到最近的连接桩（半径 20px）
        },
        allowNode: false,
        allowEdge: false,
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: '#79AACD',
                strokeWidth: 2,
                targetMarker: {
                  name: 'classic',
                  size: 8,
                },
              },
            },
            router: {
              name: 'manhattan', // 智能路由 : 曼哈顿路由会自动避开节点
              args: {
                padding: 20,
                maxDirectionChange: 90,
              },
            },
            connector: {
              name: 'rounded', // 圆角连线 : 拐角处有圆角，更加美观
              args: {
                radius: 8,
              },
            },
            zIndex: 1,
          })
        },
      },
      highlighting: {
        magnetAvailable: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#47C769',
              strokeWidth: 4,
            },
          },
        },
      },
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
        ports: {
          groups: {
            top: {
              position: 'top',
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: '#79AACD',
                  strokeWidth: 2,
                  fill: '#fff',
                },
              },
            },
            right: {
              position: 'right',
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: '#79AACD',
                  strokeWidth: 2,
                  fill: '#fff',
                },
              },
            },
            bottom: {
              position: 'bottom',
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: '#79AACD',
                  strokeWidth: 2,
                  fill: '#fff',
                },
              },
            },
            left: {
              position: 'left',
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: '#79AACD',
                  strokeWidth: 2,
                  fill: '#fff',
                },
              },
            },
          },
          items: [
            { id: 'top', group: 'top' },
            { id: 'right', group: 'right' },
            { id: 'bottom', group: 'bottom' },
            { id: 'left', group: 'left' },
          ],
        },
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
    
    const nodeId = `node_${uuidv4()}`
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

  // 获取所有连线数据
  const getAllEdgesData = () => {
    const graph = graphStore.getGraph()
    if (!graph) return []
    
    return graph.getEdges().map(edge => ({
      id: edge.id,
      source: edge.getSourceCellId(),
      target: edge.getTargetCellId(),
    }))
  }

  // 删除节点
  const removeNode = (nodeId: string) => {
    const graph = graphStore.getGraph()
    if (!graph) return
    
    const node = graph.getCellById(nodeId)
    if (node) {
      graph.removeCell(node)
      graphStore.removeNode(nodeId)
    }
  }

  // 删除连线
  const removeEdge = (edgeId: string) => {
    const graph = graphStore.getGraph()
    if (!graph) return
    
    const edge = graph.getCellById(edgeId)
    if (edge) {
      graph.removeCell(edge)
    }
  }

  // 清空画布
  const clearGraph = () => {
    const graph = graphStore.getGraph()
    if (!graph) return
    
    graph.clearCells()
    graphStore.clearGraph()
  }

  return {
    initGraph,
    getGraphInstance,
    registerNodeTypes,
    createNodeByType,
    confirmNodeName,
    editNodeName,
    getAllNodesData,
    getAllEdgesData,
    removeNode,
    removeEdge,
    clearGraph,
  }
}
