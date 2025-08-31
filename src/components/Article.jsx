import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

import SearchIcon from '@mui/icons-material/Search';
import database from '../contexts/LocalDatabase';
/* import BlogDataService from '../contexts/InMemoryDB' */ // Removed BlogDataService import
import { useAuth } from '../contexts/AuthContext'

function Article() {

    const [blogs, setBlogs] = useState([])
    const [currentBlog, setCurrentBlog] = useState({})
    const [filter, setFilter] = useState("")
    const navigate = useNavigate();
    const searchRef = useRef()
    const { currentUser /* , logout */ } = useAuth() // Removed logout from destructuring
    
        useEffect(() => {
            const all = database.getBlogs()
            setBlogs(all)
            // Remove the conditional updateBlogsByUser as it's not needed for displaying all blogs
            // if (currentUser) {
            //     database.updateBlogsByUser(currentUser.uid, {
            //         postedByUid: currentUser.uid,
            //         postedByName: currentUser.displayName,
            //         postedByProfilePic: currentUser.photoURL,
            //     })
            //     setBlogs(database.getBlogs())
            // }
        }, [currentUser]) // Depend on currentUser if you still need user-specific behavior elsewhere in the effect

        const handleChange = () => {
            setFilter(searchRef.current.value.toLowerCase())
            handleSearch()
        }

        const handleSearch = () => {
            console.log(searchRef.current.value)
            setFilter(searchRef.current.value.toLowerCase())
        }

    return (
            <Container>
                <LeftSide>
                    <ArticleSearchbar>  
                        <Bar >
                            <form onSubmit={handleSearch}>
                                <SearchIcon type="submit"/>
                                <input type="text" ref={searchRef} onChange={handleChange} placeholder="Search Article by Title..."/> 
                            </form>
                        </Bar> 
                    </ArticleSearchbar>
                
                <Articles>
                    
                {filter ? 
                    // blogs.filter(filteredblog => filteredblog.heading == filter).slice(0).reverse().map((blog, key) => (
                    blogs.filter(filteredblog => filteredblog.title.toLowerCase().includes(filter)).slice(0).reverse().map((blog, key) => (
                        <ArticleCard key={key} onClick={() => {
                            localStorage.setItem('blog', JSON.stringify(blog))
                                navigate(`/blog/:${blog.id}`)
                            
                        }
                        }>
                            
                            <ArticleTextDetails>                        
                                <Author>
                                    {/* <AuthorProfilePicture>
                                    {
                                        blog.postedByProfilePic ? 
                                        <img src={blog.postedByProfilePic} alt="" /> :
                                        <AccountCircleIcon className="icon"/>
                                    }
                                        
                                    </AuthorProfilePicture> */}
                                    {/* Removed AuthorUserName */}
                                    {/* {blog.postedByName ? blog.postedByName : blog.postedByEmail}
                                        <p>{blog.postedByEmail && blog.postedByEmail}</p> */}
                                </Author>

                                <ArticleTitle>
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

                            {/* Removed ArticlePicture */}
                        </ArticleCard>
                )) :
                    blogs.slice(0).reverse().map((blog, key) => (
                        <ArticleCard key={key} onClick={() => {
                            localStorage.setItem('blog', JSON.stringify(blog))
                                navigate(`/blog/:${blog.id}`)
                            
                        }
                        }>
                            
                            <ArticleTextDetails>                        
                                <Author>
                                    {/* <AuthorProfilePicture>
                                    {
                                        blog.postedByProfilePic ? 
                                        <img src={blog.postedByProfilePic} alt="" /> :
                                        <AccountCircleIcon className="icon"/>
                                    }
                                        
                                    </AuthorProfilePicture> */}
                                    {/* Removed AuthorUserName */}
                                    {/* {blog.postedByName ? blog.postedByName : blog.postedByEmail} */}
                                    {/* <p>{blog.postedByEmail && blog.postedByEmail}</p> */}
                                </Author>

                                <ArticleTitle>
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

                            {/* Removed ArticlePicture */}
                        </ArticleCard>
                ))
            }
                </Articles>
        </LeftSide>

                <RightSideBar>
                    <Advert>
                    </Advert>

                </RightSideBar>
            </Container>
    );
}

export default Article

