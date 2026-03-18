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
      {
        name: 'button',
        args: {
          markup: [
            {
              tagName: 'svg',
              selector: 'icon',
              attrs: {
                viewBox: '0 0 1024 1024',
                width: 18,
                height: 18,
                transform: 'translate(-50%, -50%)',
                style: 'cursor: pointer;',
              },
              children: [
                {
                  tagName: 'path',
                  attrs: {
                    d: 'M457.751 330.007c-110.942 0-200.907 89.967-200.907 200.897 0 110.925 89.965 200.885 200.907 200.885 110.937 0 200.882-89.96 200.882-200.885C658.633 419.974 568.689 330.007 457.751 330.007zM731.688 1.282 74.24 1.282l0 1022.715 876.613 0L950.853 220.434 731.688 1.282zM820.268 915.623c-21.405 21.405-56.13 21.405-77.53 0l-147.62-147.68c-40.39 23.455-87.305 36.895-137.367 36.895-151.297 0-273.937-122.63-273.937-273.934 0-151.31 122.64-273.942 273.937-273.942 151.277 0 273.937 122.632 273.937 273.942 0 61.555-20.305 118.365-54.575 164.1l143.155 143.16C841.668 859.523 841.668 894.233 820.268 915.623z',
                    fill: '#52C41A',
                  },
                },
              ],
            },
          ],
          distance: -80,
          offset: { x: 9, y: 9 },
          onClick(args: any) {
            // 点击连线上的按钮弹出查看弹窗
            if (args && args.cell) {
              alert('查看连线id：' + args.cell.store.data.id)
            } else {
              console.warn('Edge not found in onClick args:', args)
            }
          },
        },
      },
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
    { type: 'switch1', name: '交换机类型1', image: '一级交换机@1x.png' },
    { type: 'switch2', name: '交换机类型2', image: '二级交换机@1x.png' },
    { type: 'switch3', name: '交换机类型3', image: '三级交换机@1x.png' },
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

  // 隐藏所有边的删除按钮
  const hideEdgeRemoveButtons = () => {
    const graph = graphStore.getGraph()
    if (!graph) return
    
    graph.getEdges().forEach(edge => {
      edge.removeTools()
    })
  }

  // 显示所有边的删除按钮
  const showEdgeRemoveButtons = () => {
    const graph = graphStore.getGraph()
    if (!graph) return
    
    graph.getEdges().forEach(edge => {
      edge.addTools([
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
    graph.options.interacting = false // 禁止节点和连线交互
  }

  // 启用画布所有交互（编辑时解锁）
  const enableGraphInteraction = () => {
    const graph = graphStore.getGraph()
    if (!graph) return
    
    graph.options.panning.enabled = true // 允许拖拽画布
    graph.options.mousewheel.enabled = true // 允许滚轮缩放
    // 全局启用节点和连线交互
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

    // 使用 requestAnimationFrame 确保在浏览器重绘后执行
    requestAnimationFrame(() => {
      nodesData.forEach((node: any) => {
        confirmNodeName(node.id)
      })

      hideEdgeRemoveButtons()
      hideNodePorts()
      disableGraphInteraction()
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
    removeNode,
    removeEdge,
    clearGraph,
    loadGraphData, // 加载图数据（用于回显）
  }
}
