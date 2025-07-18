<template>
  <div class="container py-5">

    <!-- Baris tombol tambah -->
    <div class="d-flex justify-content-end mb-3">
  <router-link
    to="/create"
    class="btn btn-primary rounded-pill d-flex align-items-center"
  >
    <i class="bi bi-plus-circle me-2"></i> Tambah Checklist
  </router-link>
</div>


    <!-- Form input checklist -->
    <div v-if="showForm" class="mb-4">
      <input
        v-model="newChecklistName"
        type="text"
        class="form-control mb-2"
        placeholder="Nama Checklist"
      />
      <button class="btn btn-success" @click="addChecklist">Simpan</button>
      <button class="btn btn-secondary ms-2" @click="showForm = false">Batal</button>
    </div>

    <div class="row g-4">
      <div
        v-for="(item, index) in checklists"
        :key="item.id"
        class="col-md-4"
      >
        <div :class="['p-3 rounded shadow position-relative', getColorClass(index)]">
        <!-- Tombol Aksi Checklist (Tambah + Hapus) -->
        <div class="d-flex pb-4 justify-content-between align-items-center mt-2 gap-2">
          <button class="btn btn-sm btn-outline-primary d-flex align-items-center gap-1" @click="addItem(item.id)">
            <i class="bi bi-plus-circle"></i>
          </button>

          <button class="btn btn-sm btn-danger d-flex align-items-center gap-1" @click="deleteChecklist(item.id)">
            <i class="bi bi-trash-fill"></i>
          </button>
        </div>


          <h5 class="fw-bold">{{ item.name }}</h5>
          <hr />
          <ul>
          <li v-for="itm in item.items" :key="itm.id">{{ itm.name }}</li>
        </ul>

        </div>
      </div>
    </div>
  </div>
  <!-- Modal Tambah Item -->
<div
  v-if="showItemForm"
  class="modal fade show d-block"
  tabindex="-1"
  style="background-color: rgba(0, 0, 0, 0.5)"
>
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Tambah Item ke Checklist</h5>
        <button type="button" class="btn-close" @click="closeItemForm"></button>
      </div>
      <div class="modal-body">
        <input
          v-model="newItemName"
          type="text"
          class="form-control"
          placeholder="Nama item"
        />
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="closeItemForm">Batal</button>
        <button class="btn btn-success" @click="submitNewItem">Simpan</button>
      </div>
    </div>
  </div>
</div>

</template>

<script setup>
import { ref, onMounted } from 'vue'

const checklists = ref([])
const loading = ref(true)
// State form item
const showItemForm = ref(false)
const newItemName = ref('')
const selectedChecklistId = ref(null)

// Buka form item
const addItem = (checklistId) => {
  selectedChecklistId.value = checklistId
  showItemForm.value = true
}

// Tutup form item
const closeItemForm = () => {
  showItemForm.value = false
  newItemName.value = ''
  selectedChecklistId.value = null
}

// Submit item ke backend
const submitNewItem = async () => {
  const token = localStorage.getItem('token')
  if (!token || !selectedChecklistId.value || !newItemName.value.trim()) {
    alert('Data tidak lengkap.')
    return
  }

  try {
    const response = await fetch(
      `http://94.74.86.174:8080/api/checklist/${selectedChecklistId.value}/item`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemName: newItemName.value }),
      }
    )

    const result = await response.json()

    if (response.ok) {
      alert('Item berhasil ditambahkan.')
      fetchChecklists()
      closeItemForm()
    } else {
      alert('Gagal menambahkan item: ' + result.message)
    }
  } catch (error) {
    alert('Terjadi kesalahan: ' + error.message)
  }
}
const addChecklist = async () => {
  const token = localStorage.getItem('token')
  if (!newChecklistName.value.trim()) return
  try {
    await fetch('http://94.74.86.174:8080/api/checklist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newChecklistName.value }),
    })

    newChecklistName.value = ''
    showForm.value = false
    await fetchChecklists()
  } catch (e) {
    alert('Gagal tambah checklist: ' + e.message)
  }
}
const fetchChecklists = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    alert('Token tidak ditemukan. Silakan login.')
    loading.value = false
    return
  }

  try {
    const response = await fetch('http://94.74.86.174:8080/api/checklist', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const result = await response.json()

    if (response.ok && Array.isArray(result.data)) {
      // Simpan checklist dan tambahkan items kosong
      checklists.value = result.data.map(cl => ({
        ...cl,
        items: [], // akan diisi nanti
      }))

      // Untuk setiap checklist, ambil item-nya
      for (const checklist of checklists.value) {
        await fetchChecklistItems(checklist.id)
      }
    } else {
      alert('Gagal mengambil data checklist: ' + result.message)
    }
  } catch (error) {
    console.error(error)
    alert('Terjadi kesalahan: ' + error.message)
  } finally {
    loading.value = false
  }
}

const fetchChecklistItems = async (checklistId) => {
  const token = localStorage.getItem('token')
  try {
    const response = await fetch(`http://94.74.86.174:8080/api/checklist/${checklistId}/item`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const result = await response.json()

    console.log('Items untuk checklist', checklistId, result) // ⬅️ Tambahkan ini

    if (response.ok && Array.isArray(result.data)) {
      const checklist = checklists.value.find(c => c.id === checklistId)
      if (checklist) {
        checklist.items = result.data
      }
    } else {
      console.error('Gagal fetch item:', result.message)
    }
  } catch (error) {
    console.error('Error fetch item:', error.message)
  }
}


// Warna bootstrap dinamis berdasarkan index
const colorClasses = [
  'bg-light',     // abu-abu terang
  'bg-warning',   // kuning
  'bg-success',   // hijau
  'bg-info',      // biru muda
  'bg-danger',    // merah
  'bg-primary',   // biru
  'bg-secondary', // abu tua
]

const getColorClass = (index) => {
  return colorClasses[index % colorClasses.length]
}


const deleteChecklist = async (id) => {
  const token = localStorage.getItem('token')
  if (!token) {
    alert('Token tidak ditemukan.')
    return
  }

  const confirmDelete = confirm('Yakin ingin menghapus checklist ini?')
  if (!confirmDelete) return

  try {
    const response = await fetch(`http://94.74.86.174:8080/api/checklist/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const result = await response.json()

    if (!response.ok) {
      alert('Gagal menghapus checklist: ' + result.message)
      return
    }

    alert('Checklist berhasil dihapus.')
    fetchChecklists()
  } catch (error) {
    alert('Terjadi kesalahan: ' + error.message)
  }
}


// Jalankan saat komponen dimuat
onMounted(fetchChecklists)
</script>  