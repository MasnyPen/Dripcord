import { NavLink } from 'react-router-dom';
import {
  Bell,
  LayoutDashboard,
  Settings,
  LifeBuoy,
  Telescope,
} from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className=" w-64 bg-zinc-900 text-white flex flex-col p-6">
      <div className="flex items-center gap-2 text-3xl font-bold">
        <Telescope size={24} className="text-purple-400"/>
        <span>Observo</span>
      </div>
      <nav className="flex flex-col mt-2">
        <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" to="/" />
      </nav>

      <div className="border-t border-zinc-700 pt-4 space-y-2">
        <SidebarItem icon={<Bell size={18} />} label="Notification" to="/notifications" />
        <SidebarItem icon={<LifeBuoy size={18} />} label="Support" to="/support" />
        <SidebarItem icon={<Settings size={18} />} label="Settings" to="/settings" />
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, to, badge = null, highlight = false }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
          isActive ? 'bg-zinc-800' : 'hover:bg-zinc-800'
        } ${highlight ? 'text-purple-400' : 'text-white'}`
      }
    >
      <div className="flex items-center space-x-2">
        {icon}
        <span>{label}</span>
      </div>
      {badge && (
        <span className="bg-purple-500 text-xs px-2 py-0.5 rounded-full text-white">
          {badge}
        </span>
      )}
    </NavLink>
  );
}
