import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Sidebar({ activeNav = 'home', onSelectNav }) {
  const { user, logout } = useAuth()
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const navItems = [
    {
      id: 'home',
      label: 'Dashboard',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: 'recordings',
      label: 'Recordings',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="22" />
        </svg>
      ),
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      id: 'folders',
      label: 'Documents',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ]

  return (
    <aside className="w-16 sm:w-20 bg-white border-r border-[#eeebf5] flex flex-col items-center py-6 select-none shrink-0 min-h-screen">
      {/* Top Logo 'm.' */}
      <div className="mb-8">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault()
            if (onSelectNav) onSelectNav('home')
          }}
          className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-transparent transition-transform hover:scale-105"
          title="Meeting Minutes Generator"
        >
          <span className="text-2xl font-extrabold text-[#743cee] tracking-tight">m.</span>
        </a>
      </div>

      {/* Navigation Icons */}
      <nav className="flex-1 flex flex-col items-center space-y-4">
        {navItems.map((item) => {
          const isActive = activeNav === item.id
          return (
            <button
              key={item.id}
              onClick={() => onSelectNav && onSelectNav(item.id)}
              title={item.label}
              className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all ${
                isActive
                  ? 'text-[#743cee] bg-[#f1ebfe]'
                  : 'text-[#969ba8] hover:text-[#5122b1] hover:bg-[#faf9fd]'
              }`}
            >
              {item.icon}
            </button>
          )
        })}
      </nav>

      {/* User Avatar & Logout */}
      <div className="relative mt-auto">
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="h-10 w-10 rounded-xl bg-[#f1ebfe] text-[#743cee] font-semibold text-xs flex items-center justify-center border border-[#e4d7fe] hover:border-[#743cee] transition-all"
          title={user?.name || 'User Profile'}
        >
          {user?.name ? (
            user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
          ) : (
            'U'
          )}
        </button>

        {/* Profile Dropdown */}
        {showProfileMenu && (
          <div className="absolute left-14 bottom-0 w-52 bg-white rounded-2xl shadow-xl border border-[#eeebf5] p-2 z-50 animate-fade-in">
            <div className="px-3 py-2 border-b border-[#f4f3f8]">
              <p className="text-xs font-bold text-[#181925] truncate">{user?.name || 'User'}</p>
              <p className="text-[11px] text-[#8c91a0] truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => {
                setShowProfileMenu(false)
                logout()
              }}
              className="w-full mt-1 px-3 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign out</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
