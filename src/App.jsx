/**
 * App.jsx — Root component with sidebar navigation and page routing.
 */
import { useState } from 'react';
import { ReportProvider, useReport } from './context/ReportContext.jsx';
import FrontSheetPage from './pages/FrontSheetPage.jsx';
import SectionsPage from './pages/SectionsPage.jsx';
import HeaderFooterPage from './pages/HeaderFooterPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import GeneratePage from './pages/GeneratePage.jsx';
import './App.css';

const NAV_ITEMS = [
  { id: 'front-sheet', label: 'Front Sheet', icon: '📄', page: FrontSheetPage },
  { id: 'sections', label: 'Report Sections', icon: '📝', page: SectionsPage },
  { id: 'header-footer', label: 'Header & Footer', icon: '🔝', page: HeaderFooterPage },
  { id: 'settings', label: 'Settings & Templates', icon: '⚙️', page: SettingsPage },
  { id: 'generate', label: 'Generate PDF', icon: '🖨️', page: GeneratePage },
];

function AppShell() {
  const [activeNav, setActiveNav] = useState('front-sheet');
  const { report, loading, newReport } = useReport();

  if (loading) {
    return (
      <div className="spinner-wrap">
        <div className="spinner" />
        <p>Loading your report…</p>
      </div>
    );
  }

  const ActivePage = NAV_ITEMS.find((n) => n.id === activeNav)?.page ?? FrontSheetPage;

  function handleNewReport() {
    if (
      confirm(
        'Create a new report? Your current work will be cleared from local storage.'
      )
    ) {
      newReport();
      setActiveNav('front-sheet');
    }
  }

  return (
    <div className="app-shell">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-logo-mark">📚</div>
        <div>
          <div className="header-brand">Academic Report Generator</div>
          <div className="header-subtitle">Paged.js · React · Vite</div>
        </div>

        <div className="header-actions">
          <AutosaveIndicator report={report} />
          <button
            id="btn-new-report"
            className="btn btn-secondary btn-sm"
            onClick={handleNewReport}
          >
            + New Report
          </button>
        </div>
      </header>

      {/* ── Sidebar ── */}
      <nav className="app-sidebar" aria-label="Main navigation">
        <div className="sidebar-section-label">Navigation</div>

        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            className={`sidebar-nav-item ${activeNav === item.id ? 'active' : ''}`}
            onClick={() => setActiveNav(item.id)}
            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}

        <hr className="divider" style={{ margin: '12px 16px' }} />

        <div className="sidebar-section-label">Report Info</div>
        <div style={{ padding: '8px 16px', fontSize: '.75rem', color: 'var(--c-text-dim)', lineHeight: '1.6' }}>
          <div>{report?.sections?.length ?? 0} sections</div>
          <div>{report?.frontSheet?.students?.filter((s) => s.name || s.usn).length ?? 0} students</div>
          <div>Template: {report?.settings?.template ?? '—'}</div>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="app-main" id="app-main">
        <ActivePage />
      </main>
    </div>
  );
}

function AutosaveIndicator({ report }) {
  if (!report) return null;
  const lastSaved = report.updatedAt
    ? new Date(report.updatedAt).toLocaleTimeString()
    : null;
  return (
    <div className="autosave-indicator" title={`Last saved: ${lastSaved}`}>
      <div className="autosave-dot" />
      <span>{lastSaved ? `Saved ${lastSaved}` : 'Unsaved'}</span>
    </div>
  );
}

export default function App() {
  return (
    <ReportProvider>
      <AppShell />
    </ReportProvider>
  );
}
