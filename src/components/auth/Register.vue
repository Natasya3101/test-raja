<template>
    <div class="container d-flex justify-content-center align-items-center">
      <div class="card p-4 shadow" >
        <h4 class="text-center mb-4">Register</h4>
        <form @submit.prevent="register">
            <div class="mb-3">
            <label for="email" class="form-label fw-medium">Email</label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="email"
              required
            />
          </div>
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
  
          <button type="submit" class="btn btn-success w-100 rounded-pill">
            Register
          </button>
        </form>
  
        <div class="text-center mt-3">
          <small>Sudah punya akun? 
            <router-link to="/" class="text-decoration-none">
              Login di sini
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
  const email = ref('')
  const password = ref('')
  
  const register = async () => {
    try {
      const response = await fetch('http://94.74.86.174:8080/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.value,
          email: email.value,
          password: password.value,
        }),
      })
  
      const result = await response.json()
      console.log(result)
  
      if (!response.ok) {
        alert('Gagal registrasi: ' + result.message)
        return
      }
  
      alert('Registrasi berhasil! Silakan login.')
      router.push('/')
    } catch (error) {
      console.error('Register error:', error)
      alert('Terjadi kesalahan: ' + error.message)
    }
  }
  </script>
  