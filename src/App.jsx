/**
 * App.jsx — Root component with sidebar navigation and page routing.
 */
import { useState } from 'react';
import { ReportProvider, useReport } from './context/ReportContext.jsx';
import FrontSheetPage from './pages/FrontSheetPage.jsx';
import PrelimsPage from './pages/PrelimsPage.jsx';
import SectionsPage from './pages/SectionsPage.jsx';
import ReferencesPage from './pages/ReferencesPage.jsx';
import HeaderFooterPage from './pages/HeaderFooterPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import GeneratePage from './pages/GeneratePage.jsx';
import './App.css';

const NAV_ITEMS = [
  { id: 'front-sheet',   label: 'Front Sheet',              icon: '📄', page: FrontSheetPage },
  { id: 'prelims',       label: 'Acknowledgement & Abstract',icon: '📑', page: PrelimsPage },
  { id: 'sections',      label: 'Report Sections',           icon: '📝', page: SectionsPage },
  { id: 'references',    label: 'References',                icon: '📚', page: ReferencesPage },
  { id: 'header-footer', label: 'Header & Footer',           icon: '🔝', page: HeaderFooterPage },
  { id: 'settings',      label: 'Settings & Templates',      icon: '⚙️',  page: SettingsPage },
  { id: 'generate',      label: 'Generate PDF',              icon: '🖨️',  page: GeneratePage },
];

function AppShell() {
  const [activeNav, setActiveNav] = useState('front-sheet');
  const { report, loading, newReport } = useReport();

  if (loading) {
    return (
      <div className="spinner-wrap">
        <div className="spinner" />
        <p style={{ fontSize: '.875rem', color: 'var(--c-text-muted)' }}>
          Loading your report…
        </p>
      </div>
    );
  }

  const ActivePage = NAV_ITEMS.find((n) => n.id === activeNav)?.page ?? FrontSheetPage;

  function handleNewReport() {
    if (
      confirm('Create a new report? Your current work will be cleared from local storage.')
    ) {
      newReport();
      setActiveNav('front-sheet');
    }
  }

  return (
    <div className="app-shell">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-logo-mark" aria-hidden="true">📚</div>
        <div>
          <div className="header-brand">Academic Report Generator</div>
          <div className="header-subtitle">Paged.js · React · Vite</div>
        </div>

        <div className="header-actions">
          <AutosaveIndicator report={report} />
          <button
            id="btn-new-report"
            className="btn btn-header btn-sm"
            onClick={handleNewReport}
          >
            + New Report
          </button>
        </div>
      </header>

      {/* ── Sidebar ── */}
      <nav className="app-sidebar" aria-label="Main navigation">
        <div className="sidebar-section-label">Pages</div>

        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            className={`sidebar-nav-item${activeNav === item.id ? ' active' : ''}`}
            onClick={() => setActiveNav(item.id)}
            aria-current={activeNav === item.id ? 'page' : undefined}
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            {item.label}
          </button>
        ))}

        <hr className="sidebar-divider" style={{ marginTop: 'auto' }} />

        <div className="sidebar-section-label">Report Info</div>
        <div className="sidebar-info">
          <div className="sidebar-info-row">
            <span>Sections</span>
            <span className="sidebar-info-val">{report?.sections?.length ?? 0}</span>
          </div>
          <div className="sidebar-info-row">
            <span>References</span>
            <span className="sidebar-info-val">{report?.references?.items?.length ?? 0}</span>
          </div>
          <div className="sidebar-info-row">
            <span>Students</span>
            <span className="sidebar-info-val">
              {report?.frontSheet?.students?.filter((s) => s.name || s.usn).length ?? 0}
            </span>
          </div>
          <div className="sidebar-info-row">
            <span>Template</span>
            <span className="sidebar-info-val" style={{ textTransform: 'capitalize' }}>
              {report?.settings?.template ?? '—'}
            </span>
          </div>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="app-main" id="app-main">
        <div className="page-content">
          <ActivePage />
        </div>
      </main>
    </div>
  );
}

function AutosaveIndicator({ report }) {
  if (!report) return null;
  const lastSaved = report.updatedAt
    ? new Date(report.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;
  return (
    <div className="autosave-indicator" title={`Last saved: ${lastSaved ?? 'not yet'}`}>
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
