import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ErrorIcon from '@mui/icons-material/Error';
/* import database  from '../contexts/LocalDatabase'; */ // Removed database import

export default function Signup() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const { signup } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('user'); // default to "user"
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        if (passwordRef.current.value !== confirmPasswordRef.current.value) {
            return setError('The passwords do not match');
        }

        try {
            setError('');
            setLoading(true);

            // const userCredential = await signup(
            await signup(
                emailRef.current.value,
                passwordRef.current.value,
                role // Pass the selected role here
            );

            // const userId = userCredential.user.uid; // Not needed if AuthContext handles persistence

            // Store role in LocalDatabase - this line might not be needed if role is already handled in AuthContext's signup
            /* database.saveUser(userId, { email: emailRef.current.value, role }); */ // Removed direct database call

            navigate('/login'); // Redirect to login page after successful signup
        } catch (err) {
            setError('Account creation failed: ' + err.message);
        }
        setLoading(false);
    }

    return (
        <Container>
            <RegisterContainer>
                <h3>Signup</h3>
                <hr />

                {error && (
                    <ErrorComponent>
                        <ErrorIcon className="error_icon" />
                        {error}
                    </ErrorComponent>
                )}

                <form onSubmit={handleSubmit}>
                    <Email>
                        <label htmlFor="email">Email Address</label>
                        <input id="email" type="email" ref={emailRef} required />
                    </Email>
                    <Password>
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" ref={passwordRef} required />
                    </Password>
                    <ConfirmPassword>
                        <label htmlFor="confirm_password">Confirm Password</label>
                        <input
                            id="confirm_password"
                            type="password"
                            ref={confirmPasswordRef}
                            required
                        />
                    </ConfirmPassword>

                    <RoleSelect>
                        <label>Register as:</label>
                        <div>
                            <input
                                type="radio"
                                id="userRole"
                                name="role"
                                value="user"
                                checked={role === "user"}
                                onChange={() => setRole("user")}
                            />
                            <label htmlFor="userRole">User</label>
                            <input
                                type="radio"
                                id="adminRole"
                                name="role"
                                value="admin"
                                checked={role === "admin"}
                                onChange={() => setRole("admin")}
                            />
                            <label htmlFor="adminRole">Admin</label>
                        </div>
                    </RoleSelect>

                    <Submit>
                        <button disabled={loading} type="submit">
                            Sign Up
                        </button>
                    </Submit>
                </form>
                <LoginText>
                    <h6>
                        Already Have an Account? <Link to="/login">Login</Link>
                    </h6>
                </LoginText>
            </RegisterContainer>
        </Container>
    );
}

// Styled components remain same as your code, except adding RoleSelect:
const Container = styled.div`
    width: 100%;
    min-height: calc(100vh - 60px); /* Adjust for header height */
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f2f5; /* Match global background */
    padding: 20px 0;
`;
const ErrorComponent = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c0392b; /* Muted red for error text */
    font-weight: 500; /* Slightly less bold */
    background-color: #fdecea; /* Very light red background */
    margin: 15px 11%; /* Adjusted margin */
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #e74c3c; /* Red border */

    .error_icon {
        transform: scale(0.9); /* Slightly larger icon */
        margin-right: 8px; /* Added spacing */
    }
`;
const RegisterContainer = styled.div`
    width: 450px;
    /* margin: auto; */
    padding: 40px 0; /* Adjusted padding */
    border-radius: 10px;
    background-color: #ffffff; /* White background */
    box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px; /* Softer shadow */

    h3 {
        text-align: center;
        margin-bottom: 20px; /* Increased margin */
        font-size: 28px; /* Larger heading */
        color: #333;
    }

    hr {
        margin: 0 11%;
        border: none;
        border-top: 1px solid #eee; /* Subtle separator */
    }

    form {
        margin: 20px 40px;

        input[type="email"],
        input[type="password"] {
            width: 100%; /* Make input take full width */
            font-size: 16px; /* Slightly larger font */
            padding: 10px 0; /* Increased vertical padding */
            border: none;
            border-bottom: 1px solid #ccc; /* Lighter border */
            background-color: transparent;
            transition: border-bottom-color 0.3s ease; /* Smooth transition */
            
            &:focus {
                outline: none;
                border-bottom-color: #0582c3; /* Blue on focus */
            }
        }
        label {
            display: block; /* Make label a block element */
            margin-left: 0;
            margin-bottom: 8px; /* Spacing below label */
            font-size: 14px;
            color: #555;
        }
    }
`;
const Email = styled.div`
    display: block; /* Change to block for stacked labels/inputs */
    padding-top: 15px; /* Adjusted padding */
    margin-bottom: 20px; /* More spacing between fields */
`;
const Password = styled.div`
    display: block; /* Change to block for stacked labels/inputs */
    padding-top: 15px; /* Adjusted padding */
    margin-bottom: 20px; /* More spacing between fields */
`;
const ConfirmPassword = styled.div`
    display: block; /* Change to block for stacked labels/inputs */
    padding-top: 15px; /* Adjusted padding */
    margin-bottom: 20px; /* More spacing between fields */
`;
const RoleSelect = styled.div`
    display: block; /* Change to block */
    padding-top: 15px;
    margin-bottom: 20px;
    
    label {
        margin-bottom: 10px; /* Spacing for role label */
        color: #555;
        font-size: 14px;
    }

    div {
        display: flex;
        gap: 20px; /* Space between radio buttons */
        justify-content: center;
    }

    input[type="radio"] {
        margin-right: 5px;
        accent-color: #0582c3; /* Primary color for radio button */
        cursor: pointer;
    }

    label[for="userRole"], label[for="adminRole"] {
        margin-left: 0; /* Adjust for new layout */
        display: inline-flex;
        align-items: center;
        font-size: 15px;
        color: #333;
        cursor: pointer;
    }
`;
const Submit = styled.div`
    text-align: center;
    margin: 30px 0 10px 0;
    padding: 0;
    
    button {
        height: 45px;
        padding: 0 25px;
        margin-bottom: 10px;
        background: #0582c3;
        color: white;
        border: none;
        border-radius: 5px;
        width: 100%;
        cursor: pointer;
        font-size: 17px;
        font-weight: 600;
        letter-spacing: 0.5px;
        transition: background-color 0.3s ease, transform 0.2s ease;

        &:hover {
            background-color: #0468a3;
            transform: translateY(-2px);
        }
        &:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
            transform: translateY(0);
        }
    }
`;
const LoginText = styled.div`
    text-align: center;
    font-size: 15px;
    margin-top: 20px;
    color: #666;
    h6 {
        a {
            text-decoration: none;
            cursor: pointer;
            color: #0582c3;
            font-weight: 500;
            &:hover {
                color: #0468a3;
                text-decoration: underline;
            }
        }
    }
`;
