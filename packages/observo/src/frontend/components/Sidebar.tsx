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
} from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className=" w-64 bg-zinc-900 text-white p-6 h-full flex flex-col justify-between select-none">
      <div>
        <div className="flex items-center gap-2 text-3xl font-bold">
        <Telescope size={24} className="text-purple-400"/>
        <span>Observo</span>
        </div>
        <nav className="flex flex-col gap-2 mt-8">
          <SidebarLinkItem icon={<LayoutDashboard size={18} />} label="Dashboard" to="/" />
          <SidebarLinkItem icon={<Logs size={18} />} label="Logs" to="/logs" />
          <SidebarLinkItem icon={<ChartNetwork size={18} />} label="Metrics" to="/metrics" />
          <SidebarLinkItem icon={<CalendarCheck size={18} />} label="Tasks & Scheduler" to="/tasks" />
          <SidebarLinkItem icon={<HardDrive size={18} />} label="Sharding" to="/shards" />
          <SidebarLinkItem icon={<Building size={18} />} label="Guilds" to="/guilds" />
          <SidebarLinkItem icon={<ServerCog size={18} />} label="Managers" to="/managers"/>
        </nav>
      </div>
    
      <div className="border-t border-zinc-700">
        <SidebarItem icon={<Bell size={18} />} label="Notification" />
        <SidebarItem icon={<LifeBuoy size={18} />} label="Support" />
        <SidebarItem icon={<Settings size={18} />} label="Settings" />
      </div>
    </aside>
  );
}
function SidebarLinkItem({ icon, label, to, highlight = false }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
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

function SidebarItem({ icon, label, }) {
  return (
    <div className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors hover:bg-zinc-800 hover:cursor-pointer">
      <div className="flex items-center space-x-2">
        {icon}
        <span>{label}</span>
      </div>
    </div>
  )
}