import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import Header from './Header'
import {useNavigate, Link} from 'react-router-dom'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import database from '../contexts/LocalDatabase.jsx';
import { useAuth } from '../contexts/AuthContext'
import SearchIcon from '@mui/icons-material/Search';

function Admin() {
    const [blogs, setBlogs] = useState([])
    const [users, setUsers] = useState([])
    const [isAdmin, setIsAdmin] = useState([])
    const [isDisabled, setDisabled] = useState([])
    const [adminButtonText, setAdminButtonText] = useState("Make Admin")
    // const [isUserAdmin, setIsUserAdmin] = useState("") // Remove this state

    const [filter, setFilter] = useState("")
    const [filteruser, setUserFilter] = useState("")

    const searchRef = useRef()
    const searchUserRef = useRef()
    const [blogToDeleted, setBlogToDeleted] = useState("")
    const navigate = useNavigate();

    const { currentUser, isAdmin: isAuthAdmin /* , deleteBlog */ } = useAuth() // Remove deleteBlog

    console.log("Admin: isAuthAdmin value:", isAuthAdmin);
    // const isUserAdmin = database.ref('/admin/' + currentUser.uid)

    // const isAdminUser = currentUser ? database.isAdmin(currentUser.uid) : false // Remove this variable

    useEffect(() => {
        if (!isAuthAdmin) { // Only load data if the current user is an admin
            return;
        }
        // Filter blogs to show only those by the current admin
        const adminBlogs = database.getBlogs().filter(blog => blog.userId === currentUser.uid);
        setBlogs(adminBlogs);

        const allUsers = database.getUsers()
        setUsers(allUsers)
        setIsAdmin(database.getAdmins())
        setDisabled(database.getDisabledUsers())


        // const value = database.isAdmin(currentUser.uid)
        // setIsUserAdmin(value)
        // console.log(JSON.stringify(value))

    }, [isAuthAdmin, currentUser]) // Re-run effect when isAuthAdmin or currentUser changes



    const handleChange = () => {
        setFilter(searchRef.current.value.toLowerCase())
        handleSearch()
    }

    const handleSearch = () => {
        console.log(searchRef.current.value)
        setFilter(searchRef.current.value.toLowerCase())
    }
    const handleUserChange = () => {
        setUserFilter(searchUserRef.current.value.toLowerCase())
        handleUserSearch()
    }

    const handleUserSearch = () => {
        console.log(searchUserRef.current.value)
        setUserFilter(searchUserRef.current.value.toLowerCase())
    }

    if (!isAuthAdmin) {
        return (
            <ParentContainer>
                <Header/>
                <UnauthorizedMessage>
                    You are not authorized to view this page.
                </UnauthorizedMessage>
            </ParentContainer>
        );
    }

    return (

        <ParentContainer>
            <Header/>
            {/*
                // isUserAdmin || !isDisabled ?  // Remove this conditional rendering
            */}
        <Container>
            <Articles>
            <ArticleSearchbar>
                        <Bar >
                            <form onSubmit={handleSearch}>
                                <SearchIcon type="submit"/>
                                <input type="text" ref={searchRef} onChange={handleChange} placeholder="Search Article by Title..."/>
                            </form>
                        </Bar>
                    </ArticleSearchbar>

            {filter ?
                blogs.filter(filteredblog => filteredblog.title.toLowerCase().includes(filter)).slice(0).reverse().map((blog, key) => (
                    <ArticleCard key={key}
                    >
                        <ArticleTextDetails>
                            <Author>
                                {/* <AuthorProfileAndName>
                                    <AuthorProfilePicture>
                                    {
                                        blog.postedByProfilePic ?
                                        <img src={blog.postedByProfilePic} alt="" /> :
                                        <AccountCircleIcon className="icon"/>
                                    }

                                    </AuthorProfilePicture>
                                    <AuthorUserName>
                                    {blog.postedByName ? blog.postedByName : blog.postedByEmail}
                                        <p>{blog.postedByEmail && blog.postedByEmail}</p>
                                    </AuthorUserName>
                                </AuthorProfileAndName> */}
                                <AuthorUserName>
                                    {blog.postedByName ? blog.postedByName : blog.postedByEmail}
                                        <p>{blog.postedByEmail && blog.postedByEmail}</p>
                                </AuthorUserName>
                                <Buttons>
                                    <p className="edit" onClick={() => {
                                        /* console.log("Admin: Navigating to edit blog with ID:", blog.id); */
                                        /* console.log("Admin: Blog object before navigation:", blog); */
                                        localStorage.setItem('blog', JSON.stringify(blog)) // Re-add localStorage for edit
                                        navigate(`/edit-blog/${blog.id}`);
                                    }}>Edit</p>
                                    <p className="delete" onClick={() => {
                                        localStorage.setItem('blog', JSON.stringify(blog))

                                        /* console.log("delete button selected for" + blog.title + "with ID of" + blog.id) */

                                            const dialog = window.confirm("Are you sure you want to delete?")
                                            if(dialog === true){
                                                const blogRetrieved = localStorage.getItem('blog')
                                                const blogToDelete = JSON.parse(blogRetrieved)
                                                /* console.log("yes, i want to delete") */
                                                // try {
                                                database.deleteBlog(blogToDelete.id);
                                                setBlogs(database.getBlogs().filter(b => b.userId === currentUser.uid)); // Refresh blogs
                                                alert("Blog Deleted");
                                                // } catch (error) {
                                                //     alert("Failed to delete blog: " + error.message);
                                                // }
                                            }
                                            else{
                                                /* console.log("No, it was by mistake") */
                                                }
                                    }}>Delete</p>
                                </Buttons>
                            </Author>

                            <ArticleTitle
                            onClick={() => {
                                    localStorage.setItem('blog', JSON.stringify(blog))
                                        navigate(`/blog:${blog.id}`)
                                }}
                            >
                                {blog.title}
                            </ArticleTitle>

                            <ArticleSubTitle>
                                {blog.subHeading}
                            </ArticleSubTitle>

                            <ArticleFooter>
                                <ArticleDatePosted>
                                    <p>{blog.datePosted}</p>
                                </ArticleDatePosted>
                                <ArticleClassTag>
                                    <p>{blog.Bclass}</p>
                                </ArticleClassTag>
                                <ArticleSubjectTag>
                                    <p>{blog.subject}</p>
                                </ArticleSubjectTag>
                                <ArticleTopicTag>
                                    <p>{blog.level}</p>
                                </ArticleTopicTag>

                            </ArticleFooter>

                        </ArticleTextDetails>

                        <ArticlePicture>
                        </ArticlePicture>

                    </ArticleCard>

            )
            ) :

                blogs.slice(0).reverse().map((blog, key) => (
                    <ArticleCard key={key}
                    >
                        <ArticleTextDetails>
                            <Author>
                                {/* Removed AuthorProfileAndName */}
                                <AuthorUserName>
                                    {blog.postedByName ? blog.postedByName : blog.postedByEmail}
                                        <p>{blog.postedByEmail && blog.postedByEmail}</p>
                                </AuthorUserName>
                                <Buttons>
                                    <p className="edit" onClick={() => {
                                        /* console.log("Admin: Navigating to edit blog with ID:", blog.id); */
                                        /* console.log("Admin: Blog object before navigation:", blog); */
                                        localStorage.setItem('blog', JSON.stringify(blog)) // Re-add localStorage for edit
                                        navigate(`/edit-blog/${blog.id}`);
                                    }}>Edit</p>
                                    <p className="delete" onClick={() => {
                                        localStorage.setItem('blog', JSON.stringify(blog))

                                        /* console.log("delete button selected for" + blog.title + "with ID of" + blog.id) */

                                            const dialog = window.confirm("Are you sure you want to delete?")
                                            if(dialog === true){
                                                const blogRetrieved = localStorage.getItem('blog')
                                                const blogToDelete = JSON.parse(blogRetrieved)
                                                /* console.log("yes, i want to delete") */
                                                // try {
                                                database.deleteBlog(blogToDelete.id);
                                                setBlogs(database.getBlogs().filter(b => b.userId === currentUser.uid)); // Refresh blogs
                                                alert("Blog Deleted");
                                                // } catch (error) {
                                                //     alert("Failed to delete blog: " + error.message);
                                                // }
                                            }
                                            else{
                                                /* console.log("No, it was by mistake") */
                                                }
                                    }}>Delete</p>
                                </Buttons>
                            </Author>

                            <ArticleTitle
                            onClick={() => {
                                    localStorage.setItem('blog', JSON.stringify(blog))
                                    navigate(`/blog:${blog.blogId}`)
                                }}
                            >
                                {blog.title}
                            </ArticleTitle>

                            <ArticleSubTitle>
                                {blog.subHeading}
                            </ArticleSubTitle>

                            <ArticleFooter>
                                <ArticleDatePosted>
                                    <p>{blog.datePosted}</p>
                                </ArticleDatePosted>
                                <ArticleClassTag>
                                    <p>{blog.Bclass}</p>
                                </ArticleClassTag>
                                <ArticleSubjectTag>
                                    <p>{blog.subject}</p>
                                </ArticleSubjectTag>
                                <ArticleTopicTag>
                                    <p>{blog.level}</p>
                                </ArticleTopicTag>

                            </ArticleFooter>

                        </ArticleTextDetails>

                        <ArticlePicture>
                        </ArticlePicture>

                    </ArticleCard>

            )
            )
        }
            </Articles>




            <RightSideBar>
            <div>
                    Admins
                </div>

            { // Use isAuthAdmin here
                isAdmin.slice(0).reverse().map((admin, key) => (
            <UserCard key={key}>


                        <UserDetails>

                            <UserEmail>
                                {admin.email}
                            </UserEmail>

                            <UserButton>
                                    <p className="delete" onClick={(e) => {
                                        // if(isUserAdmin){ // This check is now redundant due to page-level protection
                                        /* localStorage.setItem('user', JSON.stringify(admin)) */ // Removed localStorage usage
                                        /* console.log("disable button selected for" + admin.displayName + "with ID of" + admin.uid) */ // Removed console log
                                            e.preventDefault()
                                            const admindb = database.isAdmin(admin.uid)

                                                    const dialog = window.confirm( admidb ? "Are you sure you want to remove them as admin?" : "Are you sure you want to make them an admin?")
                                                    if(dialog === true){
                                                        console.log(admindb ? "yes, i want to remove them as Admin" : "yes, i want to make them Admin")
                                                        database.setAdmin(admin.uid, admin.email, !admindb)
                                                        setIsAdmin(database.getAdmins())
                                                        alert(admindb ? "Admin rights removed" : "Specified user is now Admin")
                                                    }
                                                    else{
                                                        console.log("No, it was by mistake")
                                                        }
                                                }
                                    }>{admin.isAdmin ? "Remove Admin" : "Make Admin"}
                                    </p>
                                </UserButton>
                        </UserDetails>

            </UserCard>
            )
            )
        }


            <div>
                    Disabled Users
                </div>
                {
                isDisabled.slice(0).reverse().map((disable, key) => (
            <UserCard key={key}>



                        <UserDetails>


                            {/* <UserEmail>
                                {disable.displayName}
                            </UserEmail> */}
                            <UserEmail>
                                {disable.email}
                            </UserEmail>
                            <Author>


                            <UserButton>

                                    <p className="delete" onClick={(e) => {
                                        // if(isUserAdmin){ // This check is now redundant due to page-level protection
                                        /* localStorage.setItem('user', JSON.stringify(disable)) */ // Removed localStorage usage
                                        /* console.log("disable button selected for" + disable.displayName + "with ID of" + disable.uid) */ // Removed console log
                                            e.preventDefault()
                                            const disabledb = database.isDisabled(disable.uid)

                                                    const dialog = window.confirm( disabledb ? "Are you sure you want to enable the user?" : "Are you sure you want to disable the user?")

                                                    if(dialog === true){
                                                        console.log(disabledb ? "yes, i want to enable the user" : "yes, i want to disable the user")

                                                        database.setDisabled(disable.uid, disable.email, !disabledb)
                                                        setDisabled(database.getDisabledUsers())
                                                        alert(disabledb ? "User Enabled" : "User Disabled")
                                                    }
                                                    else{
                                                        console.log("No, it was by mistake")
                                                        }
                                                }

                                    }>{disable.isDisabled ? "Enable" : "Disable"}
                                    </p>
                                </UserButton>
                                </Author>
                        </UserDetails>

            {/* // TODO: To display the isAdmin and isDisabled attributes from their nodes */}
            </UserCard>
            )
            )
        }


                <div>
                    All Users
                </div>
                <ArticleSearchbar>
                        <Bar >
                            <form onSubmit={handleUserSearch}>
                                <SearchIcon type="submit"/>
                                <input type="text" ref={searchUserRef} onChange={handleUserChange} placeholder="Search User by Email..."/>
                            </form>
                        </Bar>
                </ArticleSearchbar>
            {filteruser ?
                users.filter(filteredblog => filteredblog.email.toLowerCase().includes(filteruser)).slice(0).reverse().map((user, key) => (

                    <UserCard key={key}>
                        <UserDetails>
                        <UserEmail>
                                {user.email}
                            </UserEmail>
                            <Author>

                                <UserButton>
                                    <p className="delete" onClick={(e) => {
                                        // if(isUserAdmin){ // This check is now redundant due to page-level protection
                                        /* localStorage.setItem('user', JSON.stringify(user)) */ // Removed localStorage usage
                                        /* console.log("disable button selected for" + user.displayName + "with ID of" + user.uid) */ // Removed console log
                                            e.preventDefault()
                                                const dialog = window.confirm( database.isDisabled(user.uid) ? "Are you sure you want to enable the user?" : "Are you sure you want to disable the user?")
                                                if(dialog === true){
                                                    console.log( database.isDisabled(user.uid) ? "yes, i want to enable the user" : "yes, i want to disable the user")

                                                    // const data = {
                                                    //     isDisabled: "true",
                                                    //     uid: user.uid,
                                                    //     email: user.email,
                                                    // }
                                                    database.setDisabled(user.uid, user.email, !database.isDisabled(user.uid))
                                                    setDisabled(database.getDisabledUsers())
                                                    alert(database.isDisabled(user.uid) ? "User Enabled" : "User Disabled")
                                                }
                                                else{
                                                    console.log("No, it was by mistake")
                                                    }
                                            }

                                    }>{database.isDisabled(user.uid) ? "Enable" : "Disable"}</p>

                                    <p className="delete" onClick={(e) => {
                                        // if(isUserAdmin){ // This check is now redundant due to page-level protection
                                        /* localStorage.setItem('user', JSON.stringify(user)) */ // Removed localStorage usage
                                        /* console.log("disable button selected for" + user.displayName + "with ID of" + user.uid) */ // Removed console log
                                            e.preventDefault()
                                            const adminExists = database.isAdmin(user.uid)


                                                const dialog = window.confirm( adminExists ? "Are you sure you want to remove them as admin?" : "Are you sure you want to make them an admin?")

                                                if(dialog === true){
                                                    console.log(adminExists ? "yes, i want to remove them as Admin" : "yes, i want to make them Admin")

                                                    // const data = {
                                                    //     isAdmin: "true",
                                                    //     uid: user.uid,
                                                    //     email: user.email,
                                                    // }
                                                    database.setAdmin(user.uid, user.email, !adminExists)
                                                    setIsAdmin(database.getAdmins())
                                                    alert(adminExists ? "Admin rights removed" : "Specified user is now Admin")
                                                    // setAdminButtonText("Remove Admin") // Removed this line
                                                }
                                                else{
                                                    console.log("No, it was by mistake")
                                                    }
                                            }

                                    }>{database.isAdmin(user.uid) ? "Remove Admin" : "Make Admin"}
                                    </p>
                                </UserButton>
                            </Author>



                            {/* <UserEmail>
                                {user.displayName}
                            </UserEmail> */}

                        </UserDetails>
                    </UserCard>
            // TODO: To display the isAdmin and isDisabled attributes from their nodes
            )
            ) :
                users.filter(filteredblog => filteredblog.email.toLowerCase().includes(filteruser)).slice(0).reverse().map((user, key) => (

                    <UserCard key={key}>
                        <UserDetails>
                        <UserEmail>
                                {user.email}
                            </UserEmail>
                            <Author>

                                <UserButton>
                                    <p className="delete" onClick={(e) => {
                                        // if(isUserAdmin){ // This check is now redundant due to page-level protection
                                        /* localStorage.setItem('user', JSON.stringify(user)) */ // Removed localStorage usage
                                        /* console.log("disable button selected for" + user.displayName + "with ID of" + user.uid) */ // Removed console log
                                            e.preventDefault()
                                                const dialog = window.confirm( database.isDisabled(user.uid) ? "Are you sure you want to enable the user?" : "Are you sure you want to disable the user?")
                                                if(dialog === true){
                                                    console.log( database.isDisabled(user.uid) ? "yes, i want to enable the user" : "yes, i want to disable the user")

                                                    // const data = {
                                                    //     isDisabled: "true",
                                                    //     uid: user.uid,
                                                    //     email: user.email,
                                                    // }
                                                    database.setDisabled(user.uid, user.email, !database.isDisabled(user.uid))
                                                    setDisabled(database.getDisabledUsers())
                                                    alert(database.isDisabled(user.uid) ? "User Enabled" : "User Disabled")
                                                }
                                                else{
                                                    console.log("No, it was by mistake")
                                                    }
                                            }

                                    }>{database.isDisabled(user.uid) ? "Enable" : "Disable"}</p>

                                    <p className="delete" onClick={(e) => {
                                        // if(isUserAdmin){ // This check is now redundant due to page-level protection
                                        /* localStorage.setItem('user', JSON.stringify(user)) */ // Removed localStorage usage
                                        /* console.log("disable button selected for" + user.displayName + "with ID of" + user.uid) */ // Removed console log
                                            e.preventDefault()
                                            const adminExists = database.isAdmin(user.uid)


                                                const dialog = window.confirm( adminExists ? "Are you sure you want to remove them as admin?" : "Are you sure you want to make them an admin?")

                                                if(dialog === true){
                                                    console.log(adminExists ? "yes, i want to remove them as Admin" : "yes, i want to make them Admin")

                                                    // const data = {
                                                    //     isAdmin: "true",
                                                    //     uid: user.uid,
                                                    //     email: user.email,
                                                    // }
                                                    database.setAdmin(user.uid, user.email, !adminExists)
                                                    setIsAdmin(database.getAdmins())
                                                    alert(adminExists ? "Admin rights removed" : "Specified user is now Admin")
                                                    // setAdminButtonText("Remove Admin") // Removed this line
                                                }
                                                else{
                                                    console.log("No, it was by mistake")
                                                    }
                                            }

                                    }>{database.isAdmin(user.uid) ? "Remove Admin" : "Make Admin"}
                                    </p>
                                </UserButton>
                            </Author>



                            {/* <UserEmail>
                                {user.displayName}
                            </UserEmail> */}

                        </UserDetails>
                    </UserCard>
            // TODO: To display the isAdmin and isDisabled attributes from their nodes
            )
            )
        }
            </RightSideBar>
        </Container>
        {/* :
        <Error>
                    <Card>
                        <ErrorHeading>
                            <p>Error !</p>
                        </ErrorHeading>
                        <ErrorContent>
                            You dont have Admin rights
                        </ErrorContent>
                        <SignIn>
                            <p> <Link to="/">Redirect to Home</Link></p>
                        </SignIn>
                    </Card>
                </Error> */}

        
        </ParentContainer>
    )
}

