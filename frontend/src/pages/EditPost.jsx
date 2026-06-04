import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';

export default function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/posts/${id}`)
            .then((res) => res.json())
            .then((res) => {
                setPost(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const handleEditSubmit = async (finalData) => {
        try {
            const response = await fetch(`/api/posts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData),
            });

            if (response.ok) {
                navigate('/');
            } else {
                alert('Failed to update post');
            }
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    if (loading) return <p>Loading post data...</p>;
    if (!post) return <p>Post not found.</p>;

    return (
        <div className="page-container">
            <h2> Edit Scheduled Post</h2>
            <PostForm initialData={post} onSubmit={handleEditSubmit} buttonText="Update Post" />
        </div>
    );
}
