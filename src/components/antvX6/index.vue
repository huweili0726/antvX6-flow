<template>
  <div class="flow-container" ref="graphContainer" />
  <div class="minimap-container" ref="minimapContainer" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGraph } from '@/composables/useGraph'

const graphContainer = ref<HTMLDivElement>()
const minimapContainer = ref<HTMLDivElement>()

onMounted(() => {
  useGraph(graphContainer.value!, minimapContainer.value!)
})
</script>
<style scoped lang="less">
.flow-container {
  width: 100%;
  height: 100%;
}
.minimap-container {
  position: absolute;
  top: 10px;
  left: 10px;
  width: auto;
  height: auto;
  border: 1px solid black;
}
</style>
