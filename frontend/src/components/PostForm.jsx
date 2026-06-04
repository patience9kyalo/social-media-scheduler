import { useState, useEffect } from 'react';
import { getAllPlatforms } from '../API/api';

export default function PostForm({ initialData, onSubmit, buttonText }) {

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        platform_id: '',
        status: 'draft',
        scheduled_time: '',
        tags: '',
    });

    const [platforms, setPlatforms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        getAllPlatforms()
            .then((res) => {
                const list = res.data || [];
                setPlatforms(list);
                if (list.length > 0 && !initialData) {
                    setFormData((prev) => ({ ...prev, platform_id: list[0].id }));
                }
            })
            .catch((err) => console.error('Failed to load platforms', err))
            .finally(() => setLoading(false));

        if (initialData) {
            setFormData({
                title: initialData.title || '',
                content: initialData.content || '',
                platform_id: initialData.platform_id || '',
                status: initialData.status || 'draft',
                scheduled_time: initialData.scheduled_time
                    ? initialData.scheduled_time.substring(0, 16)
                    : '',
                tags: Array.isArray(initialData.tags)
                    ? initialData.tags.join(', ')
                    : '',
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const tagsArray = formData.tags
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t.length > 0);

        await onSubmit({ ...formData, tags: tagsArray });
        setSubmitting(false);
    };

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            Loading form...
        </div>
    );

    return (
        <div style={styles.wrapper}>
            <form onSubmit={handleSubmit} style={styles.form}>

                {/* Title */}
                <div style={styles.group}>
                    <label style={styles.label}>Title <span style={styles.required}>*</span></label>
                    <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Product Launch Announcement"
                        required
                        style={styles.input}
                    />
                </div>

                {/* Platform + Status row */}
                <div style={styles.row}>
                    <div style={{ ...styles.group, flex: 1 }}>
                        <label style={styles.label}>Platform <span style={styles.required}>*</span></label>
                        <select
                            name="platform_id"
                            value={formData.platform_id}
                            onChange={handleChange}
                            required
                            style={styles.select}
                        >
                            {platforms.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ ...styles.group, flex: 1 }}>
                        <label style={styles.label}>Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} required style={styles.select} >
                            <option value="draft">Draft</option>
                            <option value="scheduled">Scheduled</option>
                        </select>
                    </div>
                </div>

                {/* Content */}
                <div style={styles.group}>
                    <label style={styles.label}>
                        Content <span style={styles.required}>*</span>
                        <span style={styles.charCount}>{formData.content.length} chars</span>
                    </label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Write your post content here..."
                        required
                        rows={5}
                        style={styles.textarea}
                    />
                </div>

                {/* Schedule Date */}
                <div style={styles.group}>
                    <label style={styles.label}>Schedule Date & Time</label>
                    <input
                        type="datetime-local"
                        name="scheduled_time"
                        value={formData.scheduled_time}
                        onChange={handleChange}
                        style={styles.input}
                    />
                    <span style={styles.hint}>Leave empty if not scheduling ahead</span>
                </div>

                {/* Tags */}
                <div style={styles.group}>
                    <label style={styles.label}>Tags</label>
                    <input
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="marketing, launch, promo"
                        style={styles.input}
                    />
                    <span style={styles.hint}>Separate tags with commas</span>

                    {/* Tag preview */}
                    {formData.tags && (
                        <div style={styles.tagPreview}>
                            {formData.tags.split(',').map((t) => t.trim()).filter(Boolean).map((tag) => (
                                <span key={tag} style={styles.tag}>#{tag}</span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={submitting}
                    style={{ ...styles.btn, opacity: submitting ? 0.7 : 1 }}
                >
                    {submitting ? 'Saving...' : buttonText || 'Save Post'}
                </button>

            </form>
        </div>
    );
}


const styles = {
    wrapper: {
        backgroundColor: '#fff',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        padding: '2rem',
        maxWidth: '680px',
        margin: '0 auto',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    group: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
    },
    row: {
        display: 'flex',
        gap: '1rem',
    },
    label: {
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#374151',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    required: {
        color: '#ef4444',
    },
    charCount: {
        fontSize: '0.75rem',
        color: '#9ca3af',
        fontWeight: '400',
    },
    input: {
        padding: '0.6rem 0.875rem',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        fontSize: '0.9rem',
        color: '#111827',
        outline: 'none',
        transition: 'border-color 0.2s',
        backgroundColor: '#fafafa',
        width: '100%',
        boxSizing: 'border-box',
        colorScheme: 'light',
        cursor: 'pointer',
    },
    select: {
        padding: '0.6rem 0.875rem',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        fontSize: '0.9rem',
        color: '#111827',
        backgroundColor: '#fafafa',
        width: '100%',
        cursor: 'pointer',
    },
    textarea: {
        padding: '0.6rem 0.875rem',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        fontSize: '0.9rem',
        color: '#111827',
        backgroundColor: '#fafafa',
        resize: 'vertical',
        fontFamily: 'inherit',
        lineHeight: '1.6',
        width: '100%',
        boxSizing: 'border-box',
    },
    hint: {
        fontSize: '0.75rem',
        color: '#9ca3af',
    },
    tagPreview: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.4rem',
        marginTop: '0.25rem',
    },
    tag: {
        backgroundColor: '#eef2ff',
        color: '#6366f1',
        padding: '0.2rem 0.6rem',
        borderRadius: '999px',
        fontSize: '0.75rem',
        fontWeight: '500',
    },
    btn: {
        padding: '0.75rem',
        borderRadius: '10px',
        border: 'none',
        backgroundColor: '#6366f1',
        color: '#fff',
        fontWeight: '700',
        fontSize: '1rem',
        cursor: 'pointer',
        marginTop: '0.5rem',
        transition: 'background-color 0.2s',
    },
};