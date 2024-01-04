import React, { Fragment, useEffect, useMemo, useState } from 'react'
import {
  addTodos,
  editTodo,
  getTodos,
  removeTodos,
  TodoItem,
} from '../api/todo'
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import {
  AddCircle,
  CalendarToday,
  Delete,
  Edit,
  Save,
} from '@mui/icons-material'
import { StaticDatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import TodoListFilter, { FilterKeys } from './TodoListFilter'

const blankTodo: TodoItem = {
  id: null,
  title: '',
  description: '',
  completed: false,
  isEdit: true,
}

function TodoList() {
  const [dateDialogOpen, setDateDialogOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>()
  const [todoItems, setTodoItems] = useState<TodoItem[]>([blankTodo])
  const [filter, setFilter] = useState<FilterKeys>('all')

  const anyActiveTodo = useMemo(
    () => todoItems.some((e) => e.isEdit),
    [todoItems]
  )

  const closeDialog = () => {
    setEditIndex(null)
    setDateDialogOpen(false)
  }

  useEffect(() => {
    loadTodos()
  }, [])

  const addBlankTodo = () => {
    const todos = [...todoItems]
    if (!anyActiveTodo) {
      todos.push({ ...blankTodo })
      setTodoItems(todos)
    }
  }

  const editTodoFields = (
    index: number,
    field: keyof TodoItem,
    value: string | number | boolean
  ) => {
    const newTodos = [...todoItems]
    const todoItem: TodoItem = newTodos[index]
    if (todoItem) {
      //@ts-ignore
      todoItem[field] = value
    }
    newTodos[index] = todoItem
    setTodoItems([...newTodos])
  }

  const loadTodos = () => {
    getTodos()
      .then((response) => {
        if (response.data) setTodoItems(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handleAddUpdateTask = (index: number, todo: TodoItem) => {
    if (todo.id == null) {
      addTodos(todo)
        .then(({ data }) => {
          if (data.id) {
            editTodoFields(index, 'id', data.id)
          }
        })
        .catch((error) => {
          console.error(error)
        })
    } else {
      editTodo(todo.id, todo).catch((error) => {
        console.error(error)
      })
    }
    editTodoFields(index, 'isEdit', false)
  }

  const deleteTodo = (todoId: number) => {
    removeTodos(todoId)
      .then(() => {
        setTodoItems((prevTodos) => {
          return prevTodos.filter((e) => e.id !== todoId)
        })
      })
      .catch((e) => {
        console.error(e)
      })
  }

  const filteredTodos = useMemo(
    () =>
      todoItems.map((value) => {
        if (filter === 'completed') {
          value.show = value.completed
        } else if (filter === 'pending') {
          value.show = !value.completed
        } else {
          value.show = true
        }
        return value
      }),
    [todoItems, filter]
  )

  return (
    <>
      <Box>
        <Box sx={{ mt: 4 }}>
          <Box
            sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <Box
              component={Paper}
              elevation={2}
              sx={{ maxWidth: 'sm', width: '100%', p: 4 }}
            >
              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography
                  color={'primary'}
                  variant={'h4'}
                  fontWeight={700}
                  mb={4}
                  component={'h2'}
                >
                  To Do List
                </Typography>
                <TodoListFilter
                  filter={filter}
                  setFilter={setFilter}
                  todos={todoItems}
                />
              </Box>

              {filteredTodos.map((value, index) => {
                if (!value.show) {
                  return <Fragment key={value.id} />
                }
                return (
                  <List key={value.id} dense>
                    <ListItem
                      secondaryAction={
                        !value.isEdit && (
                          <>
                            <IconButton
                              color={'warning'}
                              title={'Edit'}
                              onClick={() => {
                                editTodoFields(index, 'isEdit', true)
                              }}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              color={'error'}
                              title={'Delete'}
                              onClick={() => {
                                value.id && deleteTodo(value.id)
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </>
                        )
                      }
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          key={Math.random()}
                          checked={value.completed}
                          onChange={(event) => {
                            const checked = event.target.checked
                            editTodoFields(index, 'completed', checked)
                            handleAddUpdateTask(index, {
                              ...value,
                              completed: checked,
                            })
                          }}
                          tabIndex={-1}
                          disabled={value.id == null}
                          title={
                            value.id == null
                              ? 'Please save the To Do item before marking it complete'
                              : undefined
                          }
                          disableRipple
                        />
                      </ListItemIcon>
                      {value.isEdit ? (
                        <Box
                          display={'flex'}
                          width={'100%'}
                          alignItems={'start'}
                        >
                          <Box
                            display={'flex'}
                            flexDirection={'column'}
                            width={'100%'}
                          >
                            <TextField
                              InputProps={{
                                sx: {
                                  fontSize: '24px',
                                },
                                endAdornment: (
                                  <InputAdornment position={'end'}>
                                    <IconButton
                                      color={'info'}
                                      onClick={() => {
                                        setDateDialogOpen(true)
                                        setEditIndex(index)
                                      }}
                                    >
                                      <CalendarToday fontSize={'small'} />
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                              autoFocus={value.isEdit}
                              variant={'standard'}
                              value={value.title}
                              placeholder={'Todo'}
                              onChange={(e) => {
                                editTodoFields(index, 'title', e.target.value)
                              }}
                            />
                            <TextField
                              variant={'standard'}
                              value={value.description}
                              placeholder={'Description'}
                              onChange={(e) => {
                                editTodoFields(
                                  index,
                                  'description',
                                  e.target.value
                                )
                              }}
                            />
                          </Box>
                          <Box mt={0.25}>
                            <IconButton
                              disabled={value.title.trim().length < 1}
                              color={'success'}
                              onClick={() => handleAddUpdateTask(index, value)}
                              title={
                                value.title.trim().length < 1
                                  ? 'Please enter a valid todo item'
                                  : undefined
                              }
                            >
                              <Save />
                            </IconButton>
                          </Box>
                        </Box>
                      ) : (
                        <ListItemText
                          primaryTypographyProps={{
                            fontSize: '24px',
                          }}
                          secondaryTypographyProps={{
                            fontSize: '16px',
                          }}
                          primary={value.title}
                          secondary={`${value.description} ${
                            value.timestamp
                              ? `(${dayjs(value.timestamp).format(
                                  'MMM DD, YYYY'
                                )})`
                              : ''
                          }`}
                        />
                      )}
                    </ListItem>
                  </List>
                )
              })}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 4,
                }}
              >
                <Button
                  color={'success'}
                  size={'large'}
                  sx={{
                    borderRadius: '50px',
                  }}
                  onClick={addBlankTodo}
                  disabled={anyActiveTodo}
                  startIcon={<AddCircle />}
                  title={
                    anyActiveTodo ? 'Please save any existing todo' : undefined
                  }
                >
                  Add Task
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Dialog open={dateDialogOpen} onClose={() => closeDialog()}>
        <DialogContent>
          <StaticDatePicker
            defaultValue={dayjs(new Date())}
            onClose={() => closeDialog()}
            onAccept={(e) => {
              if (e && editIndex != null) {
                const time = e.unix() * 1000
                editTodoFields(editIndex, 'timestamp', time)
                closeDialog()
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TodoList
