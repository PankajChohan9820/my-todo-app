import React, { useState, useContext, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../App'
import { Box, Button, TextField, Typography } from '@mui/material'

function AddUser() {
  const [user, setUser] = useState({ name: '', email: '', password: '' })
  const navigate = useNavigate()

  const { setIsLoggedIn } = useContext(AuthContext)
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleAddUser = () => {
    // Make an API request to add a new user
    axios
      .post('/users', user)
      .then((response) => {
        console.log('User added successfully!')
        setUser({
          name: user.email,
          email: user.email,
          password: user.password,
        })
        setIsLoggedIn(true) // Update the isLoggedIn state to true
        navigate('/')
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <Box className="add-user-container">
      <Typography variant={'h4'} component={'h2'} className="add-user-heading">
        Add User
      </Typography>
      <Box component={'form'} className="add-user-form">
        <TextField
          type="text"
          name="name"
          placeholder="Name"
          value={user.name}
          onChange={handleInputChange}
        />
        <TextField
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleInputChange}
        />
        <TextField
          type="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleInputChange}
        />
        <Button
          className="add-user-button"
          type="button"
          onClick={handleAddUser}
        >
          Add User
        </Button>
      </Box>
    </Box>
  )
}

export default AddUser
