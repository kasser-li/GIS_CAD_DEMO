<template>
  <div class="map-view">
    <div class="top-nav">
      <div class="logo">GIS地理信息系统</div>
      <div class="project-select">
        <el-select v-model="selectedProject" placeholder="选择项目">
          <el-option v-for="project in projects" :key="project.id" :label="project.name" :value="project.id" />
        </el-select>
      </div>
      <div class="user-menu">
        <el-dropdown>
          <span class="user">管理员</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    
    <div class="main-content">
      <div class="left-panel">
        <div class="panel-title">图层管理</div>
        <div class="layer-list">
          <div v-for="layer in layers" :key="layer.id" class="layer-item">
            <el-checkbox v-model="layer.visible">{{ layer.name }}</el-checkbox>
          </div>
        </div>
      </div>
      
      <div class="map-container">
        <MapContainer />
        <div class="toolbar">
          <el-button @click="setTool('select')">选择</el-button>
          <el-button @click="setTool('marker')">标点</el-button>
          <el-button @click="setTool('line')">画线</el-button>
          <el-button @click="setTool('polygon')">画面</el-button>
          <el-button @click="setTool('measure')">测量</el-button>
          <el-button @click="toggleFullscreen">全屏</el-button>
        </div>
      </div>
      
      <div class="right-panel">
        <div class="panel-title">属性面板</div>
        <div v-if="selectedMarker" class="marker-properties">
          <el-form :model="selectedMarker" label-width="80px">
            <el-form-item label="名称">
              <el-input v-model="selectedMarker.name" />
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="selectedMarker.type">
                <el-option label="普通点" value="normal" />
                <el-option label="重要点" value="important" />
                <el-option label="监测点" value="monitor" />
                <el-option label="设备点" value="device" />
                <el-option label="危险点" value="danger" />
              </el-select>
            </el-form-item>
            <el-form-item label="描述">
              <el-input type="textarea" v-model="selectedMarker.description" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveMarker">保存</el-button>
              <el-button @click="deleteMarker">删除</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-else class="no-selection">
          请选择一个标注点
        </div>
      </div>
    </div>
    
    <div class="bottom-bar">
      <div class="coordinates">坐标: {{ coordinates.lng }}, {{ coordinates.lat }}</div>
      <div class="scale">比例尺: 1:1000</div>
      <div class="current-action">当前操作: {{ currentAction }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MapContainer from '../../components/map/MapContainer.vue'

const selectedProject = ref('')
const projects = ref([
  { id: '1', name: '北京市项目' },
  { id: '2', name: '上海市项目' },
  { id: '3', name: '广州市项目' }
])

const layers = ref([
  { id: '1', name: '底图', visible: true },
  { id: '2', name: 'DWG图层', visible: true },
  { id: '3', name: '标注点', visible: true },
  { id: '4', name: '绘制图层', visible: true }
])

const selectedMarker = ref(null)
const coordinates = ref({ lng: '116.4074', lat: '39.9042' })
const currentAction = ref('选择')

function setTool(tool: string) {
  currentAction.value = {
    'select': '选择',
    'marker': '标点',
    'line': '画线',
    'polygon': '画面',
    'measure': '测量'
  }[tool] || '选择'
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

function saveMarker() {
  // 保存标注点
  console.log('保存标注点', selectedMarker.value)
}

function deleteMarker() {
  // 删除标注点
  console.log('删除标注点', selectedMarker.value)
  selectedMarker.value = null
}

onMounted(() => {
  selectedProject.value = projects.value[0].id
})
</script>

<style scoped>
.map-view {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.top-nav {
  height: 60px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  padding: 0 20px;
  justify-content: space-between;
}

.logo {
  font-size: 18px;
  font-weight: bold;
  color: #1890ff;
}

.project-select {
  flex: 1;
  max-width: 300px;
  margin: 0 20px;
}

.user {
  cursor: pointer;
  padding: 0 10px;
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.left-panel,
.right-panel {
  width: 300px;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  overflow-y: auto;
}

.right-panel {
  border-right: none;
  border-left: 1px solid #e8e8e8;
}

.panel-title {
  padding: 15px;
  font-weight: bold;
  border-bottom: 1px solid #e8e8e8;
}

.layer-list {
  padding: 10px;
}

.layer-item {
  padding: 8px 0;
}

.map-container {
  flex: 1;
  position: relative;
}

.toolbar {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
  background: #fff;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.toolbar button {
  margin-right: 8px;
}

.marker-properties {
  padding: 15px;
}

.no-selection {
  padding: 40px 20px;
  text-align: center;
  color: #999;
}

.bottom-bar {
  height: 40px;
  background: #fff;
  border-top: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  padding: 0 20px;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}
</style>
