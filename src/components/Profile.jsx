import React, {useState, useRef, useEffect} from 'react'
import Header from './Header'
import styled from 'styled-components'
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
// import UpdateProfile from './UpdateProfile'
import database from '../contexts/LocalDatabase';
// import BlogDataService from "../localdatabse";
import { useAuth } from '../contexts/AuthContext'
// import {Pie, Doughnut,} from 'react-chartjs-2'
import SearchIcon from '@mui/icons-material/Search';
import { LineChart, Line, Pie, PieChart, ResponsiveContainer, XAxis,
    YAxis,Legend, Tooltip,
    CartesianGrid } from 'recharts';

export default function Profile() {

    const blogRetrieved = localStorage.getItem('blog')
    const blogToDelete = JSON.parse(blogRetrieved)

    const [blogs, setBlogs] = useState([])
    const [bClass, setbClass] = useState([])
    // const [currentBlog, setCurrentBlog] = useState({})
    const navigate = useNavigate();
    const searchRef = useRef()
    const [filter, setFilter] = useState("")
    
    const { currentUser /* , listBlogs, deleteBlog */ } = useAuth() // Removed listBlogs and deleteBlog
    
        useEffect(() => {
            if (!currentUser) return
            // const allBlogs = listBlogs().filter(blog => blog.userId === currentUser.uid); // Removed listBlogs call from AuthContext
            const allBlogs = database.getBlogsByUser(currentUser.uid) // Use LocalDatabase
            setBlogs(allBlogs)
            setbClass(allBlogs.Bclass)
        }, [currentUser]) // Added currentUser to dependencies
        

        const dialogFunction = () => {
        
        }
        
        // console.log(blogs.length) // Removed console log
        // console.log(blogs.datePosted) // Removed console log



        const distinct = (value, index, self) => {
            return self.indexOf(value) === index
        }

        const distinctClasses = [...new Set(blogs.map(x => x.Bclass))]
        const distinctDates = [...new Set(blogs.map(x => x.datePosted))]
        const distinctSubjects = [...new Set(blogs.map(x => x.subject))]
        const distinctLevels = [...new Set(blogs.map(x => x.level))]
        // const distinctClasses = blogs.filter(distinct)


        //getting the number of blogs for each metric
        const distinctClassesCount = distinctClasses.length
        // console.log(distinctClasses) // Removed console log

        const handleChange = () => {
            setFilter(searchRef.current.value.toLowerCase())
            handleSearch()
        }

        const handleSearch = () => {
            console.log(searchRef.current.value)
            setFilter(searchRef.current.value.toLowerCase())
        }

            function findOcc(arr, key){
                let arr2 = [];
                
                arr.forEach((x)=>{
                    
                if(arr2.some((val)=>{ return val[key] == x[key] })){
                    
                    arr2.forEach((k)=>{
                    if(k[key] === x[key]){ 
                        k["occurrence"]++
                    }
                    })
                    
                }else{
                    let a = {}
                    a[key] = x[key]
                    a["occurrence"] = 1
                    arr2.push(a);
                }
                })
                
                return arr2
            }
    // console.log(blogs) // Removed console log
    // console.log(bClass) // Removed console log

    const BClassCount = findOcc(blogs, "Bclass")
    const levelCount = findOcc(blogs, "level")
    const subjectCount = findOcc(blogs, "subject")
    const dateCount = findOcc(blogs, "datePosted")
    // console.log(findOcc(blogs, "Bclass")) // Removed console log
    // console.log(distinctClasses) // Removed console log

    return (
        
        <ParentContainer>
            
            <Header/>
            
            {

blogs.length > 0 ?
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
                    <ArticleCard key={key} >
                        
                        <ArticleTextDetails>                        
                            <AuthorContainer>
                                <Author>                                    
                                    <AuthorProfilePicture>
                                    {
                                        blog.postedByProfilePic ? 
                                        <img src={blog.postedByProfilePic} alt="" /> :
                                        <AccountCircleIcon className="icon"/>
                                    }
                                        
                                    </AuthorProfilePicture>
                                    <AuthorUserName>
                                        {blog.postedByName ? blog.postedByName : blog.postedByEmail}
                                        {/* {blog.dateCreated} */}
                                    </AuthorUserName>
                                </Author>
                                <Buttons>
                                    <p onClick={() => {
                                        localStorage.setItem('blog', JSON.stringify(blog))
                                        navigate(`/edit-blog/${blog.id}`)
                                        console.log("edit button selected for" + blog.title)
                                    }} 
                                    >Edit</p>
                                    <p className="delete" onClick={() => {
                                        localStorage.setItem('blog', JSON.stringify(blog))
                                        // console.log("delete button selected for" + blog.heading + "with ID of" + blog.blogId) // Removed console log
                                        const dialog = window.confirm("Are you sure you want to delete?")
                                        if(dialog === true){
                                            console.log("yes, i want to delete")
                                            database.deleteBlog(blogToDelete.id)
                                            setBlogs(database.getBlogsByUser(currentUser.uid))
                                            alert("Blog Deleted")
                                                // console.log(theData)
                                        }
                                        else{
                                            // console.log("No, it was by mistake") // Removed console log
                                            // history.push(`/Profile`)
                                            }
                                    }}>Delete</p>
                                </Buttons>
                            </AuthorContainer>

                            <ArticleTitle onClick={() => {
                        localStorage.setItem('blog', JSON.stringify(blog))
                            navigate(`/blog:${blog.id}`)
                        
                    }
                    } >
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
                    <ArticleCard key={key} >
                        
                        <ArticleTextDetails>                        
                            <AuthorContainer>
                                <Author>                                    
                                    <AuthorProfilePicture>
                                    {
                                        blog.postedByProfilePic ? 
                                        <img src={blog.postedByProfilePic} alt="" /> :
                                        <AccountCircleIcon className="icon"/>
                                    }
                                        
                                    </AuthorProfilePicture>
                                    <AuthorUserName>
                                        {blog.postedByName ? blog.postedByName : blog.postedByEmail}
                                        {/* {blog.dateCreated} */}
                                    </AuthorUserName>
                                </Author>
                                <Buttons>
                                    <p onClick={() => {
                                        localStorage.setItem('blog', JSON.stringify(blog))
                                        navigate(`/edit-blog/${blog.id}`)
                                        console.log("edit button selected for" + blog.title)
                                    }} 
                                    >Edit</p>
                                    <p className="delete" onClick={() => {
                                        localStorage.setItem('blog', JSON.stringify(blog))
                                        // console.log("delete button selected for" + blog.heading + "with ID of" + blog.blogId) // Removed console log
                                        const dialog = window.confirm("Are you sure you want to delete?")
                                        if(dialog === true){
                                            console.log("yes, i want to delete")
                                            database.deleteBlog(blogToDelete.id)
                                            setBlogs(database.getBlogsByUser(currentUser.uid))
                                            alert("Blog Deleted")
                                                // console.log(theData)
                                        }
                                        else{
                                            // console.log("No, it was by mistake") // Removed console log
                                            // history.push(`/Profile`)
                                            }
                                    }}>Delete</p>
                                </Buttons>
                            </AuthorContainer>

                            <ArticleTitle onClick={() => {
                        localStorage.setItem('blog', JSON.stringify(blog))
                            navigate(`/blog:${blog.id}`)
                        
                    }
                    } >
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
            


        
            
        </Container>
        : 
        <p>You don't have any blogs</p>
    }
        
        </ParentContainer>
        
    )
}
const ParentContainer = styled.div`
    p{
        text-align: center;
        padding: 20px;
    }
`
const Container = styled.div`
    height: 150vh;
    padding: 10px 100px;
    display: flex;
    justify-content: space-between;
`
const Articles = styled.div`
    width: 60%;
    height: 250vh;
    overflow-y: scroll;
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
    margin: 20px;
    display: flex;
    justify-content: space-between;
    height: 170px;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
`
const ArticleTextDetails = styled.div`
    padding: 20px 20px;
    width: 60%;
`
const AuthorContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`
const Author = styled.div`
    display: flex;
    align-items: center;
