import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePhotosStore = defineStore('photos', () => {
    const photos      = ref([])      // все полученные фото
    const loading     = ref(false)
    const sortBy      = ref('')      // текущий столбец
    const sortAsc     = ref(true)    // направление

    async function fetchPhotos(albumIds = []) {
        loading.value = true
        try {
            const query = albumIds.length
                ? albumIds.map(id => `albumId=${id}`).join('&')
                : ''
            const url = `https://jsonplaceholder.typicode.com/photos${query ? '?' + query : ''}`
            const res = await fetch(url)
            photos.value = await res.json()
            applySort()                   // если была сортировка, сохраняем
        } finally {
            loading.value = false
        }
    }

    function toggleSort(field) {
        if (sortBy.value === field) sortAsc.value = !sortAsc.value
        else {
            sortBy.value = field
            sortAsc.value = true
        }
        applySort()
    }

    function applySort() {
        if (!sortBy.value) return
        photos.value = [...photos.value].sort((a, b) => {
            const res = a[sortBy.value] > b[sortBy.value] ? 1 : -1
            return sortAsc.value ? res : -res
        })
    }

    return { photos, loading, fetchPhotos, toggleSort }
})