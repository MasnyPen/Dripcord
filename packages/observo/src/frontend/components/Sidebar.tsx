import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const linkClass =
    'block px-4 py-2 text-gray-200 hover:bg-gray-700 transition-colors';

  return (
    <aside className="h-screen w-64 bg-gray-800 text-white flex-shrink-0">
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        Dripcord Panel
      </div>
      <nav className="mt-4">
        <NavLink to="/" className={linkClass}>
          Dashboard
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