export default Admin


const ParentContainer = styled.div`

`

const Container = styled.div`
    height: 80vh;
    padding: 10px 100px;
    display: flex;
    justify-content: space-between;
`
const AdminSectionCard = styled.div`
    /* border: 1px solid black; */
`
const Articles = styled.div`
    width: 70%;
    overflow-y: scroll;
    /* box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset; */
    margin-top: 20px; /* Added space between searchbar and articles */

    ::-webkit-scrollbar{
        display: none;
    }
`
const ArticleSearchbar=styled.div`
        display: flex;
        justify-content: center;
        align-items: center;

`
const Bar = styled.div`
    display: flex;
    align-items: center;
    border: 1px solid #0582c3;
    width: 70%;
    padding: 5px;
    border-radius: 15px;
    color: #0582c3;

    form{
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        width: 100%;

        input{
        border: none;
        margin-left: 10px;
        outline: none;
        width: 100%;

        :hover{
            outline: none;
            cursor: text;
        }
    }
}
`
const ArticleCard = styled.div`
    margin-bottom: 15px; /* Consistent vertical spacing */
    display: flex;
    height: 90px; /* Decreased height */
    border-radius: 8px;
    overflow: hidden;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px; /* Subtle shadow for separation */
    border: 1px solid var(--color-border); /* Reverted to lighter border */
    background-color: #ffffff;
    cursor: pointer;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out;
    width: 100%; /* Full width for list items */
    box-sizing: border-box;
    flex-direction: row; /* Arrange children horizontally for list view */
    justify-content: flex-start; /* Align content to the start */
    align-items: center; /* Vertically center content */

    &:hover {
        transform: translateY(-2px); /* Subtle lift on hover */
        box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px; /* Enhanced shadow on hover */
        border-color: var(--color-primary); /* Primary color border on hover */
    }
`
const ArticleTextDetails = styled.div`
    padding: 12px 15px; /* Adjusted padding */
    width: 75%; /* Increased width for text details */
    display: flex;
    flex-direction: column; /* Keep text details stacked vertically */
    justify-content: center; /* Center content vertically */
    /* align-items: center; */ /* Removed horizontal centering to allow left alignment */
    height: 100%; /* Ensure it takes full height of the card */
`
const Author = styled.div`
    display: flex;
    align-items: center; /* Keep author name aligned */
    margin-bottom: 5px; /* Adjusted margin for better separation */
`
/* Removed AuthorProfileAndName styled component */
/* Removed AuthorProfilePicture styled component */

