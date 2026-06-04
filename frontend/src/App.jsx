import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/edit/:id"element={<EditPost />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}