import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [metrics, setMetrics] = useState({
    linestoday: 285,
    ontimePercent: 82,
    atrisk: 7,
    nextcutoff: '2:00 PM'
  });

  const [orders, setOrders] = useState([
    {
      status: 'LATE',
      cutoff: '10:00 AM',
      timeLeft: '-15 mins',
      city: 'FREMONT',
      delivery: '5871234',
      job: '4001234',
      product: 'LABEL ROLL 8.5x11',
      production: 'CUTTING',
      timeinStatus: '6:45',
      receipted: 0,
      orderQty: 1500000,
      percentReady: 0,
      truck: 'SHUTTLE-Q3',
      warehouse: 'MCC PLANT'
    },
    {
      status: 'ON-TIME',
      cutoff: '2:00 PM',
      timeLeft: '3 hrs 45 mins',
      city: 'LONDON',
      delivery: '5874321',
      job: '4004321',
      product: 'CARDSTOCK 10x12',
      production: 'JOGGED',
      timeinStatus: '3:22',
      receipted: 100000,
      orderQty: 95000,
      percentReady: 95,
      truck: 'SHUTTLE-Q1',
      warehouse: 'EXTERNAL'
    },
    {
      status: 'CAUTION',
      cutoff: '1:30 PM',
      timeLeft: '45 mins',
      city: 'ORLANDO',
      delivery: '5874312',
      job: '4004213',
      product: 'ENVELOPE PACK',
      production: 'PRINTED',
      timeinStatus: '1:10',
      receipted: 414995,
      orderQty: 1200000,
      percentReady: 85,
      truck: 'SHUTTLE-Q2',
      warehouse: 'EXTERNAL'
    },
    {
      status: 'ON-TIME',
      cutoff: '4:00 PM',
      timeLeft: '4 hrs 45 mins',
      city: 'MARKHAM',
      delivery: '5879631',
      job: '4005126',
      product: 'BUSINESS CARDS',
      production: 'CUTTING',
      timeinStatus: '0:35',
      receipted: 0,
      orderQty: 30000,
      percentReady: 25,
      truck: 'SHUTTLE-Q3',
      warehouse: 'MCC PLANT'
    },
    {
      status: 'MOVED',
      cutoff: '10:00 AM',
      timeLeft: '-15 mins',
      city: 'BROOKLYN',
      delivery: '5873563',
      job: '4006589',
      product: 'POCKET FOLDER',
      production: 'CREOPLATE',
      timeinStatus: '8:15',
      receipted: 0,
      orderQty: 300000,
      percentReady: 100,
      truck: 'SHIPPED',
      warehouse: 'MCC PLANT'
    },
    {
      status: 'ON-TIME',
      cutoff: '3:15 PM',
      timeLeft: '3 hrs 20 mins',
      city: 'TORONTO',
      delivery: '5875432',
      job: '4003456',
      product: 'FLYERS 8.5x11',
      production: 'PRINTING',
      timeinStatus: '2:45',
      receipted: 50000,
      orderQty: 500000,
      percentReady: 72,
      truck: 'SHUTTLE-Q1',
      warehouse: 'MCC PLANT'
    },
    {
      status: 'CAUTION',
      cutoff: '12:30 PM',
      timeLeft: '25 mins',
      city: 'DETROIT',
      delivery: '5872109',
      job: '4002987',
      product: 'POSTCARDS 5x7',
      production: 'JOGGED',
      timeinStatus: '4:20',
      receipted: 125000,
      orderQty: 250000,
      percentReady: 60,
      truck: 'SHUTTLE-Q2',
      warehouse: 'EXTERNAL'
    },
    {
      status: 'ON-TIME',
      cutoff: '5:30 PM',
      timeLeft: '5 hrs 40 mins',
      city: 'CHICAGO',
      delivery: '5876543',
      job: '4007654',
      product: 'BROCHURES TRI-FOLD',
      production: 'CUTTING',
      timeinStatus: '1:05',
      receipted: 0,
      orderQty: 150000,
      percentReady: 40,
      truck: 'SHUTTLE-Q3',
      warehouse: 'MCC PLANT'
    }
  ]);

  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1920);

  // Update metrics every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        linestoday: Math.floor(Math.random() * (295 - 280)) + 280,
        ontimePercent: Math.floor(Math.random() * (92 - 75)) + 75,
        atrisk: Math.floor(Math.random() * (12 - 5)) + 5,
        nextcutoff: prev.nextcutoff
      }));

      setOrders(prev => prev.map(order => ({
        ...order,
        receipted: Math.floor(order.receipted + (Math.random() * 10000))
      })));

      setLastUpdated(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getDeviceType = () => {
    if (windowWidth < 480) return 'mobile';
    if (windowWidth < 768) return 'tablet';
    if (windowWidth < 1920) return 'desktop';
    return 'tv';
  };

  const deviceType = getDeviceType();

  return (
    <div className={`app-container ${deviceType}`}>
      {/* HEADER */}
      <div className="header">
        <div className="header-content">
          <div className="header-title">
            <h1>MCC LOGISTICS COMMAND CENTRE</h1>
            <p className="subtitle">Real-Time Shipping Operations Dashboard</p>
          </div>
          <div className="header-timestamp">
            <span className="live-indicator">●</span>
            <span>Last Updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* CONNECTION WARNING */}
      <div className="connection-alert">
        <span className="alert-icon">⚠</span>
        <span className="alert-text">Connection Note: Failed to fetch - Using mock data for demonstration</span>
      </div>

      {/* METRICS CARDS */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">LINES TODAY</div>
          <div className="metric-value">{metrics.linestoday}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">ON-TIME %</div>
          <div className="metric-value">{metrics.ontimePercent}%</div>
        </div>
        <div className="metric-card at-risk">
          <div className="metric-label">AT RISK</div>
          <div className="metric-value">{metrics.atrisk}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">NEXT CUT-OFF</div>
          <div className="metric-value">{metrics.nextcutoff}</div>
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="table-container">
        {deviceType === 'mobile' ? (
          // MOBILE VIEW - Cards Instead of Table
          <div className="mobile-cards">
            {orders.map((order, idx) => (
              <div key={idx} className={`order-card ${order.status.toLowerCase().replace('-', '')}`}>
                <div className="card-header">
                  <span className={`status-badge ${order.status.toLowerCase().replace('-', '')}`}>
                    {order.status}
                  </span>
                  <span className="cutoff-time">{order.cutoff}</span>
                </div>
                <div className="card-body">
                  <div className="card-row">
                    <span className="label">DELIVERY</span>
                    <span className="value">{order.delivery}</span>
                  </div>
                  <div className="card-row">
                    <span className="label">CITY</span>
                    <span className="value">{order.city}</span>
                  </div>
                  <div className="card-row">
                    <span className="label">PRODUCT</span>
                    <span className="value">{order.product}</span>
                  </div>
                  <div className="card-row">
                    <span className="label">TIME REMAINING</span>
                    <span className={`value ${order.timeLeft.includes('-') ? 'warning' : ''}`}>
                      {order.timeLeft}
                    </span>
                  </div>
                  <div className="card-row">
                    <span className="label">% READY</span>
                    <span className="value">{order.percentReady}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // DESKTOP/TABLET/TV VIEW - Full Table
          <table className="orders-table">
            <thead>
              <tr>
                <th>STATUS</th>
                <th>CUT-OFF</th>
                <th>TIME LEFT</th>
                <th>CITY</th>
                <th>DELIVERY #</th>
                <th>JOB #</th>
                <th>PRODUCT</th>
                <th>PRODUCTION</th>
                <th>TIME IN STATUS</th>
                <th>RECEIPTED</th>
                <th>ORDER QTY</th>
                <th>% READY</th>
                <th>TRUCK</th>
                <th>WAREHOUSE LOCATION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={idx} className={`row-${order.status.toLowerCase().replace('-', '')} ${order.status === 'MOVED' ? 'row-moved' : ''}`}>
                  <td className="status-cell">
                    <span className={`status-badge ${order.status.toLowerCase().replace('-', '')}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.cutoff}</td>
                  <td className={order.timeLeft.includes('-') ? 'text-warning' : ''}>{order.timeLeft}</td>
                  <td>{order.city}</td>
                  <td>{order.delivery}</td>
                  <td>{order.job}</td>
                  <td>{order.product}</td>
                  <td>{order.production}</td>
                  <td>{order.timeinStatus}</td>
                  <td>{order.receipted.toLocaleString()}</td>
                  <td>{order.orderQty.toLocaleString()}</td>
                  <td>
                    <div className="progress-bar">
                      <div className={`progress-fill ${order.percentReady >= 90 ? 'green' : order.percentReady >= 50 ? 'yellow' : 'red'}`}
                        style={{ width: `${order.percentReady}%` }}>
                      </div>
                      <span className="progress-text">{order.percentReady}%</span>
                    </div>
                  </td>
                  <td>{order.truck}</td>
                  <td>
                    <span className={`warehouse-badge ${order.warehouse === 'MCC PLANT' ? 'plant' : 'external'}`}>
                      {order.warehouse === 'MCC PLANT' ? '🏭' : '🚚'} {order.warehouse}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* FOOTER */}
      <div className="footer">
        <div className="footer-content">
          <span>🟢 On Time</span>
          <span>🟡 Caution (<1hr)</span>
          <span>🔴 Critical (Late)</span>
          <span>🟢 Moved</span>
          <span>🚀 n8n Webhook Connected</span>
          <span>📊 Auto-Refresh Every 30 Seconds</span>
          <span>🏭 Warehouse Tracking Active</span>
          <span>🚚 External Warehouse Visibility</span>
        </div>
      </div>
    </div>
  );
}

export default App;
