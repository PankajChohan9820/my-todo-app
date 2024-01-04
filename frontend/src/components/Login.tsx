import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../App'
import { Box, Button, TextField, Typography } from '@mui/material'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Access the isLoggedIn state and setIsLoggedIn function from the AuthContext
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext)

  const handleLogin = () => {
    // Make an API request to perform login
    axios
      .post('/login', { email, password })
      .then((response) => {
        console.log('Login successful!')
        setIsLoggedIn(true) // Update the isLoggedIn state to true
        navigate('/')
      })
      .catch((error) => {
        console.error(error)
        setError('Invalid email or password')
      })
  }

  const handleSignup = () => {
    navigate('/sign-up')
  }

  return (
    <Box display={'flex'} justifyContent={'center'} width={'100%'}>
      <Box maxWidth={'sm'} width={'100%'} textAlign={'center'}>
        <Typography variant={'h2'} component={'h4'} color={'primary'}>
          Login Page
        </Typography>
        {error && (
          <Typography variant={'subtitle1'} color={'error'} mt={3}>
            {error}
          </Typography>
        )}
        <Box
          component={'form'}
          display={'flex'}
          flexDirection={'column'}
          gap={4}
          mt={3}
        >
          <TextField
            variant={'filled'}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant={'filled'}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="login-button" type="button" onClick={handleLogin}>
            Login
          </Button>
        </Box>
        <Typography variant={'subtitle2'} mt={3}>
          Don't have an account?{' '}
          <button
            className="signup-button"
            type="button"
            onClick={handleSignup}
          >
            Signup
          </button>
        </Typography>
      </Box>
      {/* <p className="isLoggedIn-text">isLoggedIn: {isLoggedIn ? 'true' : 'false'}</p> Display the value of isLoggedIn */}
    </Box>
  )
}

export default Login
