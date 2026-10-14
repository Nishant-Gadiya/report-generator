/**
 * FrontSheetPage.jsx
 * Form for editing front-sheet data only.
 * Supports both JSSATEB (default) and Bangalore Institute of Technology (BIT) templates.
 */
import { useReport } from '../context/ReportContext.jsx';

export default function FrontSheetPage() {
  const { report, updateFrontSheet, updateSettings } = useReport();
  const fs = report.frontSheet;
  const coverTemplate = report.settings?.coverTemplate || 'jssateb';

  function updateGuide(idx, field, value) {
    const guides = fs.guides.map((g, i) => (i === idx ? { ...g, [field]: value } : g));
    updateFrontSheet({ guides });
  }
  function addGuide() {
    updateFrontSheet({ guides: [...fs.guides, { name: '', designation: '' }] });
  }
  function removeGuide(idx) {
    if (fs.guides.length <= 1) return;
    updateFrontSheet({ guides: fs.guides.filter((_, i) => i !== idx) });
  }

  function updateStudent(idx, field, value) {
    const students = fs.students.map((s, i) => (i === idx ? { ...s, [field]: value } : s));
    updateFrontSheet({ students });
  }
  function addStudent() {
    updateFrontSheet({
      students: [...fs.students, { name: '', usn: '', section: '', email: '', phone: '' }],
    });
  }
  function removeStudent(idx) {
    if (fs.students.length <= 1) return;
    updateFrontSheet({ students: fs.students.filter((_, i) => i !== idx) });
  }

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">Front Sheet</h1>
        <p className="page-subtitle">
          Edit title-page details and choose your cover-sheet layout.
        </p>
      </div>

      {/* ── Cover Sheet Template Switcher ── */}
      <div className="card">
        <div className="card-title">
          <span className="card-icon">📑</span> Cover Sheet Template
        </div>
        <p style={{ fontSize: '.8125rem', color: 'var(--c-text-muted)', marginBottom: '12px' }}>
          Select the cover-sheet design format. All existing content and settings remain preserved.
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            id="btn-template-jssateb"
            className={`btn ${coverTemplate === 'jssateb' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => updateSettings({ coverTemplate: 'jssateb' })}
          >
            JSSATEB (Default)
          </button>
          <button
            type="button"
            id="btn-template-bit"
            className={`btn ${coverTemplate === 'bit' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => updateSettings({ coverTemplate: 'bit' })}
          >
            Bangalore Institute of Technology
          </button>
        </div>
      </div>

      {coverTemplate === 'bit' ? (
        <BitForm
          fs={fs}
          updateFrontSheet={updateFrontSheet}
          updateStudent={updateStudent}
          addStudent={addStudent}
          removeStudent={removeStudent}
        />
      ) : (
        <JssatebForm
          fs={fs}
          updateFrontSheet={updateFrontSheet}
          updateGuide={updateGuide}
          addGuide={addGuide}
          removeGuide={removeGuide}
          updateStudent={updateStudent}
          addStudent={addStudent}
          removeStudent={removeStudent}
        />
      )}
    </div>
  );
}

