import { useNavigate } from "react-router-dom";
import { 
  Mortarboard, 
  PersonBadge, 
  ShieldCheck, 
  CheckCircleFill,
  ClockHistory,
  Headset,
  InfoCircle,
  ArrowRight
} from 'react-bootstrap-icons';
import "./RoleSelector.css";

function RoleSelector() {
  const navigate = useNavigate();

  const selectRole = (role) => {
    navigate(`/login/${role}`);
  };

  const roles = [
    {
      id: "student",
      title: "Student",
      icon: Mortarboard,
      color: "#0066cc",
      description: "Access your examination results, view transcripts, and track academic progress",
      features: ["View results", "Download transcripts", "Track progress"],
      buttonText: "Student Portal"
    },
    {
      id: "lecturer",
      title: "Lecturer",
      icon: PersonBadge,
      color: "#00875a",
      description: "Upload and manage student examination results, submit grades securely",
      features: ["Upload results", "Grade management", "Student tracking"],
      buttonText: "Lecturer Portal"
    },
    {
      id: "admin",
      title: "Examination Office",
      icon: ShieldCheck,
      color: "#172b4d",
      description: "Verify, approve, and manage official examination records and transcripts",
      features: ["Result verification", "System management", "Official records"],
      buttonText: "Admin Portal"
    }
  ];

  return (
    <div className="role-selector-container">
      {/* Header with University Branding */}
      <div className="university-header py-4 border-bottom">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="university-logo me-3">
                <ShieldCheck color="#0066cc" size={24} />
              </div>
              <div>
                <h4 className="fw-bold mb-0">University Examination System</h4>
                <small className="text-muted">Secure Digital Platform</small>
              </div>
            </div>          
          </div>
        </div>
      </div>

      <div className="container py-5">
        {/* Main Content */}
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center mb-5">
            <h1 className="fw-bold mb-3">Welcome to the Examination Portal</h1>
            <p className="text-muted lead mb-0">
              Select your role to access the secure examination management system
            </p>
          </div>
        </div>

        {/* Role Cards - Professional Layout */}
        <div className="row justify-content-center g-4">
          {roles.map((role) => (
            <div className="col-md-4" key={role.id}>
              <div className="card professional-card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-0 pt-4 pb-0">
                  <div className="d-flex align-items-center">
                    <div 
                      className="icon-container me-3"
                      style={{ backgroundColor: `${role.color}15` }}
                    >
                      <role.icon 
                        color={role.color}
                        size={24}
                      />
                    </div>
                    <h5 className="fw-bold mb-0" style={{ color: role.color }}>
                      {role.title}
                    </h5>
                  </div>
                </div>
                
                <div className="card-body d-flex flex-column">
                  <p className="text-muted mb-4">
                    {role.description}
                  </p>
                  
                  <div className="features-list mb-4">
                    {role.features.map((feature, index) => (
                      <div key={index} className="d-flex align-items-center mb-2">
                        <CheckCircleFill 
                          className="me-2" 
                          size={16}
                          style={{ color: role.color }}
                        />
                        <small className="text-muted">{feature}</small>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-auto">
                    <button
                      className="btn w-100 py-3 d-flex align-items-center justify-content-center"
                      onClick={() => selectRole(role.id)}
                      style={{
                        backgroundColor: role.color,
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '500',
                        fontSize: '0.95rem',
                        transition: 'all 0.2s ease',
                        gap: '8px'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.opacity = '0.9';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.opacity = '1';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      {role.buttonText}
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Information */}
        <div className="row justify-content-center mt-5">
          <div className="col-lg-8">
            <div className="card border-0 bg-light">
              <div className="card-body text-center py-4">
                <div className="row align-items-center">
                  <div className="col-md-4 border-end">
                    <div className="d-flex align-items-center justify-content-center">
                      <ClockHistory className="text-primary me-3" size={20} />
                      <div className="text-start">
                        <small className="text-muted d-block">System Status</small>
                        <span className="text-success fw-semibold">Operational</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 border-end">
                    <div className="d-flex align-items-center justify-content-center">
                      <Headset className="text-primary me-3" size={20} />
                      <div className="text-start">
                        <small className="text-muted d-block">Support</small>
                        <small>examoffice@university.edu</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex align-items-center justify-content-center">
                      <InfoCircle className="text-primary me-3" size={20} />
                      <div className="text-start">
                        <small className="text-muted d-block">Version</small>
                        <small>v2.1.4 • Updated today</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-4">
          <small className="text-muted">
            © 2024 University Examination System. All rights reserved.
            <span className="mx-2">•</span>
            <a href="#privacy" className="text-muted text-decoration-none">Privacy Policy</a>
            <span className="mx-2">•</span>
            <a href="#terms" className="text-muted text-decoration-none">Terms of Service</a>
          </small>
        </div>
      </div>
    </div>
  );
}

export default RoleSelector;