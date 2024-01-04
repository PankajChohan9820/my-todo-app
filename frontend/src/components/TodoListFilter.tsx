import { useState, MouseEvent, FC, ReactNode } from 'react'
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import {
  Ballot,
  Check,
  FilterAlt,
  KeyboardArrowDown,
  QuestionMark,
} from '@mui/icons-material'
import { TodoItem } from '../api/todo'

export type FilterKeys = 'all' | 'pending' | 'completed'

interface TodoListFilterProps {
  filter: FilterKeys
  setFilter: (e: FilterKeys) => void
  todos: TodoItem[]
}

interface FilterOption {
  key: FilterKeys
  value: string
  icon: ReactNode
}

const filterOptions: FilterOption[] = [
  {
    key: 'all',
    value: 'All',
    icon: <Ballot color={'info'} />,
  },
  {
    key: 'pending',
    value: 'Pending',
    icon: <QuestionMark color={'warning'} />,
  },
  {
    key: 'completed',
    value: 'Completed',
    icon: <Check color={'success'} />,
  },
]

const TodoListFilter: FC<TodoListFilterProps> = ({
  filter,
  setFilter,
  todos,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const getCount = (filter: FilterKeys) => {
    if (filter === 'pending') {
      return todos.filter((e) => !e.completed).length
    } else if (filter === 'completed') {
      return todos.filter((e) => e.completed).length
    } else {
      return todos.length
    }
  }

  return (
    <>
      <Button
        variant="outlined"
        disableElevation
        onClick={handleClick}
        startIcon={<FilterAlt />}
        endIcon={<KeyboardArrowDown />}
        sx={{
          height: 'max-content',
          borderRadius: '18px',
        }}
      >
        {`${filterOptions.find((e) => e.key === filter)?.value} (${getCount(
          filter
        )})`}
      </Button>
      <Menu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {filterOptions.map(({ key, value, icon }) => (
          <MenuItem
            key={key}
            onClick={() => {
              setFilter(key)

              handleClose()
            }}
            selected={filter === key}
            disableRipple
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText>{value}</ListItemText>
            <Typography pl={2} variant="body2" color="text.secondary">
              {getCount(key)}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default TodoListFilter
