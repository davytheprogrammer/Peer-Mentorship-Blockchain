'use client';

type Tab = 'dashboard' | 'sessions' | 'leaderboard' | 'governance';

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'sessions', label: 'Sessions', icon: '📝' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { id: 'governance', label: 'Governance', icon: '🗳️' },
  ];

  return (
    <nav className="nav-container glass">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`nav-button ${activeTab === tab.id ? 'active' : ''}`}
          style={{
            border: 'none',
            outline: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: activeTab === tab.id ? undefined : 'transparent',
          }}
        >
          <span style={{ fontSize: '1.25rem' }}>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
