import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/DashBoard';
function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
