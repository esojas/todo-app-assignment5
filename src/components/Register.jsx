import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase';
import{query, collection, onSnapshot, updateDoc, doc, addDoc, deleteDoc, setDoc} from 'firebase/firestore'

const style = {
    container: `min-h-screen flex items-center justify-center bg-gradient-to-r from-[#2F80ED] to-[#1CB5E0]`,
    form: `bg-white p-8 rounded-lg shadow-md w-96`,
    heading: `text-2xl font-bold text-center text-gray-800 mb-4`,
    input: `w-full p-2 border border-gray-300 rounded-md mb-4 text-black`,
    button: `w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition`,
    text: `text-center text-gray-600 mt-2`
};

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    //Handle register
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // Save user data to Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                createdAt: new Date(),
            });

            alert('Registration Successful!');
            navigate('/');
        } catch (error) {
            console.log(error.message);
            alert(error.message);
        }
    };

    return (
        <div className={style.container}>
            <form onSubmit={handleSubmit} className={style.form}>
                <h2 className={style.heading}>Register</h2>
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
                <input 
                    type="password" 
                    placeholder="Confirm Password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    className={style.input} 
                />
                <button type="submit" className={style.button}>Register</button>
                <p className={style.text}>Already have an account? <Link to="/login" className="text-blue-500 cursor-pointer">Login</Link></p>
                <Link to="/" className="mt-4 text-blue-500 block text-center">Back to Home</Link>
            </form>
        </div>
    );
};

export default Register;