/**
 * 图表逻辑封装钩子
 * 
 * @author huweili
 * @email czxyhuweili@163.com
 * @version 1.0.0
 * @date 2026-03-18
 * @description 封装 AntV X6 图表的核心逻辑，包括图表初始化、节点注册、连线配置、交互控制等功能
 */
import { Graph, Shape, Snapline, MiniMap, Edge } from '@antv/x6'
import { v4 as uuidv4 } from 'uuid'
import { useGraphStore } from '@/stores/graph'

/**
 * 图表逻辑封装钩子
 */
export function useGraph() {

  const graphStore = useGraphStore()

  // 查看按钮的 SVG 配置（复用）
  const viewButtonMarkup = [
    {
      tagName: 'svg',
      selector: 'icon',
      attrs: {
        viewBox: '0 0 1024 1024',
        width: 16,
        height: 16,
        style: 'cursor: pointer;',
      },
      children: [
        {
          tagName: 'path',
          attrs: {
            d: 'M930.909091 930.909091a93.090909 93.090909 0 0 1-93.090909 93.090909H186.181818a93.090909 93.090909 0 0 1-93.090909-93.090909V93.090909a93.090909 93.090909 0 0 1 93.090909-93.090909h465.454546l279.272727 279.272727v651.636364z',
            fill: '#FF8200',
          },
        },
        {
          tagName: 'path',
          attrs: {
            d: 'M329.541818 380.834909a209.454545 209.454545 0 0 1 325.492364 259.584l85.922909 86.016a46.545455 46.545455 0 0 1-65.815273 65.815273l-85.922909-85.969455A209.547636 209.547636 0 0 1 329.541818 380.834909z m49.384727 49.338182a139.636364 139.636364 0 1 0 197.492364 197.492364A139.636364 139.636364 0 0 0 378.88 430.219636z',
            fill: '#FFFFFF',
            'fill-opacity': '.881',
          },
        },
        {
          tagName: 'path',
          attrs: {
            d: 'M651.636364 0l279.272727 279.272727h-209.454546A69.818182 69.818182 0 0 1 651.636364 209.454545V0z',
            fill: '#FFAF5B',
          },
        },
      ],
    },
  ]

  // 查看按钮的点击事件处理
  const viewButtonClickHandler = (args: any) => {
    if (args && args.cell) {
      alert('查看连线id：' + args.cell.store.data.id)
    } else {
      console.warn('Edge not found in onClick args:', args)
    }
  }

  // 查看按钮的配置（复用）
  const viewButtonConfig = {
    name: 'button',
    args: {
      markup: viewButtonMarkup,
      distance: -80,
      offset: { x: 0, y: 0 },
      onClick: viewButtonClickHandler,
    },
  }

  // 边（连线）的默认配置
  const defaultEdgeConfig = {
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
      name: 'manhattan',
      args: {
        padding: 20,
        maxDirectionChange: 90,
      },
    },
    connector: {
      name: 'rounded',
      args: {
        radius: 8,
      },
    },
    zIndex: 1,
    tools: [
      viewButtonConfig,
      {
        name: 'button-remove',
        args: {
          distance: -40,
          offset: { x: 0, y: 0 },
        },
      },
    ],
  }
  
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
          return new Shape.Edge(defaultEdgeConfig)
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

    // 节点点击事件
    graph.on('node:click', ({ cell }) => {
      if (cell) {
        const nodeType = cell.shape.replace('node-', '')
        const nodeTypeConfig = nodeTypes.find(n => n.type === nodeType)
        const nodeData = {
          id: cell.id,
          position: cell.position(),
          data: cell.getData() || {},
          type: cell.shape,
          info: nodeTypeConfig?.info || {}
        }
        console.log('节点点击事件:', nodeData)
        // 可以在这里触发自定义事件或调用回调函数
      }
    })

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
    { type: 'switch1', name: '交换机类型1', image: '一级交换机@1x.png', info: { type: '交换机', model: 'S300-24', portCount: 24, speed: '100Mbps' } },
    { type: 'switch2', name: '交换机类型2', image: '二级交换机@1x.png', info: { type: '交换机', model: 'S300-24', portCount: 24, speed: '100Mbps' } },
    { type: 'switch3', name: '交换机类型3', image: '三级交换机@1x.png', info: { type: '交换机', model: 'S300-24', portCount: 24, speed: '100Mbps' } },
    { type: 'firewall', name: '防火墙', image: '防火墙@1x.png', info: { type: '防火墙', model: 'FW-1000', portCount: 4, speed: '1Gbps' } },
    { type: 'gateway', name: '网闸', image: '网闸@1x.png', info: { type: '网闸', model: 'GW-500', portCount: 8, speed: '1Gbps' } },
    { type: 'database', name: '数据库', image: '数据库@1x.png', info: { type: '数据库', model: 'DB-2000', portCount: 16, speed: '10Gbps' } },
    { type: 'ip', name: '专网IP', image: '专网IP@1x.png', info: { type: '专网IP', model: 'IP-Static', portCount: 1, speed: '100Mbps' } },
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
  const createNodeByType = (nodeType: string, x: number, y: number, id?: string) => {
    const graph = graphStore.getGraph()
    if (!graph) return null
    
    const nodeId = id || `node_${uuidv4()}`
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
    
    return graph.getNodes().map(node => {
      const position = node.position()
      const data = node.getData() || {}
      // 解构移除 isEditing 字段
      const { isEditing, ...restData } = data
      return {
        id: node.id,
        x: position.x,
        y: position.y,
        ...restData
      }
    })
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

  // 隐藏所有边的删除按钮（但保留查看按钮）
  const hideEdgeRemoveButtons = () => {
    const graph = graphStore.getGraph()
    if (!graph) return

    graph.getEdges().forEach(edge => {
      // 只保留查看按钮，移除其他工具（包括删除按钮）
      edge.setTools([viewButtonConfig])
    })
  }

  // 显示所有边的删除按钮（同时显示查看按钮）
  const showEdgeRemoveButtons = () => {
    const graph = graphStore.getGraph()
    if (!graph) return

    graph.getEdges().forEach(edge => {
      edge.setTools([
        viewButtonConfig,
        {
          name: 'button-remove',
          args: {
            distance: -40,
            offset: { x: 0, y: 0 },
          },
        },
      ])
    })
  }

  // 隐藏所有节点的锚点
  const hideNodePorts = () => {
    const graph = graphStore.getGraph()
    if (!graph) return
    
    graph.getNodes().forEach(node => {
      const ports = node.getPorts()
      ports.forEach((port: any) => {
        node.setPortProp(port.id, 'attrs/circle', { style: { display: 'none' } })
      })
    })
  }

  // 显示所有节点的锚点
  const showNodePorts = () => {
    const graph = graphStore.getGraph()
    if (!graph) return
    
    graph.getNodes().forEach(node => {
      const ports = node.getPorts()
      ports.forEach((port: any) => {
        node.setPortProp(port.id, 'attrs/circle', { style: { display: 'block' } })
      })
    })
  }

  // 禁用画布所有交互（确定后锁定：画布拖拽、缩放、节点/连线移动）
  const disableGraphInteraction = () => {
    const graph = graphStore.getGraph()
    if (!graph) return
    
    graph.options.panning.enabled = false // 禁止拖拽画布
    graph.options.mousewheel.enabled = false // 禁止滚轮缩放
  }

  // 启用画布所有交互（编辑时解锁）
  const enableGraphInteraction = () => {
    const graph = graphStore.getGraph()
    if (!graph) return
    
    graph.options.panning.enabled = true // 允许拖拽画布
    graph.options.mousewheel.enabled = true // 允许滚轮缩放
  }

  // 禁用节点拖拽
  const disableNodeDrag = () => {
    const graph = graphStore.getGraph()
    if (!graph) return
    
    // 只禁用节点拖拽，保持其他交互（如点击）可用
    graph.options.interacting = {
      nodeMovable: false, // 禁止节点拖拽
      edgeMovable: false, // 禁止连线拖拽
      // 其他交互保持默认（如点击、缩放等）
    }
  }

  // 启用节点拖拽
  const enableNodeDrag = () => {
    const graph = graphStore.getGraph()
    if (!graph) return
    
    // 启用所有默认交互
    graph.options.interacting = true
  }

  // 加载图数据（用于回显）
  const loadGraphData = (nodesData: any[], edgesData: any[]) => {
    const graph = graphStore.getGraph()
    if (!graph) return
    
    // 清空画布
    graph.clearCells()
    
    // 存储节点映射
    const nodeMap = new Map<string, any>()
    
    // 创建节点
    nodesData.forEach(nodeData => {
      // 从节点数据中提取类型（根据 ID 推断）
      let nodeType = 'switch1' // 默认类型
      if (nodeData.name.includes('类型2')) {
        nodeType = 'switch2'
      } else if (nodeData.name.includes('类型3')) {
        nodeType = 'switch3'
      } else if (nodeData.name.includes('防火墙')) {
        nodeType = 'firewall'
      } else if (nodeData.name.includes('网闸')) {
        nodeType = 'gateway'
      } else if (nodeData.name.includes('数据库')) {
        nodeType = 'database'
      } else if (nodeData.name.includes('专网IP')) {
        nodeType = 'ip'
      }
      
      // 创建节点
      const nodeResult = createNodeByType(nodeType, nodeData.x, nodeData.y, nodeData.id)
      if (nodeResult && nodeResult.node) {
        // 设置节点名称
        const node = nodeResult.node
        const currentData = node.getData() || {}
        node.setData({ ...currentData, name: nodeData.name })
        nodeMap.set(nodeData.id, node)
      }
    })
    
    // 创建连线
    edgesData.forEach(edgeData => {
      const sourceNode = nodeMap.get(edgeData.source)
      const targetNode = nodeMap.get(edgeData.target)
      
      if (sourceNode && targetNode) {
        // 创建连线（使用默认边配置）
        graph.addEdge({
          source: { cell: sourceNode.id, port: 'right' },
          target: { cell: targetNode.id, port: 'left' },
          ...defaultEdgeConfig,
        })
      }
    })
    
    // 居中显示
    graph.centerContent()

    requestAnimationFrame(() => {
      nodesData.forEach((node: any) => {
        confirmNodeName(node.id)
      })

      hideEdgeRemoveButtons()
      hideNodePorts()
      disableNodeDrag()
      // disableGraphInteraction()
    })
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
    hideEdgeRemoveButtons,
    showEdgeRemoveButtons,
    hideNodePorts,
    showNodePorts,
    disableGraphInteraction,
    enableGraphInteraction,
    disableNodeDrag,
    enableNodeDrag,
    removeNode,
    removeEdge,
    clearGraph,
    loadGraphData, // 加载图数据（用于回显）
  }
}
