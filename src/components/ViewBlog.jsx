import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from './Header';
// import JoditEditor from 'jodit-react'; // Removed as not needed for viewing
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import database from '../contexts/LocalDatabase'; // Import database

export default function ViewBlog() {
    const [currentBlog, setCurrentBlog] = useState({});
    const [posterUser, setPosterUser] = useState(null); // New state for the poster's user object
    const blogString = localStorage.getItem('blog'); // Renamed variable to avoid conflict
    const config = { readonly: true };
    const { currentUser /* , getBlogById, listUsers */ } = useAuth(); // Removed getBlogById and listUsers
    /* const { blogId } = useParams(); */ // Removed useParams

    useEffect(() => {
        // console.log("Value of currentBlog.content:", currentBlog.content);
        if (blogString) {
            const parsedBlog = JSON.parse(blogString);
            setCurrentBlog(parsedBlog);

            // Fetch poster's details
            if (parsedBlog.userId) {
                const user = database.getUser(parsedBlog.userId);
                setPosterUser(user);
            }
        }
    }, [blogString]); // Depend on blogString

    return (
        <Container>
            <Header />

            <WritePostContainer>
                <Title>
                    <h2>{currentBlog.title}</h2>
                </Title>

                <SubTitle>
                    <h4>{currentBlog.subHeading}</h4>
                </SubTitle>

                {posterUser && (
                    <AuthorInfo>
                        <p>Published by: {posterUser.email}</p>
                    </AuthorInfo>
                )}

                <BlogContent>
                    {currentBlog.content && (
                        <div dangerouslySetInnerHTML={{ __html: currentBlog.content }} />
                    )}
                </BlogContent>
            </WritePostContainer>
        </Container>
    );
}

const Container = styled.div`
    background-color: #f5f5f5; /* Very light neutral background for the page */
    min-height: calc(100vh - 60px); /* Adjust based on header height */
    padding: 20px 0;
`;

const WritePostContainer = styled.div`
    /* border: 1px solid grey; */
    background-color: #ffffff; /* White background for the blog post */
    max-width: 800px; /* Limit content width for readability */
    margin: 30px auto; /* Center the container */
    padding: 40px;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;
`;

const Title = styled.div`
    margin-bottom: 15px;
    text-align: center;

    h2 {
        font-size: 32px; /* Larger title */
        font-weight: 700;
        color: #333;
        line-height: 1.2;
    }
`;

const SubTitle = styled.div`
    /* display: flex; */
    text-align: center;
    margin-bottom: 25px;

    h4 {
        font-size: 18px;
        font-weight: 400;
        color: #666;
        line-height: 1.4;
    }
`;

const AuthorInfo = styled.div`
    margin-top: 15px;
    margin-bottom: 30px; /* More space after author info */
    font-size: 14px;
    color: #888; /* Muted grey */
    text-align: center;
    border-bottom: 1px solid #eee; /* Subtle separator */
    padding-bottom: 15px;
`;

const BlogContent = styled.div`
    margin-top: 40px;
    font-size: 16px;
    line-height: 1.7;
    color: #444;

    p {
        margin-bottom: 1em;
    }

    h1, h2, h3, h4, h5, h6 {
        margin-top: 1.5em;
        margin-bottom: 0.8em;
        font-weight: 600;
        color: #333;
    }

    ul, ol {
        margin-left: 1.5em;
        margin-bottom: 1em;
    }

    blockquote {
        border-left: 4px solid #ccc;
        padding-left: 1em;
        margin-left: 0;
        font-style: italic;
        color: #777;
    }

    pre {
        background-color: #f0f0f0;
        padding: 1em;
        border-radius: 5px;
        overflow-x: auto;
    }

    code {
        font-family: 'monospace';
        background-color: #e9e9e9;
        padding: 0.2em 0.4em;
        border-radius: 3px;
    }

    /* Removed overflow-y: scroll; and display: flex; for debugging */
    /* min-height: 200px;  Removed from inline style */
    /* border: 1px solid blue;  Removed from inline style */

    ::-webkit-scrollbar {
        display: none;
    }
`;
