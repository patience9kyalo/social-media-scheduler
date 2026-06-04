const statusColors = {
    draft: { bg: '#fffbeb', color: '#f59e0b', label: 'Draft' },
    scheduled: { bg: '#eff6ff', color: '#3b82f6', label: 'Scheduled' },
    published: { bg: '#ecfdf5', color: '#10b981', label: 'Published' },
    failed: { bg: '#fef2f2', color: '#ef4444', label: 'Failed' },
};

export default function PostCard({ post, onDelete, onPublish, onEdit }) {
    const status = statusColors[post.status] || statusColors.draft;

    return (
        <div style={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
        }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        
                <span style={{
                    backgroundColor: post.platform_color + '18',
                    color: post.platform_color,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                }}>
                  {post.platform_name}
                </span>

                <span style={{
                    backgroundColor: status.bg,
                    color: status.color,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                }}>
                    {status.label}
                </span>

                {post.scheduled_at && (
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af', marginLeft: 'auto' }}>
                        {new Date(post.scheduled_at).toLocaleString()}
                    </span>
                )}
            </div>

            <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#111827' }}>
                    {post.title}
                </h3>
                <p style={{
                    margin: '0.35rem 0 0',
                    color: '#6b7280',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {post.content}
                </p>
            </div>


            {post.tags?.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {post.tags.map(tag => (
                        <span key={tag} style={{
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '999px',
                            fontSize: '0.75rem'
                        }}>
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {post.published_time && (
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#10b981' }}>
                    Published on {new Date(post.published_time).toLocaleString()}
                </p>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                <button onClick={onEdit} style={btnStyle('#f9fafb', '#374151', '#e5e7eb')}>
                    Edit
                </button>

                {post.status !== 'published' && (
                    <button onClick={() => onPublish(post.id)} style={btnStyle('#ecfdf5', '#10b981', '#a7f3d0')}>
                         Publish
                    </button>
                )}

                <button onClick={() => onDelete(post.id)} style={btnStyle('#fef2f2', '#ef4444', '#fecaca')}>
                     Delete
                </button>
            </div>
        </div>
    );
}

const btnStyle = (bg, color, border) => ({
    padding: '0.4rem 1rem',
    borderRadius: '8px',
    border: `1px solid ${border}`,
    backgroundColor: bg,
    color: color,
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.85rem'
});