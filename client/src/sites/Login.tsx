import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Cookies from 'js-cookie';

function Login() {
    var navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [label, setLabel] = useState<string | null>(null);
    const server_path = localStorage.getItem('server_path');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        try {
            const response = await fetch(server_path + '/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.status === 403 || response.status === 404) {
                setLabel("Password or Username is incorrect.");
            } else {
                const data = await response.json();
                Cookies.set('token', data.token, { expires: 1 / 24 });

                navigate('/');
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <>
        <h3>Login</h3>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="username">Email address</label>
                <input type="text" className="form-control" id="username" placeholder="Enter email"
                onChange={(e) => setUsername(e.target.value)}  />
                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>

            <div className="mb-3">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" placeholder="Password"
                onChange={(e) => setPassword(e.target.value)} />
            </div>

            {label && (
                <div className="mb-3">
                    <label style={{ color: 'red' }}>{label}</label>
                </div>
            )}

            <button type="submit" className="btn btn-primary">Submit</button>
        </form>

        <a href="/register">Register</a>
        </>
    );
}

export default Login;