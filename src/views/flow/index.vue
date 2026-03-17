<template>
  <div class="home-container">
    <div 
      ref="graphContainerRef"
      class="graph-container" 
      @drop="handleDrop" 
      @dragover="handleDragOver"
    >
      <AntvX6 ref="antvX6Ref" />
    </div>
    <div class="operation-panel">
      <div class="panel-title">操作面板</div>
      <div class="panel-content">
        <div 
          class="draggable-node" 
          draggable="true" 
          data-type="switch1"
          @dragstart="handleDragStart"
        >
          <img src="@/assets/img/一级交换机@1x.png" alt="一级交换机" />
          <span>一级交换机</span>
        </div>
        <div 
          class="draggable-node" 
          draggable="true" 
          data-type="switch2"
          @dragstart="handleDragStart"
        >
          <img src="@/assets/img/二级交换机@1x.png" alt="二级交换机" />
          <span>二级交换机</span>
        </div>
        <div 
          class="draggable-node" 
          draggable="true" 
          data-type="switch3"
          @dragstart="handleDragStart"
        >
          <img src="@/assets/img/三级交换机@1x.png" alt="三级交换机" />
          <span>三级交换机</span>
        </div>
        <div 
          class="draggable-node" 
          draggable="true" 
          data-type="firewall"
          @dragstart="handleDragStart"
        >
          <img src="@/assets/img/防火墙@1x.png" alt="防火墙" />
          <span>防火墙</span>
        </div>
        <div 
          class="draggable-node" 
          draggable="true" 
          data-type="gateway"
          @dragstart="handleDragStart"
        >
          <img src="@/assets/img/网闸@1x.png" alt="网闸" />
          <span>网闸</span>
        </div>
        <div 
          class="draggable-node" 
          draggable="true" 
          data-type="database"
          @dragstart="handleDragStart"
        >
          <img src="@/assets/img/数据库@1x.png" alt="数据库" />
          <span>数据库</span>
        </div>
        <div 
          class="draggable-node" 
          draggable="true" 
          data-type="ip"
          @dragstart="handleDragStart"
        >
          <img src="@/assets/img/专网IP@1x.png" alt="专网IP" />
          <span>专网IP</span>
        </div>
      </div>
      <div class="panel-footer">
        <button class="btn btn-primary" @click="handleConfirm">确定</button>
        <button class="btn btn-default" @click="handleEdit">编辑</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AntvX6 from '@/components/antvX6/index.vue'

const draggedNodeType = ref('')
const antvX6Ref = ref<InstanceType<typeof AntvX6>>()
const graphContainerRef = ref<HTMLDivElement>()

// 处理节点拖拽开始事件
const handleDragStart = (event: DragEvent) => {
  const target = event.target as HTMLElement
  const nodeElement = target.closest('.draggable-node')
  if (nodeElement) {
    draggedNodeType.value = nodeElement.getAttribute('data-type') || ''
    // event.dataTransfer : 拖拽数据传输对象，用于在拖拽过程中存储和传递数据
    event.dataTransfer?.setData('nodeType', draggedNodeType.value)
  }
}

/**
 * 处理节点拖拽释放事件
 * 当用户从操作面板拖拽节点到画布区域并释放时触发
 * @param event - 拖拽事件对象，包含拖拽相关信息
 */
const handleDrop = (event: DragEvent) => {
  // 阻止浏览器默认行为（防止打开链接等默认拖拽行为）
  event.preventDefault()
  
  // 从拖拽数据中获取节点类型（在 handleDragStart 中设置的）
  const nodeType = event.dataTransfer?.getData('nodeType')
  
  // 检查必要条件：节点类型存在、AntV X6 组件实例存在、图表容器存在
  if (nodeType && antvX6Ref.value && graphContainerRef.value) {
    
    // ========== 步骤1：获取容器的位置信息 ==========
    // getBoundingClientRect() 返回元素相对于视口的位置和尺寸信息
    // 包含：left, top, right, bottom, width, height
    const rect = graphContainerRef.value.getBoundingClientRect()
    
    // ========== 步骤2：计算鼠标相对于容器的坐标 ==========
    // event.clientX/Y 是鼠标相对于浏览器视口的坐标
    // 减去 rect.left/top 得到相对于 graph-container 的坐标
    const clientX = event.clientX - rect.left  // 鼠标在容器内的 X 坐标
    const clientY = event.clientY - rect.top   // 鼠标在容器内的 Y 坐标
    
    // ========== 步骤3：获取 AntV X6 图表实例 ==========
    // 通过组件暴露的 getGraph 方法获取图表实例
    const graph = antvX6Ref.value.getGraph()
    
    // ========== 步骤4：坐标转换并创建节点 ==========
    if (graph) {
      // clientToLocal() 将 DOM 坐标转换为画布本地坐标
      // 因为画布可能有缩放、平移，DOM 坐标和画布坐标系不一致
      // 例如：画布缩放 50% 后，DOM 坐标 (100, 100) 对应画布坐标 (200, 200)
      const localPoint = graph.clientToLocal({ x: clientX, y: clientY })
      
      // 调用组件的 createNode 方法创建节点
      // 参数：节点类型、X坐标、Y坐标
      antvX6Ref.value.createNode(nodeType, localPoint.x, localPoint.y)
    } else {
      // 降级处理：如果无法获取图表实例，直接使用 DOM 坐标创建节点
      // 这种情况通常发生在图表未初始化完成时
      antvX6Ref.value.createNode(nodeType, clientX, clientY)
    }
  }
}

// 处理节点拖拽悬停事件
const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}

// 处理确定按钮点击
const handleConfirm = () => {
  console.log('确定按钮被点击')
}

// 处理编辑按钮点击
const handleEdit = () => {
  console.log('编辑按钮被点击')
}
</script>
<style scoped lang="less">
.home-container {
  position: relative;
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.graph-container {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

.operation-panel {
  width: 200px;
  height: 100%;
  background: #f5f5f5;
  border-left: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}

.panel-title {
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
  background: #fff;
}

.panel-content {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  overflow-y: auto;
}

.panel-footer {
  padding: 15px;
  border-top: 1px solid #ddd;
  background: #fff;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  
  &:active {
    transform: scale(0.98);
  }
}

.btn-primary {
  background: #42b883;
  color: white;
  
  &:hover {
    background: #3aa876;
  }
}

.btn-default {
  background: #fff;
  color: #333;
  border: 1px solid #ddd;
  
  &:hover {
    background: #f5f5f5;
    border-color: #ccc;
  }
}

.draggable-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: move;
  transition: all 0.3s;
  user-select: none;

  &:hover {
    border-color: #42b883;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  &:active {
    cursor: grabbing;
  }

  img {
    width: 40px;
    height: 40px;
    object-fit: contain;
    margin-bottom: 5px;
  }

  span {
    font-size: 12px;
    color: #333;
    text-align: center;
  }
}

.action-btn {
  padding: 10px 15px;
  border: none;
  background: #42b883;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;

  &:hover {
    background: #3aa876;
  }

  &:active {
    background: #359670;
  }
}
</style>