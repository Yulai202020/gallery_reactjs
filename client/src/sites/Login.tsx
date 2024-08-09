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
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                <h3 className="text-center mb-4">Login</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                    <label htmlFor="username" className="form-label">Email address</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="Enter email"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <small id="emailHelp" className="form-text text-muted">
                        We'll never share your email with anyone else.
                    </small>
                    </div>

                    <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    </div>

                    {label && (
                    <div className="mb-3">
                        <label style={{ color: 'red' }}>{label}</label>
                    </div>
                    )}

                    <button type="submit" className="btn btn-primary w-100">Submit</button>
                </form>

                <div className="mt-3 text-center">
                    <a href="/register">Register</a>
                </div>
                </div>
            </div>
        </div>
    );
}

export default Login;