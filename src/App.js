import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [metrics] = useState({
    linesToday: 285,
    ontimePercent: 82,
    atRisk: 7,
    nextCutoff: '2:00 PM'
  });

  const [orders] = useState([
    { status: 'LATE', cutoff: '10:00 AM', timeLeft: '-15 mins', city: 'FREMONT', delivery: '5871234', job: '4001234', product: 'LABEL ROLL 8.5x11', production: 'CUTTING', timeInStatus: '6:45', receipted: 0, orderQty: '1,500,000', orderStatus: 'NOT READY', truck: 'SHUTTLE-Q3', warehouse: 'MCC PLANT' },
    { status: 'ON-TIME', cutoff: '2:00 PM', timeLeft: '3 hrs 45 mins', city: 'LONDON', delivery: '5874321', job: '4004321', product: 'CARDSTOCK 10x12', production: 'JOGGED', timeInStatus: '3:22', receipted: '100,000', orderQty: '95,000', orderStatus: 'READY', truck: 'SHUTTLE-Q1', warehouse: 'EXTERNAL' },
    { status: 'CAUTION', cutoff: '1:30 PM', timeLeft: '45 mins', city: 'ORLANDO', delivery: '5874312', job: '4004213', product: 'ENVELOPE PACK', production: 'PRINTED', timeInStatus: '1:10', receipted: 0, orderQty: '1,200,000', orderStatus: 'NOT READY', truck: 'SHUTTLE-Q2', warehouse: 'EXTERNAL' },
    { status: 'ON-TIME', cutoff: '4:00 PM', timeLeft: '4 hrs 45 mins', city: 'MARKHAM', delivery: '5879631', job: '4005126', product: 'BUSINESS CARDS', production: 'CUTTING', timeInStatus: '0:35', receipted: 0, orderQty: '30,000', orderStatus: 'NOT READY', truck: 'SHUTTLE-Q3', warehouse: 'MCC PLANT' },
    { status: 'MOVED', cutoff: '10:00 AM', timeLeft: '-15 mins', city: 'BROOKLYN', delivery: '5873563', job: '4006589', product: 'POCKET FOLDER', production: 'CREOPLATE', timeInStatus: '8:15', receipted: 0, orderQty: '300,000', orderStatus: 'NOT READY', truck: 'SHIPPED', warehouse: 'MCC PLANT' },
    { status: 'ON-TIME', cutoff: '3:15 PM', timeLeft: '3 hrs 20 mins', city: 'TORONTO', delivery: '5875432', job: '4003456', product: 'FLYERS 8.5x11', production: 'PRINTING', timeInStatus: '2:45', receipted: '50,000', orderQty: '500,000', orderStatus: 'NOT READY', truck: 'SHUTTLE-Q1', warehouse: 'MCC PLANT' },
    { status: 'CAUTION', cutoff: '12:30 PM', timeLeft: '25 mins', city: 'DETROIT', delivery: '5872109', job: '4002987', product: 'POSTCARDS 5x7', production: 'JOGGED', timeInStatus: '4:20', receipted: '125,000', orderQty: '250,000', orderStatus: 'NOT READY', truck: 'SHUTTLE-Q2', warehouse: 'EXTERNAL' },
    { status: 'ON-TIME', cutoff: '5:30 PM', timeLeft: '5 hrs 40 mins', city: 'CHICAGO', delivery: '5876543', job: '4007654', product: 'BROCHURES TRI-FOLD', production: 'CUTTING', timeInStatus: '1:05', receipted: 0, orderQty: '150,000', orderStatus: 'NOT READY', truck: 'SHUTTLE-Q3', warehouse: 'MCC PLANT' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusClass = (status) => {
    if (status === 'LATE') return 'status-late';
    if (status === 'CAUTION') return 'status-caution';
    if (status === 'ON-TIME') return 'status-ontime';
    if (status === 'MOVED') return 'status-moved';
    return '';
  };

  const formatDate = () => {
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const year = String(currentDate.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
  };

  const formatTime = () => {
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const mins = String(currentDate.getMinutes()).padStart(2, '0');
    const secs = String(currentDate.getSeconds()).padStart(2, '0');
    return `${hours}:${mins}:${secs}`;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>MCC LOGISTICS COMMAND CENTRE</h1>
        <div className="header-info">
          <span className="date">📅 Date: {formatDate()} | Last Updated: {formatTime()}</span>
          <span className="status">⚠️ Connection Note: Failed to fetch - Using mock data for demonstration</span>
        </div>
      </div>

      <div className="metrics-section">
        <div className="metric-card">
          <div className="metric-label">LINES TODAY</div>
          <div className="metric-value">{metrics.linesToday}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">ON-TIME %</div>
          <div className="metric-value">{metrics.ontimePercent}%</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">AT RISK</div>
          <div className="metric-value">{metrics.atRisk}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">NEXT CUT-OFF</div>
          <div className="metric-value">{metrics.nextCutoff}</div>
        </div>
      </div>

      <div className="table-section">
        <table className="shipping-table">
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
              <th>WAREHOUSE</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx} className={getStatusClass(order.status)}>
                <td><span className="status-badge">{order.status}</span></td>
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
                <td>
                  <div className="progress-bar">
                    <div className="progress-fill green" style={{width: order.orderStatus === 'READY' ? '100%' : '45%'}}></div>
                  </div>
                  {order.orderStatus}
                </td>
                <td>{order.truck}</td>
                <td>{order.warehouse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
