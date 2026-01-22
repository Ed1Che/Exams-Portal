import { Card, Badge } from 'react-bootstrap';

const StatCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  iconBgColor, 
  iconColor,
  badge,
  badgeVariant = "primary"
}) => {
  return (
    <div style={{ height: '180px', display: 'flex' }}>
      <Card 
        className="border-0 shadow-sm w-100" 
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <Card.Body 
          className="d-flex flex-column justify-content-between p-3"
          style={{ flex: 1 }}
        >
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0 text-muted" style={{ fontSize: '0.875rem' }}>
              {title}
            </h6>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: iconBgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Icon size={20} className={iconColor} />
            </div>
          </div>
          <div>
            <h3 className="mb-1" style={{ fontSize: '1.75rem' }}>
              {value}
            </h3>
            {badge ? (
              <div className="d-flex align-items-center flex-wrap">
                <Badge bg={badgeVariant} className="me-2">{badge}</Badge>
                {description && <small className="text-muted">{description}</small>}
              </div>
            ) : (
              description && <small className="text-muted d-block">{description}</small>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default StatCard;
