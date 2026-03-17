# Flow Vue3 TypeScript 项目

一个基于 Vue 3 + TypeScript + AntV X6 的流程图编辑器项目，支持拖拽创建节点、连线、编辑等交互功能。

## 技术栈

| 技术/依赖 | 版本 | 用途 |
|---------|------|------|
| Vue | ^3.5.22 | 前端框架 |
| TypeScript | ^5.9.3 | 类型系统 |
| Vite | ^7.1.11 | 构建工具 |
| Vue Router | ^4.6.3 | 路由管理 |
| Pinia | ^3.0.4 | 状态管理 |
| AntV X6 | ^3.1.5 | 图编辑引擎 |
| @vueuse/core | ^14.2.1 | Vue 组合式工具库 |
| uuid | ^13.0.0 | UUID 生成 |
| Less | ^4.5.1 | CSS 预处理器 |

## 项目结构

```
├── src/
│   ├── assets/              # 静态资源
│   │   ├── css/             # 样式文件
│   │   │   └── index.css    # 节点样式
│   │   └── img/             # 图片资源（交换机、防火墙等图标）
│   ├── components/          # 全局组件
│   │   └── antvX6/          # X6 图表组件
│   │       └── index.vue    # 图表渲染组件
│   ├── composables/         # 组合式函数
│   │   └── useGraph.ts      # 图表逻辑封装
│   ├── router/              # 路由配置
│   │   └── index.ts         # 路由定义
│   ├── stores/              # Pinia 状态管理
│   │   └── graph.ts         # 图表状态存储
│   ├── views/               # 页面视图
│   │   └── flow/            # 流程图页面
│   │       ├── index.vue    # 主页面
│   │       └── control.vue  # 操作面板组件
│   ├── App.vue              # 根组件
│   ├── main.ts              # 入口文件
│   └── style.css            # 全局样式
├── public/                  # 公共资源
├── package.json             # 项目配置
├── tsconfig.json            # TypeScript 配置
└── vite.config.ts           # Vite 配置
```

## 功能特性

### 节点操作
- 拖拽创建节点（交换机、防火墙、网闸、数据库、专网IP）
- 节点名称编辑
- 节点移动

### 连线操作
- 从节点锚点拖拽创建连线
- 曼哈顿路由算法（智能避障）
- 圆角连线样式
- 连线删除按钮

### 交互控制
- 画布拖拽与缩放
- 确定按钮：锁定画布、隐藏锚点和删除按钮
- 编辑按钮：解锁画布、显示锚点和删除按钮

### 其他功能
- 对齐线（Snapline）
- 小地图（MiniMap）
- 响应式布局

## 环境要求

- Node.js 18.x 或更高版本
- npm 9.x 或更高版本

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发服务器

启动本地开发服务器：

```bash
npm run dev
```

默认会在 http://localhost:5173 启动开发服务器。

### 构建生产版本

构建用于生产的应用：

```bash
npm run build
```

### 预览生产构建

预览生产构建结果：

```bash
npm run preview
```

## 核心模块说明

### useGraph 组合式函数

封装了 AntV X6 的核心逻辑：

| 方法 | 说明 |
|------|------|
| `initGraph` | 初始化图表实例 |
| `registerNodeTypes` | 注册自定义节点类型 |
| `createNodeByType` | 根据类型创建节点 |
| `confirmNodeName` | 确认节点名称 |
| `editNodeName` | 编辑节点名称 |
| `getAllNodesData` | 获取所有节点数据 |
| `getAllEdgesData` | 获取所有连线数据 |
| `hideEdgeRemoveButtons` | 隐藏连线删除按钮 |
| `showEdgeRemoveButtons` | 显示连线删除按钮 |
| `hideNodePorts` | 隐藏节点锚点 |
| `showNodePorts` | 显示节点锚点 |
| `disableGraphInteraction` | 禁用画布交互 |
| `enableGraphInteraction` | 启用画布交互 |

### 节点类型配置

| 类型 | 名称 | 图标 |
|------|------|------|
| switch1 | 一级交换机 | 一级交换机@1x.png |
| switch2 | 二级交换机 | 二级交换机@1x.png |
| switch3 | 三级交换机 | 三级交换机@1x.png |
| firewall | 防火墙 | 防火墙@1x.png |
| gateway | 网闸 | 网闸@1x.png |
| database | 数据库 | 数据库@1x.png |
| ip | 专网IP | 专网IP@1x.png |

## 开发说明

### 添加新节点类型

1. 在 `src/assets/img/` 添加节点图标
2. 在 `useGraph.ts` 的 `nodeTypes` 数组中添加配置：

```typescript
const nodeTypes = [
  { type: 'newType', name: '新节点', image: '新节点.png' },
  // ...
]
```

3. 在 `control.vue` 中添加拖拽元素：

```html
<div 
  class="draggable-node" 
  draggable="true" 
  data-type="newType"
  @dragstart="handleDragStart"
>
  <img src="@/assets/img/新节点.png" alt="新节点" />
  <span>新节点</span>
</div>
```

## 作者

- **huweili**
- Email: czxyhuweili@163.com