/* ── JSSATEB Form ─────────────────────────────────────────────────────── */
function JssatebForm({
  fs, updateFrontSheet,
  updateGuide, addGuide, removeGuide,
  updateStudent, addStudent, removeStudent,
}) {
  return (
    <>
      {/* College Info */}
      <div className="card">
        <div className="card-title"><span className="card-icon">🏛️</span> College Information</div>
        <div className="form-group">
          <label htmlFor="fs-college-name">College Name</label>
          <input
            id="fs-college-name"
            type="text"
            value={fs.collegeName}
            onChange={(e) => updateFrontSheet({ collegeName: e.target.value })}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fs-academic-year">Academic Year</label>
            <input
              id="fs-academic-year"
              type="text"
              value={fs.academicYear}
              onChange={(e) => updateFrontSheet({ academicYear: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="fs-department">Department Name</label>
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
            <label htmlFor="fs-course-name">Course Name</label>
            <input
              id="fs-course-name"
              type="text"
              value={fs.courseName}
              onChange={(e) => updateFrontSheet({ courseName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="fs-semester">Semester</label>
            <input
              id="fs-semester"
              type="text"
              value={fs.semester}
              onChange={(e) => updateFrontSheet({ semester: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="card">
        <div className="card-title"><span className="card-icon">📋</span> Project Details</div>
        <div className="form-group">
          <label htmlFor="fs-report-type">Report Type</label>
          <input
            id="fs-report-type"
            type="text"
            placeholder="e.g. MINI PROJECT REPORT ON"
            value={fs.reportType}
            onChange={(e) => updateFrontSheet({ reportType: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="fs-project-title">Project Title</label>
          <input
            id="fs-project-title"
            type="text"
            value={fs.projectTitle}
            onChange={(e) => updateFrontSheet({ projectTitle: e.target.value })}
          />
        </div>
      </div>

      {/* Project Guides */}
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
          <div
            key={idx}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', marginBottom: '10px', alignItems: 'end' }}
          >
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor={`fs-guide-name-${idx}`}>Name</label>
              <input
                id={`fs-guide-name-${idx}`}
                type="text"
                value={guide.name}
                placeholder="Dr. Name"
                onChange={(e) => updateGuide(idx, 'name', e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor={`fs-guide-desig-${idx}`}>Designation</label>
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
              style={{ flexShrink: 0 }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Students */}
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
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '36px' }}>#</th>
                <th>Name</th>
                <th>USN</th>
                <th style={{ width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {fs.students.map((student, idx) => (
                <tr key={idx}>
                  <td style={{ textAlign: 'center', color: 'var(--c-text-dim)', fontWeight: 600 }}>
                    {idx + 1}
                  </td>
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
    </>
  );
}

/* ── BIT Form ─────────────────────────────────────────────────────────── */
function BitForm({
  fs, updateFrontSheet,
  updateStudent, addStudent, removeStudent,
}) {
  return (
    <>
      {/* College Info */}
      <div className="card">
        <div className="card-title"><span className="card-icon">🏛️</span> College Information</div>
        <div className="form-group">
          <label htmlFor="bit-college-name">College Name</label>
          <input
            id="bit-college-name"
            type="text"
            value={fs.collegeName}
            onChange={(e) => updateFrontSheet({ collegeName: e.target.value })}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="bit-affiliation">Affiliation</label>
            <input
              id="bit-affiliation"
              type="text"
              value={fs.affiliation || ''}
              onChange={(e) => updateFrontSheet({ affiliation: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="bit-address">Address</label>
            <input
              id="bit-address"
              type="text"
              value={fs.address || ''}
              onChange={(e) => updateFrontSheet({ address: e.target.value })}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="bit-department">Department Name</label>
          <input
            id="bit-department"
            type="text"
            value={fs.departmentName}
            onChange={(e) => updateFrontSheet({ departmentName: e.target.value })}
          />
        </div>
      </div>

      {/* Synopsis Details */}
      <div className="card">
        <div className="card-title"><span className="card-icon">📋</span> Synopsis Details</div>
        <div className="form-group">
          <label htmlFor="bit-synopsis-title">Synopsis Title</label>
          <input
            id="bit-synopsis-title"
            type="text"
            value={fs.synopsisTitle || ''}
            onChange={(e) => updateFrontSheet({ synopsisTitle: e.target.value })}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="bit-semester">Semester</label>
            <input
              id="bit-semester"
              type="text"
              value={fs.semester}
              onChange={(e) => updateFrontSheet({ semester: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="bit-academic-year">Academic Year</label>
            <input
              id="bit-academic-year"
              type="text"
              value={fs.academicYear}
              onChange={(e) => updateFrontSheet({ academicYear: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Minor-Project Details */}
      <div className="card">
        <div className="card-title"><span className="card-icon">💡</span> Minor-Project Details</div>
        <div className="form-group">
          <label htmlFor="bit-project-title">Project Title</label>
          <input
            id="bit-project-title"
            type="text"
            value={fs.projectTitle}
            onChange={(e) => updateFrontSheet({ projectTitle: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="bit-domain">Domain</label>
          <input
            id="bit-domain"
            type="text"
            value={fs.domain || ''}
            onChange={(e) => updateFrontSheet({ domain: e.target.value })}
          />
        </div>
      </div>

      {/* Office Evaluation */}
      <div className="card">
        <div className="card-title"><span className="card-icon">🏢</span> Office Evaluation &amp; Co-ordinator</div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="bit-group-id">Group ID</label>
            <input
              id="bit-group-id"
              type="text"
              placeholder="e.g. G-12"
              value={fs.groupId || ''}
              onChange={(e) => updateFrontSheet({ groupId: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="bit-guide-name">Guide Name</label>
            <input
              id="bit-guide-name"
              type="text"
              placeholder="e.g. Dr. Guide Name"
              value={(fs.guides && fs.guides[0]?.name) || fs.guideName || ''}
              onChange={(e) => {
                const val = e.target.value;
                const curGuides =
                  Array.isArray(fs.guides) && fs.guides.length > 0
                    ? [...fs.guides]
                    : [{ name: '', designation: '' }];
                curGuides[0] = { ...curGuides[0], name: val };
                updateFrontSheet({ guides: curGuides, guideName: val });
              }}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="bit-coordinator-title">Co-ordinator Signature Label</label>
          <input
            id="bit-coordinator-title"
            type="text"
            value={fs.coordinatorTitle || ''}
            onChange={(e) => updateFrontSheet({ coordinatorTitle: e.target.value })}
          />
        </div>
      </div>

      {/* Project Group Members */}
      <div className="card">
        <div className="card-title">
          <span className="card-icon">👥</span> Project Group Members
          <button
            id="btn-add-member"
            className="btn btn-secondary btn-sm"
            style={{ marginLeft: 'auto' }}
            onClick={addStudent}
          >
            + Add Member
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '32px' }}>#</th>
                <th style={{ width: '130px' }}>USN</th>
                <th>Name</th>
                <th style={{ width: '56px' }}>Sec.</th>
                <th>Email</th>
                <th style={{ width: '120px' }}>Phone</th>
                <th style={{ width: '36px' }}></th>
              </tr>
            </thead>
            <tbody>
              {fs.students.map((student, idx) => (
                <tr key={idx}>
                  <td style={{ textAlign: 'center', color: 'var(--c-text-dim)', fontWeight: 600 }}>
                    {idx + 1}
                  </td>
                  <td>
                    <input
                      id={`bit-student-usn-${idx}`}
                      type="text"
                      value={student.usn || ''}
                      placeholder="1BI21CS000"
                      onChange={(e) => updateStudent(idx, 'usn', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      id={`bit-student-name-${idx}`}
                      type="text"
                      value={student.name || ''}
                      placeholder="Full name"
                      onChange={(e) => updateStudent(idx, 'name', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      id={`bit-student-sec-${idx}`}
                      type="text"
                      value={student.section || ''}
                      placeholder="A"
                      onChange={(e) => updateStudent(idx, 'section', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      id={`bit-student-email-${idx}`}
                      type="email"
                      value={student.email || ''}
                      placeholder="name@example.com"
                      onChange={(e) => updateStudent(idx, 'email', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      id={`bit-student-phone-${idx}`}
                      type="text"
                      value={student.phone || ''}
                      placeholder="9876543210"
                      onChange={(e) => updateStudent(idx, 'phone', e.target.value)}
                    />
                  </td>
                  <td>
                    <button
                      id={`btn-remove-member-${idx}`}
                      className="btn btn-danger btn-icon btn-sm"
                      onClick={() => removeStudent(idx)}
                      disabled={fs.students.length <= 1}
                      title="Remove member"
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
    </>
  );
}
