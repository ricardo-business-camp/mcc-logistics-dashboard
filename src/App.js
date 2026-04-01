import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [time, setTime] = useState(new Date());
  const [metrics, setMetrics] = useState({
    linesToday: 285,
    ontimePercent: 82,
    atRisk: 7,
    nextCutoff: '2:00 PM'
  });

  const [orders, setOrders] = useState([
    {
      id: 1,
      status: 'LATE',
      cutoff: '10:00 AM',
      timeLeft: '-15 mins',
      city: 'FREMONT',
      delivery: '5871234',
      job: '4001234',
      product: 'LABEL ROLL 8.5x11',
      production: '85%',
      timeInStatus: '2h 30m',
      receipted: '0',
      orderQty: '1,500,000',
      readyPercent: '45%',
      truck: 'SHUTTLE-Q3',
      warehouse: 'MCC PLANT'
    },
    {
      id: 2,
      status: 'ON-TIME',
      cutoff: '2:00 PM',
      timeLeft: '3 hrs 45 mins',
      city: 'LONDON',
      delivery: '5874321',
      job: '4004321',
      product: 'CARDS 10x12',
      production: '100%',
      timeInStatus: '1h 15m',
      receipted: '100,000',
      orderQty: '95,000',
      readyPercent: '100%',
      truck: 'SHUTTLE-Q1',
      warehouse: 'EXTERNAL'
    },
    {
      id: 3,
      status: 'CAUTION',
      cutoff: '1:30 PM',
      timeLeft: '45 mins',
      city: 'ORLANDO',
      delivery: '5874312',
      job: '4004213',
      product: 'ENVELOPES PACK',
      production: '95%',
      timeInStatus: '3h 20m',
      receipted: '0',
      orderQty: '1,200,000',
      readyPercent: '75%',
      truck: 'SHUTTLE-Q2',
      warehouse: 'EXTERNAL'
    },
    {
      id: 4,
      status: 'ON-TIME',
      cutoff: '4:00 PM',
      timeLeft: '4 hrs 45 mins',
      city: 'MARKHAM',
      delivery: '5879631',
      job: '4005126',
      product: 'BUSINESS CARDS',
      production: '100%',
      timeInStatus: '45m',
      receipted: '0',
      orderQty: '30,000',
      readyPercent: '100%',
      truck: 'SHUTTLE-Q3',
      warehouse: 'MCC PLANT'
    },
    {
      id: 5,
      status: 'MOVED',
      cutoff: '10:00 AM',
      timeLeft: '-15 mins',
      city: 'BROOKLYN',
      delivery: '5873563',
      job: '4006589',
      product: 'POCKET FOLDER',
      production: '100%',
      timeInStatus: '4h 50m',
      receipted: '0',
      orderQty: '300,000',
      readyPercent: '100%',
      truck: 'SHIPPED',
      warehouse: 'MCC PLANT'
    },
    {
      id: 6,
      status: 'ON-TIME',
      cutoff: '3:15 PM',
      timeLeft: '3 hrs 20 mins',
      city: 'TORONTO',
      delivery: '5875432',
      job: '4003456',
      product: 'FLYERS 8.5x11',
      production: '100%',
      timeInStatus: '1h 40m',
      receipted: '50,000',
      orderQty: '500,000',
      readyPercent: '100%',
      truck: 'SHUTTLE-Q1',
      warehouse: 'MCC PLANT'
    },
    {
      id: 7,
      status: 'CAUTION',
      cutoff: '12:30 PM',
      timeLeft: '25 mins',
      city: 'DETROIT',
      delivery: '5872109',
      job: '4002987',
      product: 'POSTCARDS 5x7',
      production: '92%',
      timeInStatus: '2h 15m',
      receipted: '125,000',
      orderQty: '250,000',
      readyPercent: '60%',
      truck: 'SHUTTLE-Q2',
      warehouse: 'EXTERNAL'
    },
    {
      id: 8,
      status: 'ON-TIME',
      cutoff: '5:30 PM',
      timeLeft: '5 hrs 40 mins',
      city: 'CHICAGO',
      delivery: '5876543',
      job: '4007654',
      product: 'BROCHURE TRI-FOLD',
      production: '88%',
      timeInStatus: '30m',
      receipted: '0',
      orderQty: '150,000',
      readyPercent: '85%',
      truck: 'SHUTTLE-Q3',
      warehouse: 'MCC PLANT'
    }
  ]);

  // Update time every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  // Fetch and update ALL metrics every 30 seconds
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('https://rickie92.app.n8n.cloud/webhook/2fcdbd6-24d5-4982-babc-685ca7e7f3cb');
        const data = await response.json();

        if (data && data.metrics) {
          setMetrics({
            linesToday: data.metrics.linesToday || 285,
            ontimePercent: data.metrics.ontimePercent || 82,
            atRisk: data.metrics.atRisk || 7,
            nextCutoff: data.metrics.nextCutoff || '2:00 PM'
          });
        }

        if (data && data.orders) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.log('Using mock data - n8n webhook connection pending');
      }
    };

    // Fetch immediately on load
    fetchMetrics();

    // Set interval for every 30 seconds
    const metricsInterval = setInterval(fetchMetrics, 30000);

    return () => clearInterval(metricsInterval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'LATE':
        return 'status-late';
      case 'CAUTION':
        return 'status-caution';
      case 'ON-TIME':
        return 'status-on-time';
      case 'MOVED':
        return 'status-moved';
      default:
        return '';
    }
  };

  const getReadyPercentColor = (readyPercent) => {
    const percent = parseInt(readyPercent);
    if (percent === 100) return 'ready-full';
    if (percent >= 75) return 'ready-high';
    if (percent >= 50) return 'ready-medium';
    return 'ready-low';
  };

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <h1>MCC LOGISTICS COMMAND CENTRE</h1>
          <div className="header-info">
            <span>Date: {formatDate(time)} | Time: {formatTime(time)}</span>
            <span className="connection-note">Connection Note: Using mock data</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card metric-green">
          <div className="metric-label">LINES TODAY</div>
          <div className="metric-value">{metrics.linesToday}</div>
        </div>

        <div className="metric-card metric-green">
          <div className="metric-label">ON-TIME %</div>
          <div className="metric-value">{metrics.ontimePercent}%</div>
        </div>

        <div className="metric-card metric-red">
          <div className="metric-label">AT RISK</div>
          <div className="metric-value">{metrics.atRisk}</div>
        </div>

        <div className="metric-card metric-green">
          <div className="metric-label">NEXT CUT-OFF</div>
          <div className="metric-value">{metrics.nextCutoff}</div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>STATUS</th>
              <th>CUT-OFF</th>
              <th>TIME LEFT</th>
              <th>CITY</th>
              <th>DELIVERY</th>
              <th>JOB</th>
              <th>PRODUCT</th>
              <th>PRODUCTION</th>
              <th>TIME IN STATUS</th>
              <th>RECEIPTED</th>
              <th>ORDER QTY</th>
              <th>READY</th>
              <th>TRUCK</th>
              <th>WAREHOUSE</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className={getStatusClass(order.status)}>
                <td className="status-cell">
                  <span className="status-badge">{order.status}</span>
                </td>
                <td>{order.cutoff}</td>
                <td>{order.timeLeft}</td>
                <td>{order.city}</td>
                <td>{order.delivery}</td>
                <td>{order.job}</td>
                <td>{order.product}</td>
                <td>{order.production}</td>
                <td>{order.timeInStatus}</td>
                <td>{order.receipted}</td>
                <td>{order.orderQty}</td>
                <td className={`ready-cell ${getReadyPercentColor(order.readyPercent)}`}>
                  {order.readyPercent}
                </td>
                <td>{order.truck}</td>
                <td>{order.warehouse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status Bar Footer */}
      <div className="status-bar">
        <div className="status-bar-content">
          <div className="status-item status-on-time">
            <span>✓ On Time</span>
          </div>
          <div className="status-item status-caution">
            <span>! Caution</span>
          </div>
          <div className="status-item status-late">
            <span>🔴 Critical (Late)</span>
          </div>
          <div className="status-item status-moved">
            <span>↻ Moved</span>
          </div>
          <div className="status-item status-webhook">
            <span>🔗 n8n Webhook Connected</span>
          </div>
          <div className="status-item status-warehouse">
            <span>🏭 Warehouse Tracking Active</span>
          </div>
          <div className="status-item status-refresh">
            <span>🔄 Auto-Refresh Every 30 Seconds</span>
          </div>
          <div className="status-item status-external">
            <span>🚚 External Warehouse Visibility</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
