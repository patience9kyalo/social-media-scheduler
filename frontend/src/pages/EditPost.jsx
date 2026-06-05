import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { getPostById, updatePost } from '../API/api';

export default function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPostById(id)
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
            const res = await updatePost(id, finalData);
            if (res.success) {
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
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', margin: 0 }}>
                    Edit Scheduled Post
                </h1>
                <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>
                    Update your post details below
                </p>
            </div>
            <PostForm initialData={post} onSubmit={handleEditSubmit} buttonText="Update Post" />
        </div>
    );
}
