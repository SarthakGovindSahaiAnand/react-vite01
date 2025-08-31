import React, { useRef, useState } from 'react';
import styled from 'styled-components'
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext'
import ErrorIcon from '@mui/icons-material/Error';

// Assuming 'database' is correctly imported and initialized from '../firebase'
import database  from '../contexts/LocalDatabase'; 

export default function Login() {

    const emailRef = useRef();
    const passwordRef = useRef();
    // Destructure 'login' function from your AuthContext
    const { login } = useAuth(); 
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    // Initialize useNavigate hook
    const navigate = useNavigate(); 
    // You might not need currentUser and logout directly in Login for its core function,
    // but keeping it here if it's used elsewhere in the component's lifecycle.
    const { /* currentUser, logout */ } = useAuth(); 

    async function handleSubmit (e){
        e.preventDefault();
        
        try {
            setError('');
            setLoading(true);
            // Call the login function from your AuthContext
            await login(emailRef.current.value, passwordRef.current.value);
            
            // The 'currentUser' might not be immediately updated here after login
            // due to the asynchronous nature of authentication state changes.
            // Consider using onAuthStateChanged in a higher-level component or context.
            // console.log(currentUser); // Removed currentUser console log
            
            // Corrected: Use 'navigate' from useNavigate hook
            navigate('/'); // Redirect to home page

        } catch (err) {
            // Log the actual error for debugging purposes
            console.error("Login failed:", err); 
            setError('Failed to Log In. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    }
    
    return (        
        <Container>
            <RegisterContainer>
                <h3>Log In</h3>
                <hr/>
               
                {/* This code checks if there's an error and displays an error component */}
                {error && 
                    <ErrorComponent>
                        <ErrorIcon className="error_icon"/>
                        {error}
                    </ErrorComponent>
                }

                <form onSubmit={handleSubmit}>
                    <Email>
                        <label htmlFor="email">Email Address</label>
                        <input id="email" type="email" ref={emailRef} required />
                    </Email>
                    <Password>
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" ref={passwordRef} required />
                    </Password>
                   
                    <Submit>
                        <button disabled={loading} type="submit">Log In</button>
                    </Submit>
                </form>
                <ForgotPasswordText>
                    <h6><Link to="/forgot-password">Forgot Password</Link></h6>
                </ForgotPasswordText>
                <SignupText>
                    <h6>Need an Account? <Link to="/signup">Sign Up</Link></h6>
                </SignupText>
            </RegisterContainer>
        </Container>
    );
}

const Container = styled.div`
    width: 100%;
    min-height: calc(100vh - 60px); /* Adjust for header height */
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f2f5; /* Match global background */
    padding: 20px 0;
`
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

    .error_icon{
        transform: scale(0.9); /* Slightly larger icon */
        margin-right: 8px; /* Added spacing */
    }
`

const RegisterContainer = styled.div`
    width: 450px;
    /* margin: auto; */
    padding: 40px 0; /* Adjusted padding */
    border-radius: 10px;
    background-color: #ffffff; /* White background */
    box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px; /* Softer shadow */

    h3{
        text-align: center;
        margin-bottom: 20px; /* Increased margin */
        font-size: 28px; /* Larger heading */
        color: #333;
    }

    hr{
        margin: 0 11%;
        border: none;
        border-top: 1px solid #eee; /* Subtle separator */
    }
    
    form{
        margin:  20px 40px;

        input{
            width: 100%; /* Make input take full width */
            /* margin-right: 10px; */
            font-size: 16px; /* Slightly larger font */
            padding: 10px 0; /* Increased vertical padding */
            border: none;
            border-bottom: 1px solid #ccc; /* Lighter border */
            background-color: transparent;
            transition: border-bottom-color 0.3s ease; /* Smooth transition */
            
            :focus{
                outline: none;
                border-bottom-color: #0582c3; /* Blue on focus */
            }
        }
        label{
            display: block; /* Make label a block element */
            margin-left: 0;
            margin-bottom: 8px; /* Spacing below label */
            font-size: 14px;
            color: #555;
        }
    }
`
const Email = styled.div`
    display: block; /* Change to block for stacked labels/inputs */
    /* justify-content: space-between; */
    /* align-items: center; */
    padding-top: 15px; /* Adjusted padding */
    /* height: 30px; */
    margin-bottom: 20px; /* More spacing between fields */
`
const Password = styled.div`
    display: block; /* Change to block for stacked labels/inputs */
    /* justify-content: space-between; */
    /* align-items: center; */
    padding-top: 15px; /* Adjusted padding */
    /* height: 30px; */
    margin-bottom: 20px; /* More spacing between fields */
`
const Submit = styled.div`
    text-align: center;
    margin: 30px 0 10px 0; /* Adjusted margins */
    padding: 0;
    
    button{
        height: 45px; /* Slightly taller button */
        padding: 0 25px; /* Increased padding */
        margin-bottom: 10px; /* Increased margin */
        background: #0582c3; /* Primary blue color */
        color: white;
        border: none;
        border-radius: 5px; /* Slightly more rounded */
        width: 100%;
        cursor: pointer;
        font-size: 17px;
        font-weight: 600;
        letter-spacing: 0.5px;
        transition: background-color 0.3s ease, transform 0.2s ease;

        &:hover {
            background-color: #0468a3; /* Darker blue on hover */
            transform: translateY(-2px); /* Lift effect */
        }
        &:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
            transform: translateY(0); /* No lift when disabled */
        }
    }
`
const SignupText = styled.div`
    text-align: center;
    font-size: 15px; /* Adjusted font size */
    margin-top: 20px; /* Increased margin */
    color: #666;
    h6{
        a{
            text-decoration: none; /* Remove underline by default */
            cursor: pointer;
            color: #0582c3; /* Primary blue for links */
            font-weight: 500;
            &:hover {
                color: #0468a3;
                text-decoration: underline; /* Underline on hover */
            }
        }
    }
`
const ForgotPasswordText = styled.div`
    text-align: center;
    font-size: 15px; /* Adjusted font size */
    margin-top: 15px; /* Adjusted margin */
    color: #666;
    h6{
        a{
            text-decoration: none; /* Remove underline by default */
            cursor: pointer;
            color: #0582c3; /* Primary blue for links */
            font-weight: 500;
            &:hover {
                color: #0468a3;
                text-decoration: underline; /* Underline on hover */
            }
        }
    }
`
