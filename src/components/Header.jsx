import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'
import database from '../contexts/LocalDatabase';

function Header() {
    const [error, setError] = useState("")
    const { currentUser, logout, isAdmin } = useAuth()
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    async function handleLogout() {
        setError("")

        try {
            await logout()
            navigate("/login")
        } catch {
            setError("Failed to log out")
        }
    }

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    }

    const closeDropdown = () => {
        setShowDropdown(false)
    }

    useEffect(() => {
        if (!currentUser) return
        const value = database.getUser(currentUser.uid)
        // setUserObject(value) // This state is removed
    }, [currentUser]) // Added currentUser to dependencies

    // Remove this useEffect as isAdmin is now from AuthContext
    // useEffect(() => {
    //     if (!currentUser) return
    //     const value = database.isAdmin(currentUser.uid)
    //     setUserAdmin(value)
    //     console.log(value)
    // }, [])

    // Removed redundant useEffect
    // useEffect(() => {
    //     if (!currentUser) return
    //     // setUserObject(database.getUser(currentUser.uid)) // This state is removed
    // }, [])

    console.log("the current user from the realtime database is as below")
    console.log(JSON.stringify(currentUser))
    // console.log(JSON.stringify(userAdmin)) // Remove this console.log
    // console.log(JSON.stringify(userObject)) // This state is removed

    return (
        <Container>
            <Logo>
                {/* <Link to="/">BlogApp</Link> */}
                <Link to="/"> </Link>
            </Logo>

            <NavMenu>
                <NavItem>
                    <Link to="/">Home</Link>
                </NavItem>

                {currentUser && isAdmin && (
                    <NavItem>
                        <Link to="/create-post">Write</Link>
                    </NavItem>
                )}
                {currentUser && isAdmin && (
                    <NavItem>
                        <Link to="/admin">Admin</Link>
                    </NavItem>
                )}
            </NavMenu>

            <ProfileSection>
                {currentUser ? (
                    <UserContainer>
                        <UserProfile onClick={toggleDropdown}>
                            {currentUser.photoURL ? (
                                <img src={currentUser.photoURL} alt="Profile" />
                            ) : (
                                <AccountCircleIcon className="icon" />
                            )}
                        </UserProfile>
                        {showDropdown && (
                            <DropdownMenu>
                                <DropdownItem>
                                    <Link to="/update-profile">Update Profile</Link>
                                </DropdownItem>
                                {!isAdmin && (
                                    <DropdownItem>
                                        <Link to="/myBlogs">My Blogs</Link>
                                    </DropdownItem>
                                )}
                                <DropdownItem onClick={handleLogout}>
                                    <ExitToAppIcon />
                                    <span>Log Out</span>
                                </DropdownItem>
                            </DropdownMenu>
                        )}
                    </UserContainer>
                ) : (
                    <AuthLinks>
                        <Link to="/signup">Sign Up</Link>
                        <Link to="/login">Log In</Link>
                    </AuthLinks>
                )}
            </ProfileSection>
        </Container>
    )
}

export default Header

const Container = styled.div`
    background-color: var(--color-background-card); /* White background */
    border-bottom: 1px solid var(--color-border); /* Subtle bottom border */
    height: 70px;
    padding: 0 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px; /* Subtle shadow */
`

const Logo = styled.div`
    a {
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--color-primary); /* Primary blue for logo */
    }
`

const NavMenu = styled.ul`
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
`

const NavItem = styled.li`
    margin-left: 30px;

    a {
        font-size: 1.0rem;
        font-weight: 500;
        color: var(--color-text-medium);
        position: relative;

        &:after {
            content: '';
            height: 2px;
            background-color: var(--color-primary);
            position: absolute;
            bottom: -5px;
            left: 0;
            right: 0;
            transform: scaleX(0);
            transition: transform 0.2s ease-in-out;
        }

        &:hover::after {
            transform: scaleX(1);
        }
    }
`

const ProfileSection = styled.div`
    display: flex;
    align-items: center;
`

const UserContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`

const UserProfile = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid var(--color-border);
    transition: border-color 0.2s ease-in-out;

    &:hover {
        border-color: var(--color-primary);
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .icon {
        font-size: 40px;
        color: var(--color-text-light);
    }
`

const DropdownMenu = styled.div`
    position: absolute;
    top: 55px; /* Position below the profile picture */
    right: 0;
    background-color: var(--color-background-card);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
    min-width: 160px;
    z-index: 1000;
    padding: 5px 0;
`

const DropdownItem = styled.div`
    padding: 10px 15px;
    cursor: pointer;
    font-size: 0.95rem;
    color: var(--color-text-dark);
    display: flex;
    align-items: center;

    &:hover {
        background-color: var(--color-background-page);
    }

    a {
        color: inherit;
        text-decoration: none;
        display: block; /* Make link fill the entire dropdown item */
        width: 100%;
    }

    .icon {
        margin-right: 10px;
        color: var(--color-text-medium);
    }
`

const AuthLinks = styled.div`
    display: flex;
    gap: 20px;

    a {
        font-size: 1.0rem;
        font-weight: 500;
        color: var(--color-text-medium);
        position: relative;

        &:after {
            content: '';
            height: 2px;
            background-color: var(--color-primary);
            position: absolute;
            bottom: -5px;
            left: 0;
            right: 0;
            transform: scaleX(0);
            transition: transform 0.2s ease-in-out;
        }

        &:hover::after {
            transform: scaleX(1);
        }
    }
`


