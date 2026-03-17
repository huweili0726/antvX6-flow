<template>
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
</template>

<script setup lang="ts">

const emit = defineEmits<{
  confirm: []
  edit: []
}>()

// 处理拖动节点开始事件
const handleDragStart = (event: DragEvent) => {
  const target = event.target as HTMLElement
  const nodeElement = target.closest('.draggable-node')
  if (nodeElement) {
    const nodeType = nodeElement.getAttribute('data-type') || ''
    event.dataTransfer?.setData('nodeType', nodeType)
  }
}

// 处理确认按钮点击事件
const handleConfirm = () => {
  emit('confirm')
}

// 处理编辑按钮点击事件
const handleEdit = () => {
  emit('edit')
}
</script>

<style scoped lang="less">
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
</style>
