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
    <!-- ① добавили overflow-x-hidden -->
    <div
        ref="container"
        @scroll="handleScroll"
        class="h-[600px] overflow-y-auto overflow-x-hidden scrollbar-thin border rounded-lg"
    >
      <!-- Loader -->
      <div v-if="store.loading" class="p-6 text-center text-gray-500">Загрузка…</div>

      <!-- ② table-fixed + text-ellipsis/truncate -->
      <table v-else class="w-full table-fixed text-sm">
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
        <tr
            v-for="row in visiblePhotos"
            :key="row.id"
            class="odd:bg-gray-50 dark:odd:bg-gray-800"
        >
          <td v-for="col in columns" :key="col.key" class="p-2 border-b">
            <!-- truncate уже обрежет и добавит … -->
            <span
                class="block truncate whitespace-nowrap"
                :title="row[col.key]"
            >
                {{ row[col.key] }}
              </span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
th:nth-child(1), td:nth-child(1) { width: 60px;   }
th:nth-child(2), td:nth-child(2) { width: 80px;   }
th:nth-child(3), td:nth-child(3) { width: 220px;  }
th:nth-child(4), td:nth-child(4) { width: 140px;  }
th:nth-child(5), td:nth-child(5) { width: 100px;  }
</style>

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