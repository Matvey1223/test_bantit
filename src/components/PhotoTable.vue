<script setup>
import {ref, computed, onMounted} from 'vue'
import {usePhotosStore} from '@/stores/photos.js'

const store = usePhotosStore()

const chunk = 30
const shown = ref(chunk)

const container = ref(null)

function handleScroll() {
  const el = container.value
  if (!el) return
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
    // догружаем ещё
    if (shown.value < store.photos.length) shown.value += chunk
  }
}

const visiblePhotos = computed(() => store.photos.slice(0, shown.value))

onMounted(() => {
  watch(() => store.photos, () => {
    shown.value = chunk
  })
})
</script>

<template>
  <div class="max-w-[600px] w-full">
    <div
        ref="container"
        @scroll="handleScroll"
        class="h-[600px] overflow-y-auto scrollbar-thin border rounded-lg"
    >
      <div v-if="store.loading" class="p-6 text-center text-gray-500">Загрузка...</div>

      <table v-else class="w-full text-sm">
        <thead class="sticky top-0 bg-white dark:bg-gray-900 shadow">
        <tr class="text-left">
          <th
              v-for="col in columns"
              :key="col.key"
              class="cursor-pointer p-2 border-b"
              @click="store.toggleSort(col.key)"
          >
            {{ col.label }}
          </th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="row in visiblePhotos" :key="row.id" class="odd:bg-gray-50 dark:odd:bg-gray-800">
          <td v-for="col in columns" :key="col.key" class="p-2 border-b">
            <span class="block truncate" :title="row[col.key]">{{ row[col.key] }}</span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        {key: 'id', label: 'Ид'},
        {key: 'albumId', label: 'Альбом'},
        {key: 'title', label: 'Название'},
        {key: 'url', label: 'Ссылка'},
        {key: 'thumbnailUrl', label: 'Миниатюра'}
      ]
    }
  }
}
</script>

<style scoped>
td:nth-child(3) {
  max-width: 200px;
}
</style>