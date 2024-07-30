import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Login() {
    var redirect = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [label, setLabel] = useState<string | null>(null);


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        try {
            const response = await fetch('/api/login', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
    
            if (response.status == 403 || response.status == 404) {
                setLabel("Password or Username is incorrect.");
            } else {
                // Save the token in local storage
                const data = await response.json();
                localStorage.setItem('token', data.token);

                // Redirect to a protected route
                redirect('/');
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <>
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