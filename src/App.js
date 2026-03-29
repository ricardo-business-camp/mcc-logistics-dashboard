import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State for real-time data
  const [activeShipments, setActiveShipments] = useState(0);
  const [deliveredToday, setDeliveredToday] = useState(0);
  const [inventoryLevel, setInventoryLevel] = useState(0);
  const [avgDeliveryTime, setAvgDeliveryTime] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);

  // Simulate real-time data updates
  useEffect(() => {
    // Initial data
    setActiveShipments(23);
    setDeliveredToday(47);
    setInventoryLevel(1250);
    setAvgDeliveryTime(2.3);
    setRecentActivity([
      { id: 1, type: 'Shipment Sent', detail: 'Order #MCC-2847 → Toronto', time: '2 mins ago' },
      { id: 2, type: 'Delivery Completed', detail: 'Order #MCC-2846 delivered to GTA', time: '15 mins ago' },
      { id: 3, type: 'Inventory Alert', detail: 'SKU-4521 below reorder point', time: '32 mins ago' },
      { id: 4, type: 'Shipment Sent', detail: 'Order #MCC-2845 → Ottawa', time: '1 hour ago' },
      { id: 5, type: 'Delivery Completed', detail: 'Order #MCC-2844 delivered to Windsor', time: '2 hours ago' },
    ]);

    // Simulate real-time updates every 5 seconds
    const interval = setInterval(() => {
      setActiveShipments(prev => Math.max(15, prev + Math.floor(Math.random() * 5) - 2));
      setDeliveredToday(prev => prev + Math.floor(Math.random() * 3));
      setInventoryLevel(prev => Math.max(500, prev + Math.floor(Math.random() * 20) - 10));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>🚚 MCC Logistics Dashboard</h1>
          <p>Real-time monitoring for your supply chain</p>
        </div>
        <div className="header-time">
          {new Date().toLocaleTimeString()}
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="dashboard">
        {/* Key Metrics Section */}
        <section className="metrics-grid">
          {/* Active Shipments Card */}
          <div className="metric-card">
            <div className="metric-header">
              <h3>📦 Active Shipments</h3>
              <span className="metric-icon">→</span>
            </div>
            <div className="metric-value">{activeShipments}</div>
            <p className="metric-label">in transit right now</p>
          </div>

          {/* Delivered Today Card */}
          <div className="metric-card">
            <div className="metric-header">
              <h3>✅ Delivered Today</h3>
              <span className="metric-icon">✓</span>
            </div>
            <div className="metric-value">{deliveredToday}</div>
            <p className="metric-label">orders completed</p>
          </div>

          {/* Inventory Level Card */}
          <div className="metric-card">
            <div className="metric-header">
              <h3>📊 Inventory Level</h3>
              <span className="metric-icon">📦</span>
            </div>
            <div className="metric-value">{inventoryLevel}</div>
            <p className="metric-label">units in stock</p>
          </div>

          {/* Avg Delivery Time Card */}
          <div className="metric-card">
            <div className="metric-header">
              <h3>⏱️ Avg Delivery Time</h3>
              <span className="metric-icon">⏱️</span>
            </div>
            <div className="metric-value">{avgDeliveryTime}</div>
            <p className="metric-label">days (Ontario avg)</p>
          </div>
        </section>

        {/* Recent Activity Section */}
        <section className="activity-section">
          <h2>📋 Recent Activity Log</h2>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-type">
                  <span className={`badge badge-${activity.type.toLowerCase().replace(/\s+/g, '-')}`}>
                    {activity.type}
                  </span>
                </div>
                <div className="activity-detail">
                  <p className="activity-text">{activity.detail}</p>
                  <p className="activity-time">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Status Footer */}
        <section className="status-footer">
          <div className="status-item">
            <span className="status-dot online"></span>
            <span>System Online</span>
          </div>
          <div className="status-item">
            <span className="status-dot">🌍</span>
            <span>All Regions Connected</span>
          </div>
          <div className="status-item">
            <span className="status-dot">⚡</span>
            <span>Real-time Sync Active</span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