`
const AuthorProfilePicture = styled.div`
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid #0582c3;
    width: 30px;
    height: 30px;
    margin-right: 8px;

    img{
        width: 30px;
        height: 30px;
        border-radius: 50%;
        overflow: hidden;
    }
    .icon{
        width: 30px;
        height: 30px;
        border-radius: 50%;
        overflow: hidden;
    }
`
const AuthorUserName = styled.div`
    font-size: 13px;
`
const Buttons = styled.div`
    display: flex;
    width: 17%;
    justify-content: space-between;

    .delete{
            color: red !important;
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
const ArticleTitle = styled.div`
    margin-top: 14px;
    font-weight: bold;
    font-size: 24px;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    :hover{
        text-decoration: underline;
        color: darkgrey;
    }
`
const ArticleSubTitle = styled.div`
    font-size: 14px;
` 
const ArticleFooter = styled.div`
    display: flex;
    font-size: 11px;
    margin-top: 30px;
    width: 100%;
    justify-content: center; /* Changed to center content within the footer */
    color: grey;

    p{
        padding: 4px;
    }
`
const ArticleDatePosted = styled.div`
    font-size: 11px;    
`
const ArticleClassTag = styled.div`
`
const ArticleSubjectTag = styled.div`
`                       
const ArticleTopicTag = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`
//END OF ARTICLE TEXT DESCRIPTIONS STYLING
const ArticlePicture = styled.div`
    img{
        height: 100%;
    }
`

const RightSideBar = styled.div`
    width: 30%;
    height: 150vh;
    padding: 10px 0;
`
const BlogsStats = styled.div`

`
const BlogsCount = styled.div`
    margin: 10px; 
    p:first-of-type{
        font-weight: bold;
    }
`
const Classes = styled.div`
    margin: 10px;
    p:first-of-type{
        font-weight: bold;
    }

    div{
        display: flex;
        justify-content: space-between;
        width: 30%;
    }
`
const DatesWritten = styled.div`
    margin: 10px;
    p:first-of-type{
        font-weight: bold;
    }
`
const Subjects = styled.div`
    p:first-of-type{
        font-weight: bold;
    }
    margin: 10px;
`
const Levels = styled.div`
    p:first-of-type{
        font-weight: bold;
    }
    margin: 10px;
`