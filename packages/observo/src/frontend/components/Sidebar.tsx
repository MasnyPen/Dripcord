import { NavLink } from 'react-router-dom';
import {
  Bell,
  LayoutDashboard,
  Settings,
  LifeBuoy,
  Telescope,
  Logs,
  ChartNetwork,
  CalendarCheck,
  Building,
  ServerCog,
  HardDrive,
  SquareChevronRight,
} from 'lucide-react';
import Bot from './Bot';
import { BotStatus } from '../../shared/BotStatus';
import { useState } from 'react';

export default function Sidebar() {
  const [bot, setBot] = useState({ img: "/discord-icon.png", name: "Dripcord Bot", presence: "W grze Minecraft", status: BotStatus.ONLINE})

  return (
    <aside className="w-64 bg-zinc-900 text-white p-6 flex flex-col justify-between select-none overflow-hidden">
      <div>
        <div className="flex items-center gap-2 text-3xl font-bold">
        <Telescope size={24} className="text-purple-400"/>
        <span>Observo</span>
        </div>
        <nav className="flex flex-col gap-2 mt-8">
          <SidebarLinkItem icon={<LayoutDashboard size={18} />} label="Dashboard" to="/" />
          <SidebarLinkItem icon={<SquareChevronRight size={18} />} label="Console" to="/console" />
          <SidebarLinkItem icon={<ChartNetwork size={18} />} label="Metrics" to="/metrics" />
          <SidebarLinkItem icon={<CalendarCheck size={18} />} label="Tasks & Scheduler" to="/tasks" />
          <SidebarLinkItem icon={<HardDrive size={18} />} label="Sharding" to="/shards" />
          <SidebarLinkItem icon={<Building size={18} />} label="Guilds" to="/guilds" />
          <SidebarLinkItem icon={<ServerCog size={18} />} label="Managers" to="/managers"/>
        </nav>
      </div>
    
      <div className="border-t border-zinc-700">
        <SidebarItem icon={<Bell size={18} />} label="Notification" />
        <a href='https://github.com/MasnyPen/Dripcord' target="_blank">
          <SidebarItem icon={<LifeBuoy size={18} />} label="Support" />
        </a>
        <SidebarItem icon={<Settings size={18} />} label="Settings" />
        <Bot img={bot.img} name={bot.name} presence={bot.presence} status={bot.status}  className="mt-2"/>
        <div className="text-sm text-gray-600 text-center mt-2">© Dripcord 2025</div>
      </div>
    </aside>
  );
}
function SidebarLinkItem({ icon, label, to, highlight = false }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors font-medium text-[#646cff] hover:text-[#535bf2] ${
          isActive ? 'bg-zinc-800' : 'hover:bg-zinc-800'
        }`
      }
    >
      <div className="flex items-center space-x-2">
        {icon}
        <span>{label}</span>
      </div>
    </NavLink>
  );
}

function SidebarItem({ icon, label}) {
  return (
    <div className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors hover:bg-zinc-800 hover:cursor-pointer text-white hover:text-gray-300">
      <div className="flex items-center space-x-2">
        {icon}
        <span>{label}</span>
      </div>
    </div>
  )
}