const AuthorUserName = styled.div`
    font-size: 15px; /* Increased font size */
    color: #444;
    font-weight: 500;
`
const Buttons = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;

    p {
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 500;
        transition: all 0.2s ease-in-out;
    }

    .edit {
        color: var(--color-primary);
        border: 1px solid var(--color-primary);
        &:hover {
            background-color: var(--color-primary);
            color: white;
        }
    }

    .delete {
        color: var(--color-secondary);
        border: 1px solid var(--color-secondary);
        &:hover {
            background-color: var(--color-secondary);
            color: white;
        }
    }
`
const ArticleTitle = styled.div`
    margin-top: 3px; /* Adjusted margin */
    font-weight: 600;
    font-size: 19px; /* Increased font size */
    line-height: 1.2; 
    width: 100%;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    color: #333;
    /* text-align: center; */ /* Removed centering to allow left alignment */
`
const ArticleSubTitle = styled.div`
    font-size: 14px; /* Increased font size */
    color: #777;
    margin-top: 3px; /* Adjusted margin */
    line-height: 1.3;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    color: #777;
    /* text-align: center; */ /* Removed centering to allow left alignment */
` 
const ArticleFooter = styled.div`
    display: flex;
    font-size: 12px; /* Increased font size */
    margin-top: auto; 
    width: 100%;
    justify-content: flex-start; /* Aligned to start to match text */
    color: #999;
    gap: 8px; /* Slightly increased space between tags */
    
    overflow: hidden;

    p{
        padding: 3px 6px;
        background-color: #f2f2f2;
        border-radius: 4px;
        color: #666;
        font-size: 11px; /* Increased font size */
        white-space: nowrap;
    }
