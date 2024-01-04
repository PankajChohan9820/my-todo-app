import React, { Dispatch, SetStateAction, useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom'
import AddUser from './components/AddUser'
import Login from './components/Login'
import TodoList from './components/TodoList'
import {
  AppBar,
  Box,
  createTheme,
  ThemeProvider,
  Toolbar,
  useMediaQuery,
  Link as MuiLink,
  Button,
  Paper,
} from '@mui/material'
import { ThemeSwitch } from './components/Switch'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

interface IAuth {
  isLoggedIn: boolean
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>
}
// Create a context for login status
export const AuthContext = React.createContext<IAuth>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
})
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
})
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true) // Set the login status here based on your logic
  const [isDark, setDark] = useState(
    useMediaQuery('(prefers-color-scheme: dark)')
  )
  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
          <Router>
            <Paper
              elevation={6}
              sx={{
                m: 0,
                p: 0,
                height: '100vh',
                width: '100vw',
              }}
            >
              <AppBar color="default" position={'relative'} elevation={1}>
                <Toolbar disableGutters>
                  <Box component={'nav'} sx={{ width: '100%' }}>
                    <Box
                      component={'ul'}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        listStyle: 'none',
                      }}
                    >
                      <Box component={'li'}>
                        <MuiLink component={Link} to="/">
                          Home
                        </MuiLink>
                      </Box>
                      <Box display={'flex'}>
                        <Box>
                          <ThemeSwitch
                            checked={isDark}
                            onChange={() => setDark(!isDark)}
                          />
                        </Box>
                        {isLoggedIn ? (
                          <Box component={'li'}>
                            <Button
                              variant={'text'}
                              onClick={handleLogout}
                              color={'primary'}
                            >
                              Logout
                            </Button>
                          </Box>
                        ) : (
                          <Box component={'li'}>
                            <MuiLink component={Link} to="/login">
                              Login
                            </MuiLink>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Toolbar>
              </AppBar>
              <Box sx={{ p: { xs: 0, sm: 0, md: 2 } }}>
                <Routes>
                  <Route path="/sign-up" element={<AddUser />} />
                  <Route
                    path="/"
                    element={
                      isLoggedIn ? (
                        <TodoList />
                      ) : (
                        <Navigate to="/login" replace />
                      )
                    }
                  />
                  <Route path="/login" element={<Login />} />
                </Routes>
              </Box>
            </Paper>
          </Router>
        </AuthContext.Provider>
      </ThemeProvider>
    </LocalizationProvider>
  )
}

export default App