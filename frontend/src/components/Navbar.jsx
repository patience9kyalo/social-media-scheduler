import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const { pathname } = useLocation();

    const linkStyle = (path) => ({
        textDecoration: 'none',
        fontWeight: pathname === path ? '700' : '400',
        color: pathname === path ? '#6366f1' : '#374151',
        borderBottom: pathname === path ? '2px solid #6366f1' : '2px solid transparent',
        paddingBottom: '4px',
        transition: 'all 0.2s'
    });

    return (
        <nav style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 2rem',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#111827' }}>
                    PostScheduler
                </span>
            </div>

            {/* Links */}
            <div style={{ display: 'flex', gap: '2rem' }}>
                <Link to="/" style={linkStyle('/')}>Dashboard</Link>
                <Link to="/create" style={linkStyle('/create')}>+ New Post</Link>
            </div>
        </nav>
    );
}