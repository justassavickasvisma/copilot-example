import { useState } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [categories, setCategories] = useState(['Personal', 'Work', 'Shopping'])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [newCategory, setNewCategory] = useState('')
  const [editingCategory, setEditingCategory] = useState(null)
  const [editCategoryValue, setEditCategoryValue] = useState('')

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { 
        id: Date.now(), 
        text: input, 
        completed: false,
        category: selectedCategory || 'Uncategorized'
      }])
      setInput('')
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()])
      setNewCategory('')
    }
  }

  const deleteCategory = (categoryToDelete) => {
    setCategories(categories.filter(cat => cat !== categoryToDelete))
    // Update todos that have this category to 'Uncategorized'
    setTodos(todos.map(todo =>
      todo.category === categoryToDelete ? { ...todo, category: 'Uncategorized' } : todo
    ))
    if (selectedCategory === categoryToDelete) {
      setSelectedCategory('')
    }
    if (filterCategory === categoryToDelete) {
      setFilterCategory('all')
    }
  }

  const startEditCategory = (category) => {
    setEditingCategory(category)
    setEditCategoryValue(category)
  }

  const saveEditCategory = () => {
    if (editCategoryValue.trim() && !categories.includes(editCategoryValue.trim())) {
      const oldCategory = editingCategory
      const newCategoryName = editCategoryValue.trim()
      
      // Update categories list
      setCategories(categories.map(cat => 
        cat === oldCategory ? newCategoryName : cat
      ))
      
      // Update todos with the old category
      setTodos(todos.map(todo =>
        todo.category === oldCategory ? { ...todo, category: newCategoryName } : todo
      ))
      
      // Update selected category if it was being edited
      if (selectedCategory === oldCategory) {
        setSelectedCategory(newCategoryName)
      }
      
      // Update filter if needed
      if (filterCategory === oldCategory) {
        setFilterCategory(newCategoryName)
      }
      
      setEditingCategory(null)
      setEditCategoryValue('')
    }
  }

  const cancelEditCategory = () => {
    setEditingCategory(null)
    setEditCategoryValue('')
  }

  const filteredTodos = filterCategory === 'all' 
    ? todos 
    : todos.filter(todo => todo.category === filterCategory)

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    return a.category.localeCompare(b.category)
  })

  return (
    <div className="App">
      <h1>Todo List</h1>
      
      {/* Category Management Section */}
      <div className="category-section">
        <h2>Manage Categories</h2>
        <div className="category-input">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCategory()}
            placeholder="Add new category..."
          />
          <button onClick={addCategory}>Add Category</button>
        </div>
        <div className="category-list">
          {categories.map(category => (
            <div key={category} className="category-item">
              {editingCategory === category ? (
                <>
                  <input
                    type="text"
                    value={editCategoryValue}
                    onChange={(e) => setEditCategoryValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && saveEditCategory()}
                  />
                  <button onClick={saveEditCategory} className="btn-save">Save</button>
                  <button onClick={cancelEditCategory} className="btn-cancel">Cancel</button>
                </>
              ) : (
                <>
                  <span>{category}</span>
                  <button onClick={() => startEditCategory(category)} className="btn-edit">Edit</button>
                  <button onClick={() => deleteCategory(category)} className="btn-delete">Delete</button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Todo Input Section */}
      <div className="todo-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new todo..."
        />
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="">Uncategorized</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button onClick={addTodo}>Add</button>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <label>Filter by category: </label>
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="Uncategorized">Uncategorized</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Todo List */}
      <ul className="todo-list">
        {sortedTodos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <div className="todo-content">
              <span className="todo-text">{todo.text}</span>
              <span className="todo-category">{todo.category}</span>
            </div>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
