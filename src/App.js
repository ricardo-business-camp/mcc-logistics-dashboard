import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  // ============ WEBHOOK URL - UPDATE THIS ============
  // Replace with your n8n Production Webhook URL
  const WEBHOOK_URL = 'https://rickie92.app.n8n.cloud/webhook/2fcdbd6-24d5-4982-babc-685ca7e7f3cb';
  // ===================================================

  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState({
    total_orders: 0,
    orders_shipped: 0,
    orders_remaining: 0,
    on_time_percentage: 0,
    at_risk_count: 0,
  });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Fetch data from webhook
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(WEBHOOK_URL);
      const data = await response.json();

      if (data && data.orders) {
        setOrders(data.orders);
        setMetrics({
          total_orders: data.total_orders || 0,
          orders_shipped: data.orders_shipped || 0,
          orders_remaining: data.orders_remaining || 0,
          on_time_percentage: data.on_time_percentage || 0,
          at_risk_count: data.at_risk_count || 0,
        });
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use mock data on error
      setOrders(MOCK_ORDERS);
      setMetrics(MOCK_METRICS);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and set up auto-refresh
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Status color function
  const getStatusClass = (status) => {
    const statusUpper = status ? status.toUpperCase() : '';
    if (statusUpper === 'LATE') return 'status-late';
    if (statusUpper === 'CAUTION') return 'status-caution';
    if (statusUpper === 'ON-TIME') return 'status-ontime';
    if (statusUpper === 'MOVED') return 'status-moved';
    return '';
  };

  // Progress bar color
  const getReadyColor = (percentage) => {
    if (percentage >= 80) return '#00cc00';
    if (percentage >= 50) return '#ffcc00';
    return '#ff3333';
  };

  // MOCK DATA (fallback)
  const MOCK_ORDERS = [
    {
      delivery_id: '5871234',
      job_id: '4001234',
      product: 'Label Sheets',
      city: 'Toronto',
      status: 'ON-TIME',
      warehouse: 'Main Plant',
      percent_ready: 85,
      next_cutoff: '2:00 PM',
      time_in_status: '2h 15m',
      carrier: 'FedEx',
      tracking: 'FX987654',
      order_quantity: 1500000,
      status_timestamp: '2026-03-27T10:45:00Z',
    },
    {
      delivery_id: '5874321',
      job_id: '4004321',
      product: 'Business Cards',
      city: 'Vancouver',
      status: 'CAUTION',
      warehouse: 'External',
      percent_ready: 45,
      next_cutoff: '4:30 PM',
      time_in_status: '45m',
      carrier: 'UPS',
      tracking: 'UP123456',
      order_quantity: 95000,
      status_timestamp: '2026-03-27T12:30:00Z',
    },
    {
      delivery_id: '5874312',
      job_id: '4004213',
      product: 'Envelopes',
      city: 'Calgary',
      status: 'LATE',
      warehouse: 'Main Plant',
      percent_ready: 92,
      next_cutoff: '1:00 PM',
      time_in_status: '3h 32m',
      carrier: 'DHL',
      tracking: 'DH456789',
      order_quantity: 500000,
      status_timestamp: '2026-03-27T13:52:00Z',
    },
    {
      delivery_id: '5879631',
      job_id: '4005126',
      product: 'Catalogs',
      city: 'Montreal',
      status: 'ON-TIME',
      warehouse: 'External',
      percent_ready: 60,
      next_cutoff: '3:00 PM',
      time_in_status: '1h 20m',
      carrier: 'Purolator',
      tracking: 'PU789012',
      order_quantity: 250000,
      status_timestamp: '2026-03-27T14:35:00Z',
    },
    {
      delivery_id: '5873563',
      job_id: '4006589',
      product: 'Brochures',
      city: 'Ottawa',
      status: 'ON-TIME',
      warehouse: 'Main Plant',
      percent_ready: 78,
      next_cutoff: '5:00 PM',
      time_in_status: '1h 45m',
      carrier: 'Canada Post',
      tracking: 'CP345678',
      order_quantity: 350000,
      status_timestamp: '2026-03-27T08:15:00Z',
    },
  ];

  const MOCK_METRICS = {
    total_orders: 5,
    orders_shipped: 2,
    orders_remaining: 3,
    on_time_percentage: 60,
    at_risk_count: 2,
  };

  const displayOrders = orders.length > 0 ? orders : MOCK_ORDERS;
  const displayMetrics = metrics.total_orders > 0 ? metrics : MOCK_METRICS;

  return (
    <div className="dashboard">
      {/* HEADER */}
      <header className="dashboard-header">
        <h1>MCC LOGISTICS COMMAND CENTRE</h1>
        <div className="header-info">
          <span className="date">
            {lastUpdated.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}
          </span>
          <span className={`status ${loading ? 'loading' : 'live'}`}>
            {loading ? '⏳ UPDATING' : '🟢 LIVE'}
          </span>
        </div>
      </header>

      {/* METRICS CARDS */}
      <section className="metrics-section">
        <div className="metric-card">
          <div className="metric-label">LINES TODAY</div>
          <div className="metric-value">{displayMetrics.total_orders}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">ON-TIME %</div>
          <div className="metric-value">{displayMetrics.on_time_percentage}%</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">AT RISK</div>
          <div className="metric-value" style={{ color: '#ff3333' }}>{displayMetrics.at_risk_count}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">NEXT CUT-OFF</div>
          <div className="metric-value">2:00 PM</div>
        </div>
      </section>

      {/* SHIPPING TABLE */}
      <section className="table-section">
        <table className="shipping-table">
          <thead>
            <tr>
              <th>JOB #</th>
              <th>DELIVERY #</th>
              <th>PRODUCT</th>
              <th>CITY</th>
              <th>STATUS</th>
              <th>WAREHOUSE</th>
              <th>% READY</th>
              <th>NEXT CUT</th>
              <th>TIME IN STATUS</th>
              <th>CARRIER</th>
              <th>TRACKING #</th>
              <th>QUANTITY</th>
              <th>TIMESTAMP</th>
              <th>LOCATION</th>
            </tr>
          </thead>
          <tbody>
            {displayOrders.map((order, index) => (
              <tr key={index} className={getStatusClass(order.status)}>
                <td>{order.job_id}</td>
                <td>{order.delivery_id}</td>
                <td>{order.product}</td>
                <td>{order.city}</td>
                <td>
                  <span className="status-badge">{order.status}</span>
                </td>
                <td>{order.warehouse}</td>
                <td>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${order.percent_ready}%`,
                        backgroundColor: getReadyColor(order.percent_ready),
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">{order.percent_ready}%</span>
                </td>
                <td>{order.next_cutoff}</td>
                <td>{order.time_in_status}</td>
                <td>{order.carrier}</td>
                <td>{order.tracking}</td>
                <td>{order.order_quantity.toLocaleString()}</td>
                <td>{new Date(order.status_timestamp).toLocaleString()}</td>
                <td>
                  {order.warehouse === 'Main Plant' ? '🏭' : '🚚'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default App;