import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Graph } from '@antv/x6'

export const useGraphStore = defineStore('graph', () => {
  const graph = ref<Graph | null>(null)
  const nodes = ref<any[]>([])

  const setGraph = (graphInstance: Graph) => {
    graph.value = graphInstance
  }

  const getGraph = () => {
    return graph.value
  }

  const clearGraph = () => {
    if (graph.value) {
      graph.value.clearCells()
    }
    nodes.value = []
  }

  const addNode = (nodeData: any) => {
    nodes.value.push(nodeData)
  }

  const removeNode = (nodeId: string) => {
    const index = nodes.value.findIndex(n => n.id === nodeId)
    if (index > -1) {
      nodes.value.splice(index, 1)
    }
  }

  const updateNode = (nodeId: string, data: any) => {
    const node = nodes.value.find(n => n.id === nodeId)
    if (node) {
      Object.assign(node, data)
    }
  }

  const getAllNodes = () => {
    return nodes.value
  }

  return {
    graph,
    nodes,
    setGraph,
    getGraph,
    clearGraph,
    addNode,
    removeNode,
    updateNode,
    getAllNodes
  }
})
