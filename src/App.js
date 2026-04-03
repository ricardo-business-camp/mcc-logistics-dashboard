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

  const productionStatuses = ['CUTTING', 'JOGGED', 'PRINTING', 'Creoplateing', 'PRINTING', 'Die-cutting', 'Reconciling'];

  const getRandomProduction = () => {
    return productionStatuses[Math.floor(Math.random() * productionStatuses.length)];
  };

  const [orders, setOrders] = useState([
    { status: 'LATE', cutoff: '10:00 AM', timeLeft: '-15 mins', city: 'FREMONT', delivery: '5871234', job: '4001234', product: 'LABEL ROLL 8.5x11', production: 'CUTTING', timeInStatus: '6:45', receipted: 0, orderQty: '1,500,000', jobStart: '04/01/26 8:30 AM', jobFinish: '04/02/26 2:45 PM', dueDate: '04/02/26 10:00 AM', customer: 'Acme Corp', readyPercent: 45, truck: 'SHUTTLE-Q3', warehouse: 'MCC PLANT' },
    { status: 'ON-TIME', cutoff: '2:00 PM', timeLeft: '3 hrs 45 mins', city: 'LONDON', delivery: '5874321', job: '4004321', product: 'CARDSTOCK 10x12', production: 'JOGGED', timeInStatus: '3:22', receipted: '100,000', orderQty: '95,000', jobStart: '03/31/26 10:15 AM', jobFinish: '04/02/26 1:20 PM', dueDate: '04/02/26 2:00 PM', customer: 'PrintCo Inc', readyPercent: 100, truck: 'SHUTTLE-Q1', warehouse: 'EXTERNAL' },
    { status: 'CAUTION', cutoff: '1:30 PM', timeLeft: '45 mins', city: 'ORLANDO', delivery: '5874312', job: '4004213', product: 'ENVELOPE PACK', production: 'PRINTING', timeInStatus: '1:10', receipted: 0, orderQty: '1,200,000', jobStart: '04/01/26 9:45 AM', jobFinish: '04/02/26 12:30 PM', dueDate: '04/02/26 1:30 PM', customer: 'Global Solutions', readyPercent: 75, truck: 'SHUTTLE-Q2', warehouse: 'EXTERNAL' },
    { status: 'ON-TIME', cutoff: '4:00 PM', timeLeft: '4 hrs 45 mins', city: 'MARKHAM', delivery: '5879631', job: '4005126', product: 'BUSINESS CARDS', production: 'CUTTING', timeInStatus: '0:35', receipted: 0, orderQty: '30,000', jobStart: '04/02/26 7:00 AM', jobFinish: '04/02/26 11:45 AM', dueDate: '04/02/26 4:00 PM', customer: 'NextGen Services', readyPercent: 100, truck: 'SHUTTLE-Q3', warehouse: 'MCC PLANT' },
    { status: 'MOVED', cutoff: '10:00 AM', timeLeft: '-15 mins', city: 'BROOKLYN', delivery: '5873563', job: '4006589', product: 'POCKET FOLDER', production: 'Creoplateing', timeInStatus: '8:15', receipted: 0, orderQty: '300,000', jobStart: '03/30/26 2:00 PM', jobFinish: '04/01/26 4:30 PM', dueDate: '04/01/26 10:00 AM', customer: 'Elite Brands', readyPercent: 100, truck: 'SHIPPED', warehouse: 'MCC PLANT' },
    { status: 'ON-TIME', cutoff: '3:15 PM', timeLeft: '3 hrs 20 mins', city: 'TORONTO', delivery: '5875432', job: '4003456', product: 'FLYERS 8.5x11', production: 'PRINTING', timeInStatus: '2:45', receipted: '50,000', orderQty: '500,000', jobStart: '03/31/26 11:30 AM', jobFinish: '04/02/26 10:20 AM', dueDate: '04/02/26 3:15 PM', customer: 'Marketing Plus', readyPercent: 100, truck: 'SHUTTLE-Q1', warehouse: 'MCC PLANT' },
    { status: 'CAUTION', cutoff: '12:30 PM', timeLeft: '25 mins', city: 'DETROIT', delivery: '5872109', job: '4002987', product: 'POSTCARDS 5x7', production: 'JOGGED', timeInStatus: '4:20', receipted: '125,000', orderQty: '250,000', jobStart: '04/01/26 1:00 PM', jobFinish: '04/02/26 11:50 AM', dueDate: '04/02/26 12:30 PM', customer: 'Direct Mail Ltd', readyPercent: 60, truck: 'SHUTTLE-Q2', warehouse: 'EXTERNAL' },
    { status: 'ON-TIME', cutoff: '5:30 PM', timeLeft: '5 hrs 40 mins', city: 'CHICAGO', delivery: '5876543', job: '4007654', product: 'BROCHURES TRI-FOLD', production: 'Die-cutting', timeInStatus: '1:05', receipted: 0, orderQty: '150,000', jobStart: '04/02/26 6:45 AM', jobFinish: '04/02/26 9:15 AM', dueDate: '04/02/26 5:30 PM', customer: 'ProPrint Group', readyPercent: 85, truck: 'SHUTTLE-Q3', warehouse: 'MCC PLANT' }
  ]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update metrics every 30 seconds
  useEffect(() => {
    const refreshTimer = setInterval(() => {
      setMetrics(prev => ({
        linesToday: Math.floor(Math.random() * 50) + 260,
        ontimePercent: Math.floor(Math.random() * 20) + 75,
        atRisk: Math.floor(Math.random() * 10) + 2,
        nextCutoff: '2:00 PM'
      }));
    }, 30000);
    return () => clearInterval(refreshTimer);
  }, []);

  // REFRESH THE TABLE DATA EVERY 30 SECONDS (includes production status)
  useEffect(() => {
    const tableRefreshTimer = setInterval(() => {
      setOrders(prevOrders => 
        prevOrders.map(order => ({
          ...order,
          readyPercent: Math.floor(Math.random() * 100) + 1,
          production: getRandomProduction()
        }))
      );
    }, 30000);
    return () => clearInterval(tableRefreshTimer);
  }, []);

  const getStatusClass = (status) => {
    if (status === 'LATE') return 'status-late';
    if (status === 'CAUTION') return 'status-caution';
    if (status === 'ON-TIME') return 'status-ontime';
    if (status === 'MOVED') return 'status-moved';
    return '';
  };

  const getReadyColor = (status) => {
    if (status === 'LATE') return 'ready-late';
    if (status === 'CAUTION') return 'ready-caution';
    if (status === 'ON-TIME') return 'ready-ontime';
    if (status === 'MOVED') return 'ready-moved';
    return 'ready-ontime';
  };

  const dateStr = String(time.getMonth() + 1).padStart(2, '0') + '/' + String(time.getDate()).padStart(2, '0') + '/' + String(time.getFullYear()).slice(-2);
  const timeStr = String(time.getHours()).padStart(2, '0') + ':' + String(time.getMinutes()).padStart(2, '0') + ':' + String(time.getSeconds()).padStart(2, '0');

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>MCC LOGISTICS COMMAND CENTRE</h1>
        <div className="header-info">
          <span className="date">Date: {dateStr} | Time: {timeStr}</span>
          <span className="status">Connection Note: Using mock data</span>
        </div>
      </div>

      <div className="metrics-section">
        <div className="metric-card">
          <div className="metric-label">LINES TODAY</div>
          <div className="metric-value">{metrics.linesToday}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">ON-TIME %</div>
          <div className="metric-value metric-green">{metrics.ontimePercent}%</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">AT RISK</div>
          <div className="metric-value metric-red">{metrics.atRisk}</div>
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
              <th>DELIVERY</th>
              <th>JOB</th>
              <th>PRODUCT</th>
              <th>PRODUCTION</th>
              <th>TIME</th>
              <th>RECEIPTED</th>
              <th>ORDER QTY</th>
              <th>JOB START</th>
              <th>JOB FINISH</th>
              <th>DUE DATE</th>
              <th>CUSTOMER</th>
              <th>READY</th>
              <th>TRUCK</th>
              <th>WAREHOUSE</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(function(order, idx) {
              return (
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
                  <td>{order.jobStart}</td>
                  <td>{order.jobFinish}</td>
                  <td>{order.dueDate}</td>
                  <td>{order.customer}</td>
                  <td><div className={`ready-block ${getReadyColor(order.status)}`}></div></td>
                  <td>{order.truck}</td>
                  <td>{order.warehouse}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="dashboard-footer">
        <div className="footer-status">
          <span className="status-item status-ontime">✓ On Time</span>
          <span className="status-item status-caution">⚠ Caution (1hr)</span>
          <span className="status-item status-critical">🔴 Critical (Late)</span>
          <span className="status-item status-moved">↻ Moved</span>
          <span className="status-item status-webhook">🔗 n8n Webhook Connected</span>
          <span className="status-item status-warehouse">🏭 Warehouse Tracking Active</span>
          <span className="status-item status-refresh">🔄 Auto-Refresh Every 30 Seconds</span>
          <span className="status-item status-external">🚚 External Warehouse Visibility</span>
        </div>
      </div>
    </div>
  );
}

export default App;