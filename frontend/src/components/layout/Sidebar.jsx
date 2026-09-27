import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { BarChart3, BriefcaseBusiness, Users, X } from "lucide-react";
import { useAuthContext } from "../../context/useAuthContext.jsx";

function SidebarLinks({ onNavigate }) {
  const { user } = useAuthContext();
  const navigation =
    user?.role === 1
      ? [{ name: "User list", path: "/admin/users", icon: Users }]
      : [
          {
            name: "Dashboard",
            path: "/applications/dashboard",
            icon: BarChart3,
          },
          {
            name: "Job applications",
            path: "/applications",
            icon: BriefcaseBusiness,
          },
        ];

  return (
    <nav className="flex-1 space-y-2 px-4 py-6">
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/40">
        Overview
      </p>

      {navigation.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            end
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

function SidebarBrand({ onClose }) {
  return (
    <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffd978]">
        <BriefcaseBusiness className="h-5 w-5 text-[#0d4c63]" />
      </div>

      <div className="flex-1">
        <h1 className="font-bold text-white">Akrio Job Tracker</h1>
        <p className="text-xs text-white/50">Your application workspace</p>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

export default function Sidebar({ mobileOpen, onClose }) {
  useEffect(() => {
    if (!mobileOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, onClose]);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-[#176b87] bg-[#0d4c63] lg:flex lg:flex-col">
        <SidebarBrand />
        <SidebarLinks />
        <div className="border-t border-white/10 p-4">
          <p className="text-center text-xs text-white/40">
            © {new Date().getFullYear()} Akrio Job Tracker
          </p>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/45 lg:hidden"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
            className="flex h-full w-[min(18rem,85vw)] flex-col bg-[#0d4c63] shadow-xl"
          >
            <SidebarBrand onClose={onClose} />
            <SidebarLinks onNavigate={onClose} />
            <div className="border-t border-white/10 p-4">
              <p className="text-center text-xs text-white/40">
                © {new Date().getFullYear()} Akrio Job Tracker
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
