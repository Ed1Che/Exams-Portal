import { useState } from 'react';
import { ApprovalMetricsChart, StatusPieChart, SubmissionTrendChart } from '../components/Charts';
import '../components/AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  
  const approvalMetricsData = [
    { week: 'Week 1', approved: 12, pending: 5, rejected: 2 },
    { week: 'Week 2', approved: 15, pending: 8, rejected: 1 },
    { week: 'Week 3', approved: 18, pending: 6, rejected: 3 },
    { week: 'Week 4', approved: 20, pending: 4, rejected: 1 },
    { week: 'Week 5', approved: 22, pending: 5, rejected: 2 },
    { week: 'Week 6', approved: 25, pending: 3, rejected: 1 }
  ];

  const statusDistributionData = [
    { name: 'Approved', value: 18 },
    { name: 'Pending', value: 5 },
    { name: 'Rejected', value: 2 }
  ];

  const submissionTrendData = [
    { month: 'Sep', submitted: 45, approved: 42 },
    { month: 'Oct', submitted: 52, approved: 48 },
    { month: 'Nov', submitted: 48, approved: 45 },
    { month: 'Dec', submitted: 38, approved: 36 },
    { month: 'Jan', submitted: 55, approved: 50 },
    { month: 'Feb', submitted: 42, approved: 38 }
  ];

  const pendingApprovals = [
    {
      id: 1,
      courseCode: "CSC 403",
      courseName: "Machine Learning",
      lecturer: "Dr. J. Mwangi",
      department: "Computer Science",
      submittedOn: "14 Jan 2026",
      students: 28,
      status: "pending",
      priority: "high"
    },
    {
      id: 2,
      courseCode: "MTH 301",
      courseName: "Advanced Calculus",
      lecturer: "Prof. A. Brown",
      department: "Mathematics",
      submittedOn: "13 Jan 2026",
      students: 35,
      status: "pending",
      priority: "medium"
    },
    {
      id: 3,
      courseCode: "ENG 201",
      courseName: "Technical Writing",
      lecturer: "Dr. S. Davis",
      department: "English",
      submittedOn: "12 Jan 2026",
      students: 42,
      status: "pending",
      priority: "low"
    },
    {
      id: 4,
      courseCode: "PHY 101",
      courseName: "General Physics",
      lecturer: "Prof. K. Wilson",
      department: "Physics",
      submittedOn: "11 Jan 2026",
      students: 55,
      status: "pending",
      priority: "high"
    }
  ];

  const verificationRequests = [
    {
      id: 1,
      institution: "Tech Corporation Ltd",
      requestType: "Employment Verification",
      studentName: "Jane Smith",
      studentId: "2020/CS/015",
      requestedOn: "15 Jan 2026",
      status: "pending",
      priority: "urgent"
    },
    {
      id: 2,
      institution: "University of Progress",
      requestType: "Admission Verification",
      studentName: "John Doe",
      studentId: "2020/CS/001",
      requestedOn: "14 Jan 2026",
      status: "pending",
      priority: "normal"
    }
  ];

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      urgent: { label: "Urgent", color: "#dc3545", icon: "https://img.icons8.com/office/40/high-importance.png" },
      high: { label: "High", color: "#ffc107", icon: "https://img.icons8.com/ios-filled/14/ffffff/up-arrow.png" },
      medium: { label: "Medium", color: "#0dcaf0", icon: "https://img.icons8.com/ios-filled/14/ffffff/clock.png" },
      low: { label: "Low", color: "#6c757d", icon: "https://img.icons8.com/ios-filled/14/ffffff/clock.png" },
      normal: { label: "Normal", color: "#e9ecef", icon: "https://img.icons8.com/ios-filled/14/6c757d/checked.png" }
    };
    const config = priorityConfig[priority] || priorityConfig.normal;
    return (
      <span className="priority-badge" style={{ backgroundColor: config.color, color: priority === 'normal' ? '#495057' : 'white' }}>
        <img src={config.icon} alt={config.label} />
        {config.label}
      </span>
    );
  };

  const filteredApprovals = pendingApprovals.filter(item =>
    item.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.lecturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-wrapper admin-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <div className="header-icon">
                <img src="https://img.icons8.com/fluency/48/000000/administrator-male.png" alt="Admin" />
              </div>
              <div className="header-text">
                <h1 className="dashboard-title">Examination Office Dashboard</h1>
                <p className="dashboard-subtitle">Verify, approve, and manage official examination results and transcripts</p>
              </div>
            </div>
            <div className="header-actions">
              <button className="btn btn-primary">
                <img src="https://img.icons8.com/ios-filled/20/ffffff/bell.png" alt="Notifications" className="btn-icon" />
                Notifications (3)
              </button>
              <button className="btn btn-secondary">
                <img src="https://img.icons8.com/ios-filled/20/172b4d/bar-chart.png" alt="Report" className="btn-icon" />
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card stat-danger">
            <div className="stat-content">
              <div className="stat-info">
                <div className="stat-label">New Submissions</div>
                <div className="stat-value">{pendingApprovals.length}</div>
                <div className="stat-badge danger">
                  <img src="https://img.icons8.com/office/40/high-importance.png" alt="Warning" />
                  Urgent Review
                </div>
              </div>
              <div className="stat-icon-wrapper">
                <img src="https://img.icons8.com/fluency/40/dc3545/inbox.png" alt="Submissions" />
              </div>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-content">
              <div className="stat-info">
                <div className="stat-label">Approved Results</div>
                <div className="stat-value">18</div>
                <div className="stat-trend positive">
                  <img src="https://img.icons8.com/ios-filled/16/198754/checked.png" alt="Check" />
                  Verified & published
                </div>
              </div>
              <div className="stat-icon-wrapper">
                <img src="https://img.icons8.com/fluency/40/198754/checked.png" alt="Approved" />
              </div>
            </div>
          </div>

          <div className="stat-card stat-warning">
            <div className="stat-content">
              <div className="stat-info">
                <div className="stat-label">Verification Requests</div>
                <div className="stat-value">{verificationRequests.length}</div>
                <div className="stat-description">From institutions</div>
              </div>
              <div className="stat-icon-wrapper">
                <img src="https://img.icons8.com/fluency/40/ffc107/shield.png" alt="Verification" />
              </div>
            </div>
          </div>

          <div className="stat-card stat-info">
            <div className="stat-content">
              <div className="stat-info">
                <div className="stat-label">System Status</div>
                <div className="stat-value">100%</div>
                <div className="stat-badge success">
                  <img src="https://img.icons8.com/ios-filled/14/198754/checked.png" alt="Check" />
                  Operational
                </div>
              </div>
              <div className="stat-icon-wrapper">
                <img src="https://img.icons8.com/fluency/40/0dcaf0/server.png" alt="System" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-container chart-large">
            <div className="chart-header">
              <div className="chart-title-group">
                <img src="https://img.icons8.com/fluency/24/172b4d/bar-chart.png" alt="Chart" className="chart-icon" />
                <div>
                  <h3 className="chart-title">Approval Metrics</h3>
                  <p className="chart-subtitle">Weekly approval trends</p>
                </div>
              </div>
              <button className="btn-icon-only">
                <img src="https://img.icons8.com/ios-filled/18/6c757d/download.png" alt="Export" />
              </button>
            </div>
            <div className="chart-body">
              <ApprovalMetricsChart data={approvalMetricsData} />
            </div>
          </div>

          <div className="chart-container chart-small">
            <div className="chart-header">
              <div className="chart-title-group">
                <img src="https://img.icons8.com/fluency/24/172b4d/pie-chart.png" alt="Chart" className="chart-icon" />
                <div>
                  <h3 className="chart-title">Status Distribution</h3>
                  <p className="chart-subtitle">Current submissions</p>
                </div>
              </div>
            </div>
            <div className="chart-body">
              <StatusPieChart data={statusDistributionData} />
            </div>
          </div>
        </div>

        {/* Submission Trends */}
        <div className="chart-container chart-full">
          <div className="chart-header">
            <div className="chart-title-group">
              <img src="https://img.icons8.com/fluency/24/172b4d/line-chart.png" alt="Chart" className="chart-icon" />
              <div>
                <h3 className="chart-title">Submission Trends</h3>
                <p className="chart-subtitle">Monthly submission and approval rates</p>
              </div>
            </div>
            <button className="btn-icon-only">
              <img src="https://img.icons8.com/ios-filled/18/6c757d/download.png" alt="Export" />
            </button>
          </div>
          <div className="chart-body">
            <SubmissionTrendChart data={submissionTrendData} />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="content-grid">
          {/* Pending Approvals Table */}
          <div className="content-main">
            <div className="table-container">
              <div className="table-header">
                <div className="table-title-group">
                  <img src="https://img.icons8.com/fluency/24/172b4d/list.png" alt="List" className="table-icon" />
                  <div>
                    <h3 className="table-title">Pending Result Approvals</h3>
                    <p className="table-subtitle">Require immediate attention</p>
                  </div>
                </div>
                <div className="table-actions-group">
                  <div className="search-wrapper">
                    <img src="https://img.icons8.com/ios-filled/18/6c757d/search.png" alt="Search" className="search-icon" />
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search submissions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button className="btn btn-outline">
                    <img src="https://img.icons8.com/ios-filled/16/6c757d/filter.png" alt="Filter" className="btn-icon" />
                    Filter
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="table-tabs">
                <button 
                  className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                  onClick={() => setActiveTab('pending')}
                >
                  <img src="https://img.icons8.com/ios-filled/16/6c757d/clock.png" alt="Clock" />
                  Pending ({pendingApprovals.length})
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'verification' ? 'active' : ''}`}
                  onClick={() => setActiveTab('verification')}
                >
                  <img src="https://img.icons8.com/ios-filled/16/6c757d/shield.png" alt="Shield" />
                  Verification ({verificationRequests.length})
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  <img src="https://img.icons8.com/ios-filled/16/6c757d/bar-chart.png" alt="Chart" />
                  All Records
                </button>
              </div>

              <div className="table-wrapper">
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Course Code</th>
                      <th>Course Details</th>
                      <th>Lecturer</th>
                      <th>Submitted</th>
                      <th>Priority</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApprovals.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <span className="course-code">{item.courseCode}</span>
                          <br />
                          <span className="course-students">{item.students} students</span>
                        </td>
                        <td>
                          <div className="course-name">{item.courseName}</div>
                          <span className="course-department">{item.department}</span>
                        </td>
                        <td>
                          <div>{item.lecturer}</div>
                          <span className="lecturer-role">Senior Lecturer</span>
                        </td>
                        <td>
                          <div>{item.submittedOn}</div>
                          <span className="submitted-ago">2 days ago</span>
                        </td>
                        <td>{getPriorityBadge(item.priority)}</td>
                        <td className="text-end">
                          <div className="action-buttons">
                            <button className="action-btn" title="Approve">
                              <img src="https://img.icons8.com/ios-filled/18/198754/checked.png" alt="Approve" />
                            </button>
                            <button className="action-btn" title="Reject">
                              <img src="https://img.icons8.com/ios-filled/18/dc3545/cancel.png" alt="Reject" />
                            </button>
                            <button className="action-btn" title="View Details">
                              <img src="https://img.icons8.com/ios-filled/18/0066cc/visible.png" alt="View" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="table-footer">
                <div className="table-footer-left">
                  <span className="table-info">Showing {filteredApprovals.length} of {pendingApprovals.length} pending approvals</span>
                </div>
                <button className="btn btn-outline">
                  <img src="https://img.icons8.com/ios-filled/16/6c757d/download.png" alt="Download" className="btn-icon" />
                  Export List
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="content-sidebar">
            {/* Verification Requests */}
            <div className="sidebar-card">
              <div className="sidebar-card-header">
                <img src="https://img.icons8.com/fluency/20/172b4d/shield.png" alt="Shield" />
                <h4 className="sidebar-card-title">Verification Requests</h4>
              </div>
              <div className="sidebar-card-body">
                {verificationRequests.map((request) => (
                  <div key={request.id} className="verification-item">
                    <div className="verification-header">
                      <div>
                        <div className="verification-institution">{request.institution}</div>
                        <div className="verification-type">{request.requestType}</div>
                      </div>
                      {getPriorityBadge(request.priority)}
                    </div>
                    <div className="verification-student">
                      <div className="verification-label">Student</div>
                      <div className="verification-name">{request.studentName}</div>
                      <div className="verification-id">{request.studentId}</div>
                    </div>
                    <div className="verification-footer">
                      <span className="verification-date">{request.requestedOn}</span>
                      <button className="btn btn-sm btn-dark">Process</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="sidebar-card-footer">
                <button className="btn btn-outline btn-sm btn-full">View All Verification Requests</button>
              </div>
            </div>

            {/* System Status */}
            <div className="sidebar-card">
              <div className="sidebar-card-header">
                <img src="https://img.icons8.com/fluency/20/172b4d/server.png" alt="Server" />
                <h4 className="sidebar-card-title">System Status</h4>
              </div>
              <div className="sidebar-card-body">
                <div className="system-status-item">
                  <span>Result Submission</span>
                  <span className="status-badge status-operational">Operational</span>
                </div>
                <div className="system-status-item">
                  <span>Verification System</span>
                  <span className="status-badge status-operational">Operational</span>
                </div>
                <div className="system-status-item">
                  <span>Database</span>
                  <span className="status-badge status-operational">Operational</span>
                </div>
                <div className="system-status-item">
                  <span>Security</span>
                  <span className="status-badge status-operational">Active</span>
                </div>
              </div>
              <div className="sidebar-card-footer">
                <div className="system-update">
                  <img src="https://img.icons8.com/ios-filled/12/6c757d/clock.png" alt="Clock" />
                  Last updated: Today, 10:30 AM
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
