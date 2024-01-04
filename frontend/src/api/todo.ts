import axios from 'axios'
const taskClient = axios.create({
  baseURL: 'http://127.0.0.1:5000/tasks',
})

export interface TodoItem {
  id: number | null
  title: string
  description?: string
  completed: boolean
  isEdit?: boolean
  timestamp?: number
  show?: boolean
}

export const getTodos = () => taskClient.get('')

export const addTodos = (newTodo: TodoItem) => taskClient.post('', newTodo)

export const editTodo = (todoId: number, editTodo: TodoItem) =>
  taskClient.put(`/${todoId}`, editTodo)

export const removeTodos = (todoId: number) => taskClient.delete(`/${todoId}`)
