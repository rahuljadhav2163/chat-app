import axios from 'axios'
import React, { useState } from 'react'

function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name , setName] = useState('')
  

  const signup = async () => {
    const responce = await axios.post("/signup",
        {
            fullName:name,
            email: email,
            password: password,

        });

    if (responce?.data?.success) {
        alert("Signup Succesfully")
        window.location.href = "login";
    } else {
        alert("Signup Succesfully")
        window.location.href = "/";
    }
}

  return (
    <div>
      <div className='container'>
        <h1 className='text-center mt-5'>Signup</h1>

        <input type="text"
          placeholder="Username" value={name}
          onChange={e => setName(e.target.value)}
          className='form-control mt-5'
        />

        <input type="text"
          placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)}
          className='form-control mt-5'
        />

        <input type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className='form-control mt-5'
        />

        <button onClick={signup} type='button'
          className='btn btn-primary d-block mt-5 w-50 mx-auto'
        >
          Signup
        </button>

        <p className="mt-4 text-center">
          Already have an account? <a href="/login">login here</a>.
        </p>
      </div>
    </div >
  )
}

export default Signup
