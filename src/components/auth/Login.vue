<template>
    <div class="container d-flex justify-content-center align-items-center">
      <div class="card p-4 shadow" >
        <h4 class="text-center mb-4">Login</h4>
        <form @submit.prevent="login">
          <div class="mb-3">
            <label for="username" class="form-label fw-medium">Username</label>
            <input
              type="text"
              class="form-control"
              id="username"
              v-model="username"
              required
            />
          </div>
  
          <div class="mb-3">
            <label for="password" class="form-label fw-medium">Password</label>
            <input
              type="password"
              class="form-control"
              id="password"
              v-model="password"
              required
            />
          </div>
  
          <button type="submit" class="btn btn-primary w-100 rounded-pill">
            Login
          </button>
        </form>
  
        <!-- Tambahkan teks dan link ke register -->
        <div class="text-center mt-3">
          <small>Belum punya akun? 
            <router-link to="/register" class="text-decoration-none">
              Daftar di sini
            </router-link>
          </small>
        </div>
      </div>
    </div>
</template>
  
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')

const login = async () => {
  try {
    const response = await fetch('http://94.74.86.174:8080/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      alert('Login gagal: ' + result.message)
      return
    }

    // ✅ Simpan token ke localStorage
    localStorage.setItem('token', result.data.token)
    localStorage.setItem('username', result.data.username)

    alert('Login berhasil!')
    console.log('Token:', result.data.token)

    // ✅ Arahkan ke halaman setelah login (jika ada)
    router.push('/checklist')
  } catch (error) {
    console.error('Login error:', error)
    alert('Terjadi kesalahan: ' + error.message)
  }
}
</script>

  
  
  


  