const Container = styled.div`
    height: 85vh;
    padding: 10px 50px; /* Reduced horizontal padding */
    display: flex;
    /* justify-content: space-between; */ /* Removed to allow content to center with margin: auto */
    max-width: 1200px; /* Set a maximum width for the content area */
    margin: 0 auto; /* Center the container horizontally */
`
const LeftSide = styled.div`
    width: 60%;
    /* border: 1px solid grey; */
`
const Articles = styled.div`
    height: 98%;
    width: 100%;
    overflow-y: scroll;
    display: flex;
    flex-direction: column; /* Stack items vertically */
    /* flex-wrap: wrap; */ /* Removed flex-wrap */
    /* justify-content: flex-start; */ /* Removed justify-content */
    margin-top: 20px; /* Added space between searchbar and articles */
    /* box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset; */

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
    /* margin: 10px; */ /* Removed general margin */
    margin-bottom: 5px; /* Further reduced vertical spacing */
    display: flex;
    /* height: 90px; */ /* Removed fixed height to allow content to dictate height */
    min-height: 50px; /* Further reduced minimum height for cards */
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
    align-items: flex-start; /* Align content to the start vertically */
    padding: 5px; /* Further reduced padding */

    &:hover {
        transform: translateY(-2px); /* Subtle lift on hover */
        box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px; /* Enhanced shadow on hover */
        border-color: var(--color-primary); /* Primary color border on hover */
    }
`
const ArticleTextDetails = styled.div`
    padding: 0; /* Removed padding here, moved to ArticleCard */
    width: 100%; /* Increased width for text details to fill available space */
    display: flex;
    flex-direction: column; /* Keep text details stacked vertically */
    justify-content: space-between; /* Distribute space between items */
    /* align-items: center; */ /* Removed horizontal centering to allow left alignment */
    height: 100%; /* Ensure it takes full height of the card */
`
const Author = styled.div`
    display: flex;
    align-items: center; /* Keep author name aligned */
    margin-bottom: 2px; /* Further reduced margin */
    font-size: 0.75em; /* Further reduced font for author info */
    color: #666; /* Muted color for author text */
    width: 100%; /* Ensure author takes full width for flex-end content */
    justify-content: space-between; /* Space out date and other info */
    
    p { /* For author email/date, if displayed */
        margin-left: 0px; /* Removed extra margin */
        color: #888; /* Even more muted */
        font-size: 0.7em;
    }
`
/* Removed AuthorProfilePicture styled component */

const AuthorUserName = styled.div`
    /* font-size: 15px; */ /* Removed as AuthorUserName is removed */
    /* color: #444; */
    /* font-weight: 500; */
`
const ArticleTitle = styled.div`
    margin-top: 1px; /* Further adjusted margin */
    font-weight: 600;
    font-size: 0.9rem; /* Further reduced font size */
    line-height: 1.1; 
    width: 100%;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* Still allow title to span 2 lines */
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    color: #333;
    /* text-align: center; */ /* Removed centering to allow left alignment */
`
const ArticleSubTitle = styled.div`
    font-size: 0.65rem; /* Further reduced font size */
    color: #777;
    margin-top: 1px; /* Further adjusted margin */
    margin-bottom: 3px; /* Further reduced margin */
    line-height: 1.1;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* Still allow subtitle to span 2 lines */
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    color: #777;
    /* text-align: center; */ /* Removed centering to allow left alignment */
` 
const ArticleFooter = styled.div`
    display: flex;
    font-size: 0.6em; /* Further reduced font size */
    margin-top: auto; /* Push to the bottom */
    padding-top: 2px; /* Further reduced padding for visual separation */
    border-top: 1px solid #eee; /* Subtle separator line */
    width: 100%;
    justify-content: flex-start; /* Aligned to start to match text */
    color: #999;
    gap: 3px; /* Further reduced space between tags */
    
    overflow: hidden;

    p{
        padding: 1px 3px; /* Adjusted padding */
        background-color: #e8f0fe; /* Light blue background for tags */
        border-radius: 2px; /* Slightly more rounded */
        color: #3f51b5; /* Darker blue for tag text */
        font-size: 0.6em; /* Adjusted font size */
        white-space: nowrap;
    }
`
const ArticleDatePosted = styled.div`
    font-size: 0.7em; /* Further reduced font size */
    overflow: hidden;
    color: #888; /* Muted color for date */
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
    /* width: 25%; */ /* Decreased width for the picture */
    /* height: 100%; */ /* Take full height of the card */
    /* background-color: transparent; */
    /* display: flex; */
    /* align-items: center; */
    /* justify-content: center; */
    /* color: #ccc; */
    /* font-size: 14px; */ /* Increased font size */
    
    /* img{ */
    /*     height: 100%; */
    /*     width: 100%; */
    /*     object-fit: cover;  */
    /* } */
    display: none; /* Hide ArticlePicture to give more space to text */
`

const RightSideBar = styled.div`
    width: 30%;
    display: relative;
`
const Advert = styled.div`
    height: 70%;
    display: flex;
    align-items: center;
    justify-content: center;

    img{
    }
`