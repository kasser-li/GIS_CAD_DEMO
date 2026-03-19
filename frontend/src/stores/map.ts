import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Marker {
  id: string
  name: string
  type: 'normal' | 'important' | 'monitor' | 'device' | 'danger'
  coordinates: { lng: number; lat: number }
  description?: string
  visible: boolean
  status: 'active' | 'deleted'
}

export const useMapStore = defineStore('map', () => {
  const markers = ref<Marker[]>([])
  const selectedMarker = ref<Marker | null>(null)
  const activeTool = ref('select')
  
  const visibleMarkers = computed(() => 
    markers.value.filter(m => m.visible && m.status === 'active')
  )
  
  function addMarker(marker: Omit<Marker, 'id' | 'visible' | 'status'>) {
    const newMarker: Marker = {
      ...marker,
      id: Date.now().toString(),
      visible: true,
      status: 'active'
    }
    markers.value.push(newMarker)
    return newMarker
  }
  
  function updateMarker(id: string, data: Partial<Marker>) {
    const index = markers.value.findIndex(m => m.id === id)
    if (index > -1) {
      markers.value[index] = { ...markers.value[index], ...data }
    }
  }
  
  function deleteMarker(id: string) {
    const index = markers.value.findIndex(m => m.id === id)
    if (index > -1) {
      markers.value[index].status = 'deleted'
    }
  }
  
  function selectMarker(marker: Marker | null) {
    selectedMarker.value = marker
  }
  
  function setActiveTool(tool: string) {
    activeTool.value = tool
  }
  
  return {
    markers,
    selectedMarker,
    activeTool,
    visibleMarkers,
    addMarker,
    updateMarker,
    deleteMarker,
    selectMarker,
    setActiveTool
  }
})