`
const ArticleDatePosted = styled.div`
    font-size: 12px; /* Increased font size */
    overflow: hidden;
    
`
const ArticleClassTag = styled.div`
overflow: hidden;
`
const ArticleSubjectTag = styled.div`
overflow: hidden;
`
const ArticleTopicTag = styled.div`
    width: auto; 
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`
//END OF ARTICLE TEXT DESCRIPTIONS STYLING
const ArticlePicture = styled.div`
    width: 25%; /* Decreased width for the picture */
    height: 100%; /* Take full height of the card */
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ccc;
    font-size: 14px; /* Increased font size */
    
    img{
        height: 100%;
        width: 100%;
        object-fit: cover; 
    }
`

const RightSideBar = styled.div`
    width: 40%;
    padding: 15px;
    /* box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px; */
    /* box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset; */
    /* border: 1px solid grey; */
    display: relative;
    overflow-y: scroll;
    /* box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset; */

    ::-webkit-scrollbar{
        display: none;
    }
`
const UserCard = styled.div`
    margin: 10px 0; /* Adjusted margin */
    display: flex;
    justify-content: space-between;
    /* height: 170px; */
    border-radius: 8px; /* Slightly smaller border-radius */
    overflow: hidden;
    /* box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px; */
    border: 1px solid #e0e0e0; /* Light border instead of shadow */
    background-color: #ffffff; /* Clean white background */
`

const UserDetails = styled.div`
    padding: 10px 10px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    /* border: 1px solid grey; */
`
const UserEmail = styled.div`

`
const UserButton = styled.div`
    display: flex;
    /* border: 1px solid grey; */
    /* width: 47%; */
    justify-content: space-between;

    .delete{
            color: red !important;
            margin-right: 10px;
        }

    p{
        border: 1px solid grey;
        padding: 3px;
        font-size: 13px;
        cursor: pointer;

        :hover{
            background-color: lightgrey;
        }

    }
`
const UnauthorizedMessage = styled.div`
    text-align: center;
    font-size: 24px;
    color: red;
    margin-top: 50px;
`;

const Error = styled.div`
    display: flex ;
    align-items: center;
    justify-content: center;
    height: 100vh;
`
const Card = styled.div`
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`
const ErrorHeading = styled.div`
    text-align: center;
    font-size: 37px;
    color: red;
    font-style: bold;
    margin: 40px;
`
const ErrorContent = styled.div`
    padding: 20px;

    b{
        color: grey;
    }

    i{
        color: blue;
    }

`
const SignIn = styled.div`
    text-align: center;
    font-size: 14px;
    text-decoration: underline;
    margin-bottom: 10px;
`