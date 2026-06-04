import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPosts, getAllPlatforms, deletePost, updatePost } from '../API/api';
import PostCard from '../components/PostCard';

export default function Dashboard() {
    const [posts, setPosts] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [platformFilter, setPlatformFilter] = useState('');
    const navigate = useNavigate();


    const fetchPosts = async () => {
        setLoading(true);
        const filters = {};
        if (statusFilter) filters.status = statusFilter;
        if (platformFilter) filters.platform_id = platformFilter;

        const res = await getAllPosts(filters);
        if (res.success) setPosts(res.data);
        setLoading(false);
    };


    useEffect(() => {
        fetchPosts();
    }, [statusFilter, platformFilter]);

    useEffect(() => {
        getAllPlatforms().then(res => {
            if (res.success) setPlatforms(res.data);
        });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchPosts();
        }, 60 * 1000);

        return () => clearInterval(interval);  // cleanup when component unmounts
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Delete this post?')) return;
        const res = await deletePost(id);
        if (res.success) setPosts(posts.filter(p => p.id !== id));
    };

    const handlePublish = async (id) => {
        if (!confirm('Publish this post now?')) return;

        const res = await updatePost(id, { status: 'published' });

        if (res.success) {
            setPosts(posts.map(p => p.id === id ? res.data : p));
        } else {
            alert('Failed to publish post. Please try again.');
        }
    };

    const stats = {
        all: posts.length,
        draft: posts.filter(p => p.status === 'draft').length,
        scheduled: posts.filter(p => p.status === 'scheduled').length,
        published: posts.filter(p => p.status === 'published').length,
        failed: posts.filter(p => p.status === 'failed').length,
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', margin: 0 }}>
                    Dashboard
                </h1>
                <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>
                    Manage and schedule your social media posts
                </p>
            </div>

            {/* ── Stats row ── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                {[
                    { label: 'Total', value: stats.all, color: '#6366f1', bg: '#eef2ff' },
                    { label: 'Drafts', value: stats.draft, color: '#f59e0b', bg: '#fffbeb' },
                    { label: 'Scheduled', value: stats.scheduled, color: '#3b82f6', bg: '#eff6ff' },
                    { label: 'Published', value: stats.published, color: '#10b981', bg: '#ecfdf5' },
                    { label: 'Failed', value: stats.failed, color: '#ef4444', bg: '#fee2e2' },
                ].map(stat => (
                    <div key={stat.label} style={{
                        backgroundColor: stat.bg,
                        borderRadius: '12px',
                        padding: '1.25rem',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: stat.color }}>
                            {stat.value}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.25rem' }}>
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>


            <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '1.5rem',
                alignItems: 'center',
                flexWrap: 'wrap'
            }}>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
                    <option value="">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                    <option value="failed">Failed</option>
                </select>

                <select value={platformFilter} onChange={e => setPlatformFilter(e.target.value)} style={selectStyle}>
                    <option value="">All Platforms</option>
                    {platforms.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>

                {(statusFilter || platformFilter) && (
                    <button onClick={() => { setStatusFilter(''); setPlatformFilter(''); }} style={clearBtnStyle}>
                        Clear filters
                    </button>
                )}

                <button onClick={() => navigate('/create')} style={{ ...createBtnStyle, marginLeft: 'auto' }}>
                    + New Post
                </button>
            </div>


            {loading ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '3rem' }}>
                    Loading posts...
                </p>
            ) : posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ooops!</div>
                    <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>No posts found</p>
                    <button onClick={() => navigate('/create')} style={createBtnStyle}>
                        Create your first post
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {posts.map(post => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onDelete={handleDelete}
                            onPublish={handlePublish}
                            onEdit={() => navigate(`/edit/${post.id}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

const selectStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontSize: '0.9rem',
    color: '#374151',
    backgroundColor: '#fff',
    cursor: 'pointer'
};

const clearBtnStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    color: '#6b7280',
    cursor: 'pointer',
    fontSize: '0.85rem'
};

const createBtnStyle = {
    padding: '0.5rem 1.25rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#6366f1',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.9rem'
};