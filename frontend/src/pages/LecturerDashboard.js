import { useEffect, useState } from 'react';
import lecturerAPI from '../api/lecturer';
import {
  SubmissionTrendChart,
  CoursePerformanceChart,
  StatusPieChart
} from '../components/Charts';
import '../components/LecturerDashboard.css';

function LecturerDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await lecturerAPI.getDashboard();
      const data = res.data;

      const { lecturer, courses, submissions, stats } = data;

      /* -------------------------------
         Merge Courses + Submissions
      --------------------------------*/
      const mergedCourses = courses.map(course => {
        const submission = submissions.find(
          s => s.courseId === course.id
        );

        return {
          id: course.id,
          code: course.courseCode,
          name: course.courseName,
          students: submission?.totalStudents ?? 0,
          averageScore: submission
            ? Math.floor(Math.random() * 15) + 65 // placeholder avg
            : 0,
          submissionDate: submission
            ? new Date(submission.submissionDate).toLocaleDateString()
            : '—',
          status: submission?.status ?? 'draft'
        };
      });

      /* -------------------------------
         Stats
      --------------------------------*/
      const totalStudents = submissions.reduce(
        (sum, s) => sum + (s.totalStudents || 0),
        0
      );

      /* -------------------------------
         Charts Data
      --------------------------------*/

      // Submission Trends (by date)
      const submissionTrends = submissions.map(s => ({
        date: new Date(s.submissionDate).toLocaleDateString(),
        count: 1
      }));

      // Status Distribution
      const statusDistribution = [
        { name: 'Approved', value: stats.approvedSubmissions },
        { name: 'Pending', value: stats.pendingSubmissions },
        {
          name: 'Draft',
          value: courses.length - submissions.length
        }
      ];

      // Course Performance
      const coursePerformance = mergedCourses.map(c => ({
        course: c.code,
        average: c.averageScore
      }));

      setDashboard({
        lecturer,
        stats: {
          resultsUploaded: submissions.length,
          pendingApproval: stats.pendingSubmissions,
          approvedResults: stats.approvedSubmissions,
          totalStudents
        },
        submissionTrends,
        statusDistribution,
        coursePerformance
      });

      setCourses(mergedCourses);
    } catch (err) {
      console.error('Failed to load dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  const {
    lecturer,
    stats,
    submissionTrends,
    coursePerformance,
    statusDistribution
  } = dashboard;

  /* -------------------------------
     Filters
  --------------------------------*/
  const filteredCourses = courses
    .filter(course => activeTab === 'all' || course.status === activeTab)
    .filter(course =>
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  /* -------------------------------
     Status Badge
  --------------------------------*/
  const getStatusBadge = status => {
    const map = {
      approved: { label: 'Approved', color: '#198754', icon: 'checked' },
      pending: { label: 'Pending', color: '#ffc107', icon: 'clock' },
      draft: { label: 'Draft', color: '#6c757d', icon: 'document' },
      rejected: { label: 'Rejected', color: '#dc3545', icon: 'cancel' }
    };

    const s = map[status] || map.draft;

    return (
      <span className="status-badge" style={{ backgroundColor: s.color }}>
        <img
          src={`https://img.icons8.com/ios-filled/14/ffffff/${s.icon}.png`}
          alt={s.label}
        />
        {s.label}
      </span>
    );
  };

  return (
    <div className="dashboard-wrapper lecturer-dashboard">
      <div className="dashboard-container">

        {/* HEADER */}
        <div className="dashboard-header">
          <div className="header-left">
            <div className="header-icon">
              <img
                src="https://img.icons8.com/fluency/48/teacher.png"
                alt="Lecturer"
              />
            </div>
            <div>
              <h1 className="dashboard-title">Lecturer Dashboard</h1>
              <p className="dashboard-subtitle">
                {lecturer.title} {lecturer.User.firstName}{' '}
                {lecturer.User.lastName} • {lecturer.department}
              </p>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <StatCard title="Results Uploaded" value={stats.resultsUploaded} />
          <StatCard title="Pending Approval" value={stats.pendingApproval} />
          <StatCard title="Approved Results" value={stats.approvedResults} />
          <StatCard title="Total Students" value={stats.totalStudents} />
        </div>

        {/* CHARTS */}
        <div className="charts-section">
          <ChartBox title="Submission Trends">
            <SubmissionTrendChart data={submissionTrends} />
          </ChartBox>

          <ChartBox title="Status Distribution">
            <StatusPieChart data={statusDistribution} />
          </ChartBox>
        </div>

        <ChartBox title="Course Performance Overview" full>
          <CoursePerformanceChart data={coursePerformance} />
        </ChartBox>

        {/* TABLE */}
        <div className="table-container">
          <div className="table-header">
            <h3>Course Results Management</h3>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-tabs">
            {['all', 'pending', 'approved', 'draft'].map(tab => (
              <button
                key={tab}
                className={activeTab === tab ? 'active' : ''}
                onClick={() => setActiveTab(tab)}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          <table className="results-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Students</th>
                <th>Avg</th>
                <th>Submitted</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map(course => (
                <tr key={course.id}>
                  <td>
                    <strong>{course.code}</strong>
                    <div>{course.name}</div>
                  </td>
                  <td>{course.students}</td>
                  <td>{course.averageScore}%</td>
                  <td>{course.submissionDate}</td>
                  <td>{getStatusBadge(course.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="table-footer">
            Showing {filteredCourses.length} of {courses.length} courses
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------
   Reusable Components
--------------------------------*/

const StatCard = ({ title, value }) => (
  <div className="stat-card">
    <div className="stat-label">{title}</div>
    <div className="stat-value">{value}</div>
  </div>
);

const ChartBox = ({ title, children, full }) => (
  <div className={`chart-container ${full ? 'chart-full' : ''}`}>
    <h3>{title}</h3>
    {children}
  </div>
);

export default LecturerDashboard;
