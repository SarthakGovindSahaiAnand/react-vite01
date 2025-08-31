import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import Header from './Header'
import { useNavigate, useParams } from "react-router-dom"
/* import JoditEditor from 'jodit-react' */ // Removed JoditEditor import
import BasicEditor from './BasicEditor' // Import our new BasicEditor
import database from '../contexts/LocalDatabase' // Re-added database import
import { useAuth } from '../contexts/AuthContext'

const UnauthorizedMessage = styled.div`
    text-align: center;
    font-size: 24px;
    color: var(--color-secondary);
    margin-top: 50px;
`;

function EditBlog() {
    const navigate = useNavigate();
    const { blogId } = useParams();
    const { currentUser, editBlog, isAdmin /* , getBlogById */ } = useAuth(); // Removed getBlogById

    const headingRef = useRef();
    const subHeadingRef = useRef();
    const [blogContent, setBlogContent] = useState(''); // State to hold the content from BasicEditor
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (blogId) {
            console.log("EditBlog: ID from URL - ", blogId);
            // const blogData = getBlogById(blogId); // Removed direct call to getBlogById from AuthContext
            const blogRetrieved = localStorage.getItem('blog')
            const blogData = JSON.parse(blogRetrieved)
            console.log("EditBlog: Fetched blog object - ", blogData);
            if (blogData && blogData.id === blogId) {
                // setCurrentBlog(blogData); // No longer need this state directly
                headingRef.current.value = blogData.title;
                subHeadingRef.current.value = blogData.subHeading;
                setBlogContent(blogData.content); // Populate BasicEditor with existing content
                console.log("EditBlog: Heading set to - ", blogData.title);
                console.log("EditBlog: SubHeading set to - ", blogData.subHeading);
                console.log("EditBlog: Blog content set to - ", blogData.content);
            } else {
                console.log("EditBlog: Blog not found for ID - ", blogId);
                alert("Blog not found!");
                navigate('/admin');
            }
        }
    }, [blogId, navigate]); // Removed getBlogById from dependencies

    async function handleSubmit(e) {
        e.preventDefault();

        if (!isAdmin) {
            setError("You are not authorized to edit this post.");
            return;
        }

        try {
            setError("");
            setLoading(true);
            // await editBlog(blogId, headingRef.current.value, subHeadingRef.current.value, blogContent);
            database.updateBlog(blogId, {
                title: headingRef.current.value,
                subHeading: subHeadingRef.current.value,
                content: blogContent,
                userId: currentUser.uid // Ensure userId is passed if needed for authorization in DB
            });
            alert("Blog Updated Successfully!");
            navigate('/admin'); // Redirect to admin page after edit
        } catch (err) {
            setError("Failed to update blog: " + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    if (!isAdmin) {
        return (
            <ParentContainer>
                <Header/>
                <UnauthorizedMessage>
                    You are not authorized to edit posts.
                </UnauthorizedMessage>
            </ParentContainer>
        );
    }

    return (
        <ParentContainer>
            <Header/>
            <Container>
                <Heading>Edit Blog</Heading>
                {error && <Alert>{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label>Title</Label>
                        <Input type="text" ref={headingRef} required />
                    </FormGroup>
                    <FormGroup>
                        <Label>Sub Heading</Label>
                        <Input type="text" ref={subHeadingRef} required />
                    </FormGroup>
                    <FormGroup>
                        <Label>Content</Label>
                        <BasicEditor initialContent={blogContent} onContentChange={setBlogContent} />
                    </FormGroup>
                    <Button disabled={loading} type="submit">Update Post</Button>
                </Form>
            </Container>
        </ParentContainer>
    )
}

export default EditBlog

const ParentContainer = styled.div`
    min-height: 100vh;
    background-color: var(--color-background-page);
`

const Container = styled.div`
    max-width: 800px;
    margin: 30px auto;
    padding: 30px;
    background-color: var(--color-background-card);
    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
`

const Heading = styled.h2`
    font-size: 2rem;
    color: var(--color-text-dark);
    margin-bottom: 25px;
    text-align: center;
`

const Alert = styled.div`
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    padding: 10px 15px;
    border-radius: 6px;
    margin-bottom: 20px;
    text-align: center;
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
`

const Label = styled.label`
    font-size: 1rem;
    color: var(--color-text-medium);
    margin-bottom: 8px;
    font-weight: 500;
`

const Input = styled.input`
    padding: 10px 12px;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-size: 1rem;
    color: var(--color-text-dark);
    background-color: var(--color-background-page);
`

const Button = styled.button`
    background-color: var(--color-primary);
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: 600;
    transition: all 0.2s ease-in-out;

    &:hover {
        background-color: var(--color-primary);
        filter: brightness(0.9);
    }

    &:disabled {
        background-color: var(--color-text-light);
        cursor: not-allowed;
    }
`
