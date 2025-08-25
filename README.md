# SCEROS - Smart Campus Energy & Resource Optimization System

A comprehensive web-based campus resource management system for monitoring and optimizing electricity, water, and HVAC usage across campus facilities.

## 🚀 Features

### 🔐 Role-Based Access Control
- **Students & Faculty**: View assigned areas, monitor usage, receive alerts and recommendations
- **Facility Managers**: Campus-wide monitoring, alert management, trend analysis
- **Administrators**: User management, threshold configuration, system audit logs

### 📊 Real-Time Monitoring
- Live resource usage tracking (Electricity, Water, HVAC)
- Interactive charts and analytics using Recharts
- Historical data visualization and trend analysis
- Customizable thresholds and alert systems

### 🎯 Smart Recommendations
- AI-powered energy optimization suggestions
- Priority-based implementation recommendations
- Cost-benefit analysis for energy-saving measures
- Progress tracking for implemented solutions

### 📱 Responsive Design
- Mobile-first responsive design
- Modern UI with TailwindCSS and ShadCN components
- Smooth animations using Framer Motion
- Cross-browser compatibility

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TailwindCSS** - Utility-first CSS framework
- **Recharts** - Composable charting library
- **Framer Motion** - Production-ready motion library
- **Lucide React** - Beautiful & consistent icon toolkit

### Development Tools
- **Vite** - Fast build tool and dev server
- **PostCSS** - CSS processing
- **ESLint** - Code quality and consistency

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation with role-based menus
│   ├── Card.jsx        # Resource cards and area cards
│   ├── Chart.jsx       # Chart components (Line, Bar, Area, Pie)
│   └── Table.jsx       # Data table with sorting/filtering
├── pages/              # Main application pages
│   ├── Login.jsx       # Authentication page
│   ├── StudentDashboard.jsx    # Student/Faculty dashboard
│   ├── FacilityDashboard.jsx   # Facility manager dashboard
│   └── AdminDashboard.jsx      # Administrative dashboard
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication and user management
├── data/               # Mock data (JSON files)
│   ├── areas.json      # Campus areas and current usage
│   ├── alerts.json     # System alerts and notifications
│   ├── recommendations.json # Energy optimization suggestions
│   ├── users.json      # User accounts and roles
│   └── usage.json      # Historical usage data
├── utils/              # Utility functions
│   └── cn.js          # CSS class name utility
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MohammedChallawala/SCEROS
   cd sceros
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 🔑 Demo Credentials

Use these demo accounts to explore different user roles:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@campus.edu` | `password123` |
| **Facility Manager** | `mike.wilson@campus.edu` | `password123` |
| **Student** | `john.smith@campus.edu` | `password123` |
| **Faculty** | `sarah.johnson@campus.edu` | `password123` |

## 📊 Dashboard Features

### Student/Faculty Dashboard
- View assigned campus areas
- Monitor real-time resource usage
- Track usage trends over time
- Receive alerts and recommendations
- Quick stats and area overview

### Facility Manager Dashboard
- Campus-wide resource monitoring
- Comprehensive alert management
- Usage trend analysis and forecasting
- Area comparison charts
- Energy optimization recommendations

### Admin Dashboard
- **Overview Tab**: System metrics and resource distribution
- **User Management**: Add, edit, delete users and assign roles
- **Thresholds**: Configure usage limits for each area
- **Audit Logs**: Track system activities and user actions

## 🎨 UI Components

### Cards
- **ResourceCard**: Display resource usage with icons and trends
- **AreaCard**: Show area information and current usage
- **MetricChart**: Simple metric display with trend indicators

### Charts
- **UsageLineChart**: Line charts for usage trends over time
- **AreaComparisonChart**: Bar charts comparing areas
- **CumulativeUsageChart**: Stacked area charts
- **ResourceDistributionChart**: Pie charts for resource breakdown

### Tables
- Sortable and filterable data tables
- Search functionality
- Pagination support
- Action buttons for row operations
- Custom column renderers

## 🔧 Customization

### Adding New Resource Types
1. Update mock data files
2. Add new icons to components
3. Extend chart configurations
4. Update status calculations

### Modifying User Roles
1. Update `AuthContext.jsx`
2. Modify navigation logic
3. Adjust dashboard access controls
4. Update mock user data

### Styling Changes
- Modify `tailwind.config.js` for custom colors
- Update `src/index.css` for component styles
- Use utility classes from TailwindCSS

## 🚧 Future Enhancements

### Backend Integration
- Replace mock JSON with real API endpoints
- Implement JWT authentication
- Add real-time WebSocket connections
- Database integration (MySQL/PostgreSQL)

### Advanced Features
- ML-powered usage forecasting
- Predictive maintenance alerts
- Energy cost optimization
- Mobile app development
- IoT sensor integration

### Analytics & Reporting
- Advanced data visualization
- Custom report generation
- Export functionality (PDF, Excel)
- Scheduled reports and notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TailwindCSS** for the utility-first CSS framework
- **Recharts** for the excellent charting library
- **Framer Motion** for smooth animations
- **Lucide** for the beautiful icon set

---

**SCEROS** - Empowering campuses with intelligent energy management solutions. 