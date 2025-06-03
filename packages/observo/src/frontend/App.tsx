import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/DashBoard';
import NotFound from './pages/notFound';
import Console from './pages/Console';
import Metrics from './pages/Metrics'
import Tasks from './pages/Tasks'
import Guilds from './pages/Guilds'
import Managers from './pages/Managers';
import Shards from './pages/Shards'
import Login from './pages/Login';
import React, { createContext, useState } from 'react';
import { Bot } from '@shared/Bot'
import { BotStatus } from '@shared/BotStatus';

export const BotContext = createContext<{bot: Bot, setBot: React.Dispatch<React.SetStateAction<Bot>>} | undefined>(undefined)

function App() {
  const [bot, setBot] = useState<Bot>({ img: "/discord-icon.png", name: "Dripcord Bot", presence: "W grze Minecraft", status: BotStatus.ONLINE, clientId: "skibidi"})

  return (
    <BotContext.Provider value={{ bot, setBot }}>
      <BrowserRouter>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 w-full h-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />}/>
              <Route path="/console" element={<Console />}/>
              <Route path="/metrics" element={<Metrics />}/>
              <Route path="/tasks" element={<Tasks />}/>
              <Route path="/shards" element={<Shards />}/>
              <Route path="/guilds" element={<Guilds />}/>
              <Route path="/managers" element={<Managers />}/>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </BotContext.Provider>
  );
}

export default App;
