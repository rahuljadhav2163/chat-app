import axios from 'axios'
import React, { useState } from 'react'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const loginNow = async () => {
    try {
      const { data } = await axios.post('/login', { email, password });
      alert(data.message);
      if (data) {
        localStorage.setItem('user', JSON.stringify(data?.data));
        window.location.href = '/';
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div className='container'>
        <h1 className='text-center mt-5'>Login</h1>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className='form-control mt-5'
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className='form-control mt-5'
        />

        <button
          onClick={loginNow}
          type='button'
          className='btn btn-primary d-block mt-5 w-50 mx-auto'
        >
          Login
        </button>

        <p className="mt-4 text-center">
          Don't have an account? <a href="/signup">Sign up here</a>.
        </p>
      </div>
    </div>
  )
}

export default Login
