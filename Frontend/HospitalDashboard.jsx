import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import DualNavbar from "../components/layout";
import { FaUsers, FaFileAlt, FaUserMd, FaClock } from "react-icons/fa";
import { FiActivity, FiUsers, FiFileText, FiSettings, FiTrendingUp } from 'react-icons/fi';

const HospitalDashboard = () => {
  const { hospitalName } = useParams(); // Get hospital name from URL
  const [hospitalInfo, setHospitalInfo] = useState({});
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeTreatments: 0,
    pendingReports: 0
  });
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get current hospital info from localStorage
    const user = JSON.parse(localStorage.getItem('user') || localStorage.getItem('userInfo') || '{}');
    
    if (user && user.hospitalName) {
      setHospitalInfo(user);
      
      // If there's no hospitalName in URL but we have the info, redirect to the proper URL
      if (!hospitalName && user.hospitalName && window.location.pathname === '/hospitaldashboard') {
        // Create URL-friendly hospital name
        const urlFriendlyName = user.hospitalName
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')  // Remove special characters
          .replace(/\s+/g, '-');     // Replace spaces with dashes
          
        navigate(`/hospitaldashboard/${urlFriendlyName}`, { replace: true });
      }
      
      // Only fetch stats if the hospital is approved
      if (user.status === 'approved') {
        // Fetch real statistics
        axios.get(`http://localhost:5555/api/treatment/stats/${user.hospitalId}`)
          .then(response => {
            setStats({
              totalPatients: response.data.totalPatients || 0,
              activeTreatments: response.data.activeTreatments || 0,
              pendingReports: response.data.pendingReports || 0
            });
          })
          .catch(error => {
            console.error("Error fetching statistics:", error);
            // Set default values if error occurs
            setStats({
              totalPatients: 0,
              activeTreatments: 0,
              pendingReports: 0
            });
          });
      }
    } else {
      // If no user info is found, redirect to login
      navigate('/admin');
    }
  }, [hospitalName, navigate]);
  
  // Render pending status view
  const renderPendingView = () => {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex items-center justify-center mb-6">
            <FaClock className="text-yellow-500 text-4xl mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">
              Your Hospital Registration is Pending Approval
            </h2>
          </div>
          
          <p className="text-gray-600 text-center mb-6">
            Your registration is currently under review by our administrators. 
            Once approved, you'll have access to all dashboard features.
          </p>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-500">HOSPITAL ID</p>
                <p className="text-lg font-medium">{hospitalInfo.hospitalId || "N/A"}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-500">EMAIL</p>
                <p className="text-lg font-medium">{hospitalInfo.email || "N/A"}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-500">STATUS</p>
                <p className="text-lg font-medium">
                  <span className="inline-block px-2 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render approved status view (full dashboard)
  const renderApprovedView = () => {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-green-600 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {hospitalInfo.hospitalName}
          </h2>
          <p className="text-blue-100">Here's what's happening with your hospital today</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <StatsCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<FiUsers className="w-6 h-6" />}
            trend="+5% from last month"
            color="blue"
          />
          <StatsCard
            title="Active Treatments"
            value={stats.activeTreatments}
            icon={<FiActivity className="w-6 h-6" />}
            trend="Currently ongoing"
            color="green"
          />
          <StatsCard
            title="Pending Reports"
            value={stats.pendingReports}
            icon={<FiFileText className="w-6 h-6" />}
            trend="Needs attention"
            color="yellow"
          />
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <QuickActionCard
            title="Add Treatment"
            description="Record new patient treatment"
            icon={<FiFileText />}
            onClick={() => navigate(`/${hospitalInfo.hospitalName}/h-patientdetails`)}
          />
          <QuickActionCard
            title="View Reports"
            description="Access treatment reports"
            icon={<FiTrendingUp />}
           
          />
          <QuickActionCard
            title="Patient Records"
            description="Manage patient information"
            icon={<FiUsers />}
          />
          <QuickActionCard
            title="Settings"
            description="Update hospital profile"
            icon={<FiSettings />}
            onClick={() => navigate(`/hospital-view/${hospitalInfo.hospitalId}`)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <DualNavbar />
      
      {/* Conditional rendering based on hospital status */}
      {hospitalInfo.status === 'pending' ? renderPendingView() : renderApprovedView()}
    </div>
  );
};

const StatsCard = ({ title, value, icon, trend, color }) => {
  const colorStyles = {
    blue: {
      background: "bg-gradient-to-r from-blue-500/10 to-blue-50",
      icon: "bg-blue-500",
      text: "text-blue-700",
      border: "border-blue-100"
    },
    green: {
      background: "bg-gradient-to-r from-green-500/10 to-green-50",
      icon: "bg-green-500",
      text: "text-green-700",
      border: "border-green-100"
    },
    yellow: {
      background: "bg-gradient-to-r from-yellow-500/10 to-yellow-50",
      icon: "bg-yellow-500",
      text: "text-yellow-700",
      border: "border-yellow-100"
    }
  };

  const style = colorStyles[color];

  return (
    <div className={`${style.background} rounded-xl border ${style.border} p-6 hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${style.icon} text-white`}>
          {icon}
        </div>
        <span className={`text-sm ${style.text} bg-white px-3 py-1 rounded-full shadow-sm`}>
          {trend}
        </span>
      </div>
      <h3 className={`text-lg font-semibold ${style.text} mb-2`}>{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

const QuickActionCard = ({ title, description, icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 text-left w-full group"
    >
      <div className="flex items-center space-x-4">
        <div className="p-3 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </button>
  );
};

export default HospitalDashboard;