/**
 * FrontSheetPage.jsx
 * Form for editing front-sheet data only.
 */
import { useReport } from '../context/ReportContext.jsx';

export default function FrontSheetPage() {
  const { report, updateFrontSheet } = useReport();
  const fs = report.frontSheet;

  // ── Guides ────────────────────────────────────────────────────────────────
  function updateGuide(idx, field, value) {
    const guides = fs.guides.map((g, i) =>
      i === idx ? { ...g, [field]: value } : g
    );
    updateFrontSheet({ guides });
  }

  function addGuide() {
    updateFrontSheet({ guides: [...fs.guides, { name: '', designation: '' }] });
  }

  function removeGuide(idx) {
    if (fs.guides.length <= 1) return;
    updateFrontSheet({ guides: fs.guides.filter((_, i) => i !== idx) });
  }

  // ── Students ──────────────────────────────────────────────────────────────
  function updateStudent(idx, field, value) {
    const students = fs.students.map((s, i) =>
      i === idx ? { ...s, [field]: value } : s
    );
    updateFrontSheet({ students });
  }

  function addStudent() {
    updateFrontSheet({ students: [...fs.students, { name: '', usn: '' }] });
  }

  function removeStudent(idx) {
    if (fs.students.length <= 1) return;
    updateFrontSheet({ students: fs.students.filter((_, i) => i !== idx) });
  }

  return (
    <div>
      <h1 className="page-title">📄 Front Sheet</h1>
      <p className="page-subtitle">
        Edit the title page details. These populate the first page of your report.
      </p>

      {/* ── College Info ── */}
      <div className="card">
        <div className="card-title"><span className="card-icon">🏛️</span> College Information</div>

        <div className="form-group">
          <label>College Name</label>
          <input
            id="fs-college-name"
            type="text"
            value={fs.collegeName}
            onChange={(e) => updateFrontSheet({ collegeName: e.target.value })}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Academic Year</label>
            <input
              id="fs-academic-year"
              type="text"
              value={fs.academicYear}
              onChange={(e) => updateFrontSheet({ academicYear: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Department Name</label>
            <input
              id="fs-department"
              type="text"
              value={fs.departmentName}
              onChange={(e) => updateFrontSheet({ departmentName: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Course Name</label>
            <input
              id="fs-course-name"
              type="text"
              value={fs.courseName}
              onChange={(e) => updateFrontSheet({ courseName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Semester</label>
            <input
              id="fs-semester"
              type="text"
              value={fs.semester}
              onChange={(e) => updateFrontSheet({ semester: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* ── Project Info ── */}
      <div className="card">
        <div className="card-title"><span className="card-icon">📋</span> Project Details</div>

        <div className="form-group">
          <label>Report Type</label>
          <input
            id="fs-report-type"
            type="text"
            placeholder="e.g. MINI PROJECT REPORT ON"
            value={fs.reportType}
            onChange={(e) => updateFrontSheet({ reportType: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Project Title</label>
          <input
            id="fs-project-title"
            type="text"
            value={fs.projectTitle}
            onChange={(e) => updateFrontSheet({ projectTitle: e.target.value })}
          />
        </div>
      </div>

      {/* ── Project Guides ── */}
      <div className="card">
        <div className="card-title">
          <span className="card-icon">👩‍🏫</span> Project Guides
          <button
            id="btn-add-guide"
            className="btn btn-secondary btn-sm"
            style={{ marginLeft: 'auto' }}
            onClick={addGuide}
          >
            + Add Guide
          </button>
        </div>

        {fs.guides.map((guide, idx) => (
          <div key={idx} className="form-row" style={{ marginBottom: '12px', alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Name</label>
              <input
                id={`fs-guide-name-${idx}`}
                type="text"
                value={guide.name}
                placeholder="Dr. Name"
                onChange={(e) => updateGuide(idx, 'name', e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Designation</label>
              <input
                id={`fs-guide-desig-${idx}`}
                type="text"
                value={guide.designation}
                placeholder="Associate Professor"
                onChange={(e) => updateGuide(idx, 'designation', e.target.value)}
              />
            </div>
            <button
              id={`btn-remove-guide-${idx}`}
              className="btn btn-danger btn-icon btn-sm"
              onClick={() => removeGuide(idx)}
              disabled={fs.guides.length <= 1}
              title="Remove guide"
              style={{ flexShrink: 0, marginBottom: 0 }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* ── Students ── */}
      <div className="card">
        <div className="card-title">
          <span className="card-icon">🎓</span> Students
          <button
            id="btn-add-student"
            className="btn btn-secondary btn-sm"
            style={{ marginLeft: 'auto' }}
            onClick={addStudent}
          >
            + Add Student
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>Sl.</th>
              <th>Name</th>
              <th>USN</th>
              <th style={{ width: '40px' }}></th>
            </tr>
          </thead>
          <tbody>
            {fs.students.map((student, idx) => (
              <tr key={idx}>
                <td style={{ textAlign: 'center', color: 'var(--c-text-dim)' }}>{idx + 1}</td>
                <td>
                  <input
                    id={`fs-student-name-${idx}`}
                    type="text"
                    value={student.name}
                    placeholder="Full name"
                    onChange={(e) => updateStudent(idx, 'name', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    id={`fs-student-usn-${idx}`}
                    type="text"
                    value={student.usn}
                    placeholder="1JS22IS000"
                    onChange={(e) => updateStudent(idx, 'usn', e.target.value)}
                  />
                </td>
                <td>
                  <button
                    id={`btn-remove-student-${idx}`}
                    className="btn btn-danger btn-icon btn-sm"
                    onClick={() => removeStudent(idx)}
                    disabled={fs.students.length <= 1}
                    title="Remove student"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
