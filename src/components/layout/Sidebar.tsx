import { NavLink } from 'react-router-dom';
import {
  Activity,
  LayoutDashboard,
  ShieldCheck,
  Users,
  BookOpen,
} from 'lucide-react';
import { config } from '@/lib/config';
import { cn } from '@/lib/cn';

interface Item {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  external?: boolean;
}

const items: Item[] = [
  { to: '/',         label: 'Dashboard', icon: LayoutDashboard },
  { to: '/roles',    label: 'Roles',     icon: ShieldCheck },
  { to: '/users',    label: 'Users',     icon: Users },
  { to: '/status',   label: 'Status',    icon: Activity },
];

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-800 bg-slate-950 lg:flex">
      <div className="flex h-14 items-center gap-2 border-b border-slate-800 px-4">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-cyan-400 to-brand-600 text-slate-900 font-bold">
          R
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">{config.appName}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500">RBAC v{config.appVersion}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 p-2">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition',
                isActive
                  ? 'bg-brand-500/10 text-brand-200 ring-1 ring-inset ring-brand-500/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100',
              )
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-800 p-2">
        <a
          href={`${import.meta.env.VITE_API_URL ?? 'http://localhost:4000'}/docs`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-slate-500 hover:bg-slate-800/60 hover:text-slate-300"
        >
          <BookOpen className="h-4 w-4" />
          API Docs (Swagger)
        </a>
      </div>
    </aside>
  );
}
