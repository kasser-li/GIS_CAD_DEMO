<template>
  <div ref="mapRef" class="map-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const mapRef = ref<HTMLElement>()
let map: L.Map

onMounted(() => {
  map = L.map(mapRef.value!, {
    center: [39.9042, 116.4074],
    zoom: 12,
    zoomControl: false
  })
  
  // 添加高德地图底图
  L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
    subdomains: '1234'
  }).addTo(map)
  
  // 添加缩放控制
  L.control.zoom({ position: 'bottomright' }).addTo(map)
  
  // 添加比例尺
  L.control.scale().addTo(map)
  
  // 添加示例标注点
  const markers = [
    { name: '天安门', lat: 39.9042, lng: 116.4074, type: 'important' },
    { name: '故宫', lat: 39.9163, lng: 116.3972, type: 'normal' },
    { name: '颐和园', lat: 39.9997, lng: 116.2755, type: 'normal' },
    { name: '八达岭长城', lat: 40.3598, lng: 116.0208, type: 'important' }
  ]
  
  markers.forEach(marker => {
    L.marker([marker.lat, marker.lng])
      .addTo(map)
      .bindPopup(`<b>${marker.name}</b>`)
  })
  
  // 添加示例多边形
  const beijingCenter = L.polygon([
    [39.95, 116.35],
    [39.95, 116.45],
    [39.85, 116.45],
    [39.85, 116.35]
  ]).addTo(map)
  
  beijingCenter.bindPopup('北京市中心')
})

onUnmounted(() => {
  map?.remove()
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
}
</style>
