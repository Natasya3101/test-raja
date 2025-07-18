
  
  <template>
    <div class="container py-5">
      <div class="card p-4 shadow">
        <h4 class="text-center mb-4">Buat Checklist Baru</h4>
  
        <form @submit.prevent="createChecklist">
          <div class="mb-3">
            <label for="name" class="form-label">Nama Checklist</label>
            <input
              type="text"
              id="name"
              class="form-control"
              v-model="name"
              required
            />
          </div>
  
          <button type="submit" class="btn btn-success w-100 rounded-pill">
            Simpan Checklist
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const name = ref('')
  
  const createChecklist = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Token tidak ditemukan. Silakan login.')
      return
    }
  
    try {
      // Ambil semua checklist yang ada
      const getResponse = await fetch('http://94.74.86.174:8080/api/checklist', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      const existingChecklists = await getResponse.json()
  
      if (!Array.isArray(existingChecklists.data)) {
        alert('Gagal mengambil checklist.')
        return
      }
  
      // Cek apakah name sudah ada
      const isNameExist = existingChecklists.data.some(
        (checklist) => checklist.name === name.value
      )
  
      if (isNameExist) {
        alert('Checklist dengan nama ini sudah ada.')
        return
      }
  
      // Kirim request buat checklist baru
      const createResponse = await fetch('http://94.74.86.174:8080/api/checklist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.value }),
      })
  
      const result = await createResponse.json()
  
      if (!createResponse.ok) {
        alert('Gagal membuat checklist: ' + result.message)
        return
      }
  
      alert('Checklist berhasil dibuat!')
      name.value = ''
    } catch (error) {
      console.error('Error:', error)
      alert('Terjadi kesalahan: ' + error.message)
    }
  }
  </script>
  
  
  
  