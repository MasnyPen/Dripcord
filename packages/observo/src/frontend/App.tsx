import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/DashBoard';
import NotFound from './pages/notFound';
import Logs from './pages/Logs';
import Metrics from './pages/Metrics'
import Tasks from './pages/Tasks'
import Guilds from './pages/Guilds'
import Managers from './pages/Managers';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/logs" element={<Logs />}/>
            <Route path="/metrics" element={<Metrics />}/>
            <Route path="/tasks" element={<Tasks />}/>
            <Route path="/guilds" element={<Guilds />}/>
            <Route path="/managers" element={<Managers />}/>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
