import { NavLink } from 'react-router-dom';
import { LayoutGrid, Dumbbell, Book, BarChart3 } from 'lucide-react';

const links = [
  { to: '/treino/', icon: LayoutGrid, label: 'Home' },
  { to: '/treino/hoje', icon: Dumbbell, label: 'Treino' },
  { to: '/treino/guia', icon: Book, label: 'Guia' },
  { to: '/treino/progresso', icon: BarChart3, label: 'Progresso' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-night-600 bg-night-900/95 backdrop-blur-lg pb-safe">
      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/treino/'}
          className={({ isActive }) =>
            `no-tap-highlight flex flex-col items-center gap-0.5 px-4 py-2 text-xs font-medium transition-colors ${
              isActive
                ? 'text-neon'
                : 'text-night-300 hover:text-night-100'
            }`
          }
        >
          <Icon size={22} strokeWidth={1.5} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
