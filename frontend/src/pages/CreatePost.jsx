import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { createPost } from '../API/api';

export default function CreatePost() {
    const navigate = useNavigate();

    const handleCreateSubmit = async (finalData) => {
        try {
            const res = await createPost(finalData);
            if (res.success) {
                navigate('/');
            } else {
                alert('Failed to save post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', margin: 0 }}>
                    Schedule a New Post
                </h1>
                <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>
                    Fill in the details and choose when to publish
                </p>
            </div>
            <PostForm onSubmit={handleCreateSubmit} buttonText="Schedule Post" />
        </div>
    );
}
