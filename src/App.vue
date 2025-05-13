<script setup>
import { ref, watchEffect, onMounted } from 'vue'
import { usePhotosStore } from './stores/photos.js'
import PhotoTable from './components/PhotoTable.vue'

const store      = usePhotosStore()
const idsInput   = ref(localStorage.getItem('albumIds') || '')
const darkMode   = ref(JSON.parse(localStorage.getItem('darkmode') ?? 'false'))

/* --- запрос при старте --- */
onMounted(() => search())

/* --- поиск --- */
function search() {
  const ids = idsInput.value.trim()
      .split(/\s+/)
      .filter(Boolean)
  store.fetchPhotos(ids)
}

watchEffect(() => {
  localStorage.setItem('albumIds', idsInput.value)
})

function toggleTheme() {
  darkMode.value = !darkMode.value
  localStorage.setItem('darkmode', darkMode.value)
  document.documentElement.classList.toggle('dark', darkMode.value)
}

onMounted(() => document.documentElement.classList.toggle('dark', darkMode.value))
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-start gap-4 p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200">

    <!-- Фильтр -->
    <div class="flex flex-wrap items-center gap-2">
      <input
          v-model="idsInput"
          placeholder="ID альбомов (напр. 1 2 3)"
          class="px-3 py-2 border rounded focus:outline-none focus:ring w-64"
      />
      <button
          :disabled="store.loading"
          @click="search"
          class="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50 flex items-center gap-2"
      >
        <svg v-if="store.loading" class="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span>Поиск</span>
      </button>

      <!-- Тумблер темы -->
      <button @click="toggleTheme" class="ml-auto p-2 rounded bg-gray-200 dark:bg-gray-700">
        {{ darkMode ? '🌙' : '☀️' }}
      </button>
    </div>

    <!-- Таблица -->
    <PhotoTable class="mx-auto" />
  </div>
</template>