import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

// Color palette for charts
const CHART_COLORS = {
  primary: '#0066cc',
  success: '#198754',
  warning: '#ffc107',
  danger: '#dc3545',
  info: '#0dcaf0',
  secondary: '#6c757d',
  gradient: ['#0066cc', '#3399ff', '#66b3ff']
};

// GPA Trend Line Chart
export const GPATrendChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
        <XAxis dataKey="semester" stroke="#6c757d" />
        <YAxis domain={[0, 4.0]} stroke="#6c757d" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        />
        <Area 
          type="monotone" 
          dataKey="gpa" 
          stroke={CHART_COLORS.primary} 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorGpa)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Grade Distribution Bar Chart
export const GradeDistributionChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
        <XAxis dataKey="grade" stroke="#6c757d" />
        <YAxis stroke="#6c757d" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        />
        <Bar dataKey="count" fill={CHART_COLORS.primary} radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Submission Trend Chart
export const SubmissionTrendChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
        <XAxis dataKey="month" stroke="#6c757d" />
        <YAxis stroke="#6c757d" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="submitted" 
          stroke={CHART_COLORS.primary} 
          strokeWidth={3}
          dot={{ r: 6 }}
          name="Submitted"
        />
        <Line 
          type="monotone" 
          dataKey="approved" 
          stroke={CHART_COLORS.success} 
          strokeWidth={3}
          dot={{ r: 6 }}
          name="Approved"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Course Performance Chart
export const CoursePerformanceChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 100, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
        <XAxis type="number" domain={[0, 100]} stroke="#6c757d" />
        <YAxis dataKey="course" type="category" stroke="#6c757d" width={80} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        />
        <Bar dataKey="average" fill={CHART_COLORS.info} radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Status Distribution Pie Chart
export const StatusPieChart = ({ data }) => {
  const COLORS = [CHART_COLORS.success, CHART_COLORS.warning, CHART_COLORS.danger, CHART_COLORS.secondary];
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Approval Metrics Chart
export const ApprovalMetricsChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
        <XAxis dataKey="week" stroke="#6c757d" />
        <YAxis stroke="#6c757d" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        />
        <Legend />
        <Bar dataKey="approved" stackId="a" fill={CHART_COLORS.success} radius={[0, 0, 0, 0]} />
        <Bar dataKey="pending" stackId="a" fill={CHART_COLORS.warning} radius={[0, 0, 0, 0]} />
        <Bar dataKey="rejected" stackId="a" fill={CHART_COLORS.danger} radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
