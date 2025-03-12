import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css'
import {AiOutlinePlus} from 'react-icons/ai'
import Todo from './components/Todo'
import {db, auth} from './components/firebase'
import{query, collection, onSnapshot, updateDoc, doc, addDoc, deleteDoc,} from 'firebase/firestore'
import Register from './components/Register'
import Login from './components/Login'
import { signOut } from 'firebase/auth';

const style = {
  bg: `min-h-screen w-full flex justify-center items-center p-4 bg-gradient-to-r from-[#2F80ED] to-[#1CB5E0]`,
  container: `bg-slate-100 max-w-[500px] w-full rounded-md shadow-xl p-4`,
  heading: `text-3xl font-bold text-center text-gray-800 p-2`,
  form: `flex justify-between`,
  input: `border p-2 w-full text-xl bg-slate-200 text-black`,
  button: `border p-4 ml-2 bg-purple-100 text-slate-100`,
  count: `text-center p-2 text-black`,
  navbar: `w-full bg-white shadow-md flex justify-between items-center px-4 py-3`,
  navTitle: `text-3xl font-semibold text-gray-800`,
  loginButton: `bg-blue-500 text-black px-4 py-2 rounded-md hover:bg-blue-600 transition`
};

function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [user, setUser] = useState(null);

// create todo
const createTodo = async (e) => {
  e.preventDefault(); // prevent page reloading
  if (input === '') {
    alert('Todo is empty');
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert('You must be logged in to add todos.');
    return;
  }

  // Reference to the user's todos collection
  const userTodosRef = collection(db, `users/${user.uid}/todos`);

  await addDoc(userTodosRef, {
    text: input,
    completed: false,
  });

  setInput(''); // set back to empty after adding
};

// Track authentication state
useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    setUser(user); // This updates your user state
  });
  return () => unsubscribe();
}, []);

// read todo from firebase
useEffect(() => {
  let unsubscribeSnapshot = () => {};
  
  if (user) {
    const userTodosRef = collection(db, `users/${user.uid}/todos`);
    const q = query(userTodosRef);
    
    unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
      const todosArr = [];
      querySnapshot.forEach((doc) => {
        todosArr.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArr);
    });
  } else {
    setTodos([]); // Clear todos when logged out
  }

  return () => unsubscribeSnapshot();
}, [user]); // Now depends on user state

// update todo in firebase
const toggleComplete = async (todo) => {
  const user = auth.currentUser;
  if (!user) return;

  await updateDoc(doc(db, `users/${user.uid}/todos/${todo.id}`), {
    completed: !todo.completed
  });
};


// delete todo
const deleteTodo = async (id) => {
  const user = auth.currentUser;
  if (!user) return;

  await deleteDoc(doc(db, `users/${user.uid}/todos/${id}`));
};

// handle logout
const handleLogout = async () => {
  try {
    await signOut(auth);
    // Optional: Add any additional cleanup or redirect
  } catch (error) {
    console.error('Error logging out:', error);
  }
};


  return (
    <Router>
      {/* Navbar */}
      <nav className={style.navbar}>
        <h1 className={style.navTitle}>Todo App</h1>
        <div className="flex items-center gap-4">
          {user && <span className="text-gray-600">Welcome, {user.email}</span>}
          {user ? (
            <button onClick={handleLogout} className={style.loginButton} style={{color: 'white' }}>
              Logout
            </button>
          ) : (
            <Link to="/login" className={style.loginButton} style={{color: 'white' }}>
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Page Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <div className={style.bg}>
              <div className={style.container}>
                <h3 className={style.heading}>Todo App</h3>
                <form onSubmit={createTodo} className={style.form}>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className={style.input}
                    type="text"
                    placeholder="Add Todo"
                  />
                  <button className={style.button}>
                    <AiOutlinePlus size={30} />
                  </button>
                </form>
                <ul>
                  {todos.map((todo, index) => (
                    <Todo key={index} todo={todo} toggleComplete={toggleComplete} deleteTodo={deleteTodo} />
                  ))}
                </ul>
                <p className={style.count}>{`You have ${todos.length} todos`}</p>
              </div>
            </div>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App
 