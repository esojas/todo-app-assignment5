import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { auth, db } from './firebase';


const style = {
    container: `min-h-screen flex items-center justify-center bg-gradient-to-r from-[#2F80ED] to-[#1CB5E0]`,
    form: `bg-white p-8 rounded-lg shadow-md w-96`,
    heading: `text-2xl font-bold text-center text-gray-800 mb-4`,
    input: `w-full p-2 border border-gray-300 rounded-md mb-4 text-black`,
    button: `w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition`,
    text: `text-center text-gray-600 mt-2`
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
    
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User has logged in successfully!");
            navigate('/');
        } catch (error) {
            if (error.code === "auth/user-not-found") {
                setError("No account found with this email. Please register.");
            } else if (error.code === "auth/wrong-password") {
                setError("Incorrect password. Please try again.");
            } else if (error.code === "auth/invalid-email") {
                setError("Invalid email format.");
            } else {
                setError("Login failed. Please try again.");
            }
            console.error(error.message);
        }
    };
    

    return (
        <div className={style.container}>
            <form onSubmit={handleSubmit} className={style.form}>
                <h2 className={style.heading}>Login</h2>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className={style.input} 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className={style.input} 
                />
                <button type="submit" className={style.button}>Login</button>
                <p className={style.text}>Don't have an account? <Link to="/register" className="text-blue-500 cursor-pointer">Sign Up</Link></p>
                <Link to="/" className="mt-4 text-blue-500">Back to Home</Link>
            </form>
        </div>
    );
};

export default Login;

