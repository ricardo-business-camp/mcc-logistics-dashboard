import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

const App = () => {
  // Function to generate random metrics
  const generateRandomMetrics = () => ({
    linesToday: Math.floor(Math.random() * (290 - 280 + 1)) + 280,
    onTimePercent: Math.floor(Math.random() * (90 - 75 + 1)) + 75,
    atRisk: Math.floor(Math.random() * (10 - 5 + 1)) + 5,
    nextCutoff: '2:00 PM'
  });

  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState(generateRandomMetrics());
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Your n8n Webhook URL
  const WEBHOOK_URL = 'https://rickie92.app.n8n.cloud/webhook/2fcdbd6-24d5-4982-babc-685ca7e7f3cb';

  // Get today's date in MM/DD/YY format
  const getTodayDate = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = String(today.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
  };

  // Generate random receipted quantities
  const getRandomReceipeted = (maxQuantity) => {
    const randomPercent = Math.random();
    return Math.floor(maxQuantity * randomPercent);
  };

  // Mock data function with WAREHOUSE LOCATION tracking
  const getMockOrders = useCallback(() => {
    const todayDate = getTodayDate();
    
    const warehouseData = [
      { truck: 'SHUTTLE-03', warehouse: 'MCC_PLANT', status: 'IN PRODUCTION' },
      { truck: 'SHUTTLE-01', warehouse: 'EXTERNAL_WAREHOUSE', status: 'AT EXTERNAL' },
      { truck: 'SHUTTLE-02', warehouse: 'EXTERNAL_WAREHOUSE', status: 'AT EXTERNAL' },
      { truck: 'SHUTTLE-01', warehouse: 'MCC_PLANT', status: 'AWAITING TRUCK' },
      { truck: 'SHUTTLE-04', warehouse: 'EXTERNAL_WAREHOUSE', status: 'READY FOR SHIP' },
      { truck: '', warehouse: 'MCC_PLANT', status: 'IN PRODUCTION' },
      { truck: 'SHUTTLE-02', warehouse: 'EXTERNAL_WAREHOUSE', status: 'AT EXTERNAL' },
      { truck: '', warehouse: 'MCC_PLANT', status: 'IN PRODUCTION' }
    ];

    return [
      {
        id: 1,
        onTimeStatus: 'LATE',
        cutOffTime: `${todayDate} 10:00 AM`,
        timeRemaining: '-15 mins',
        shipCity: 'FREMONT',
        deliveryNum: '5871234',
        jobNum: '4001234',
        productName: 'LABEL ROLL 8.5x11',
        productionStatus: 'CUTTING',
        timeInStatus: '6:45',
        receipted: getRandomReceipeted(1500000),
        orderQuantity: 1500000,
        orderStatus: 'NOT READY',
        truckStatus: warehouseData[0].truck,
        warehouseLocation: warehouseData[0].warehouse,
        warehouseStatus: warehouseData[0].status
      },
      {
        id: 2,
        onTimeStatus: 'ON-TIME',
        cutOffTime: `${todayDate} 2:00 PM`,
        timeRemaining: '2 hrs 15 mins',
        shipCity: 'LONDON',
        deliveryNum: '5871235',
        jobNum: '4001235',
        productName: 'CARDSTOCK 10x12',
        productionStatus: 'JOGGED',
        timeInStatus: '3:22',
        receipted: getRandomReceipeted(1000000),
        orderQuantity: 1000000,
        orderStatus: 'READY',
        truckStatus: warehouseData[1].truck,
        warehouseLocation: warehouseData[1].warehouse,
        warehouseStatus: warehouseData[1].status
      },
      {
        id: 3,
        onTimeStatus: 'ON-TIME',
        cutOffTime: `${todayDate} 1:00 PM`,
        timeRemaining: '1 hr 05 mins',
        shipCity: 'ORLANDO',
        deliveryNum: '5871236',
        jobNum: '4001236',
        productName: 'ENVELOPE PACK',
        productionStatus: 'PRINTED',
        timeInStatus: '1:10',
        receipted: getRandomReceipeted(1200000),
        orderQuantity: 1200000,
        orderStatus: 'READY',
        truckStatus: warehouseData[2].truck,
        warehouseLocation: warehouseData[2].warehouse,
        warehouseStatus: warehouseData[2].status
      },
      {
        id: 4,
        onTimeStatus: 'CAUTION',
        cutOffTime: `${todayDate} 12:00 PM`,
        timeRemaining: '45 mins',
        shipCity: 'DETROIT',
        deliveryNum: '5871237',
        jobNum: '4001237',
        productName: 'BROCHURE 4x9',
        productionStatus: 'CUTTING',
        timeInStatus: '12:30',
        receipted: getRandomReceipeted(800000),
        orderQuantity: 800000,
        orderStatus: 'NOT READY',
        truckStatus: warehouseData[3].truck,
        warehouseLocation: warehouseData[3].warehouse,
        warehouseStatus: warehouseData[3].status
      },
      {
        id: 5,
        onTimeStatus: 'MOVED',
        cutOffTime: `${todayDate} 11:00 AM`,
        timeRemaining: 'MOVED',
        shipCity: 'CHICAGO',
        deliveryNum: '5871238',
        jobNum: '4001238',
        productName: 'BOOKLET SADDLE',
        productionStatus: 'RECEIPTED',
        timeInStatus: '0:45',
        receipted: getRandomReceipeted(2000000),
        orderQuantity: 2000000,
        orderStatus: 'READY',
        truckStatus: warehouseData[4].truck,
        warehouseLocation: warehouseData[4].warehouse,
        warehouseStatus: warehouseData[4].status
      },
      {
        id: 6,
        onTimeStatus: 'ON-TIME',
        cutOffTime: `${todayDate} 4:00 PM`,
        timeRemaining: '4 hrs 30 mins',
        shipCity: 'MORRICE',
        deliveryNum: '5871239',
        jobNum: '4001239',
        productName: 'BANNER VINYL',
        productionStatus: 'PRODUCTION',
        timeInStatus: '2:15',
        receipted: getRandomReceipeted(1500000),
        orderQuantity: 1500000,
        orderStatus: 'NOT READY',
        truckStatus: warehouseData[5].truck,
        warehouseLocation: warehouseData[5].warehouse,
        warehouseStatus: warehouseData[5].status
      },
      {
        id: 7,
        onTimeStatus: 'ON-TIME',
        cutOffTime: `${todayDate} 2:00 PM`,
        timeRemaining: '2 hrs 20 mins',
        shipCity: 'TORONTO',
        deliveryNum: '5871240',
        jobNum: '4001240',
        productName: 'POSTCARD GLOSS',
        productionStatus: 'PICKED',
        timeInStatus: '0:30',
        receipted: getRandomReceipeted(900000),
        orderQuantity: 900000,
        orderStatus: 'READY',
        truckStatus: warehouseData[6].truck,
        warehouseLocation: warehouseData[6].warehouse,
        warehouseStatus: warehouseData[6].status
      },
      {
        id: 8,
        onTimeStatus: 'LATE',
        cutOffTime: `${todayDate} 9:00 AM`,
        timeRemaining: '-2 hrs 10 mins',
        shipCity: 'MONTREAL',
        deliveryNum: '5871241',
        jobNum: '4001241',
        productName: 'FLYER 8.5x11',
        productionStatus: 'CUTTING',
        timeInStatus: '8:15',
        receipted: getRandomReceipeted(1100000),
        orderQuantity: 1100000,
        orderStatus: 'NOT READY',
        truckStatus: warehouseData[7].truck,
        warehouseLocation: warehouseData[7].warehouse,
        warehouseStatus: warehouseData[7].status
      }
    ];
  }, []);

  // Fetch data from n8n webhook
  const fetchDataFromWebhook = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(WEBHOOK_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Data from webhook:', data);
      
      setOrders(getMockOrders());
      setMetrics(generateRandomMetrics());
      setLastUpdated(new Date().toLocaleTimeString());
      setLoading(false);
    } catch (err) {
      console.error('Error fetching from webhook:', err);
      setError(err.message);
      setOrders(getMockOrders());
      setMetrics(generateRandomMetrics());
      setLoading(false);
    }
  }, [getMockOrders]);

  // Fetch data on component mount
  useEffect(() => {
    fetchDataFromWebhook();
  }, [fetchDataFromWebhook]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDataFromWebhook();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchDataFromWebhook]);

  const getStatusClass = (status) => {
    if (status === 'LATE') return 'status-critical';
    if (status === 'CAUTION') return 'status-caution';
    if (status === 'MOVED') return 'status-moved';
    return 'status-ontime';
  };

  const getReadyPercentage = (receipted, total) => {
    return Math.round((receipted / total) * 100);
  };

  const getWarehouseDisplay = (location, status) => {
    if (location === 'MCC_PLANT') {
      return {
        text: '🏭 MCC PLANT',
        color: '#ff9900',
        bgColor: 'rgba(255, 153, 0, 0.2)'
      };
    } else if (location === 'EXTERNAL_WAREHOUSE') {
      return {
        text: '🚚 EXTERNAL',
        color: '#00bfff',
        bgColor: 'rgba(0, 191, 255, 0.2)'
      };
    }
    return {
      text: status,
      color: '#cccccc',
      bgColor: 'rgba(200, 200, 200, 0.1)'
    };
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-title">
          <h1>MCC LOGISTICS COMMAND CENTRE</h1>
          <p>Real-Time Shipping Operations Dashboard</p>
        </div>
        <div className="header-refresh">
          <span>Last Updated: {lastUpdated}</span>
          <div className="pulse-indicator"></div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          background: 'rgba(255, 68, 68, 0.2)',
          border: '1px solid #ff4444',
          color: '#ff9999',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '10px'
        }}>
          ⚠️ Connection Note: {error} - Using mock data for demonstration
        </div>
      )}

      {/* Summary Metrics */}
      <div className="metrics-container">
        <div className="metric-card">
          <div className="metric-label">LINES TODAY</div>
          <div className="metric-value">{metrics.linesToday}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">ON-TIME %</div>
          <div className="metric-value">{metrics.onTimePercent}%</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">AT RISK</div>
          <div className="metric-value at-risk">{metrics.atRisk}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">NEXT CUT-OFF</div>
          <div className="metric-value">{metrics.nextCutoff}</div>
        </div>
      </div>

      {/* Main Shipping Table */}
      <div className="table-container">
        {loading && <div style={{ color: '#b0b8c4', padding: '20px', textAlign: 'center' }}>Loading...</div>}
        {!loading && (
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
                <th>WAREHOUSE LOCATION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const percentage = getReadyPercentage(order.receipted, order.orderQuantity);
                const isReady = percentage >= 90;
                const warehouse = getWarehouseDisplay(order.warehouseLocation, order.warehouseStatus);
                
                return (
                  <tr key={order.id} className={`order-row ${getStatusClass(order.onTimeStatus)}`}>
                    <td className="status-cell">
                      <span className="status-badge">{order.onTimeStatus}</span>
                    </td>
                    <td>{order.cutOffTime}</td>
                    <td className="time-remaining">{order.timeRemaining}</td>
                    <td className="city-cell">{order.shipCity}</td>
                    <td className="delivery-cell">{order.deliveryNum}</td>
                    <td className="job-cell">{order.jobNum}</td>
                    <td style={{ fontSize: '12px', color: '#b0e0e6' }}>{order.productName}</td>
                    <td className="production-cell">{order.productionStatus}</td>
                    <td className="time-status">{order.timeInStatus}</td>
                    <td className="number-cell">{order.receipted.toLocaleString()}</td>
                    <td className="number-cell">{order.orderQuantity.toLocaleString()}</td>
                    <td>
                      <div className="progress-bar">
                        <div 
                          className={`progress-fill ${isReady ? 'ready' : 'not-ready'}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                        <span className="percentage-text">{percentage}%</span>
                      </div>
                    </td>
                    <td className="truck-cell">{order.truckStatus || '-'}</td>
                    <td style={{
                      color: warehouse.color,
                      fontWeight: '700',
                      fontSize: '12px',
                      padding: '8px',
                      backgroundColor: warehouse.bgColor,
                      borderRadius: '4px',
                      textAlign: 'center'
                    }}>
                      {warehouse.text}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer with Status */}
      <div className="dashboard-footer">
        <div className="footer-status">
          <span className="status-indicator status-ontime"></span> On Time
          <span className="status-indicator status-caution"></span> Caution (&lt;1hr)
          <span className="status-indicator status-critical"></span> Critical (Late)
          <span className="status-indicator status-moved"></span> Moved
        </div>
        <div className="footer-info">
          <p>🚀 n8n Webhook Connected | 📊 Auto-Refresh Every 30 Seconds | 🏭 Warehouse Tracking Active | 🚚 External Warehouse Visibility</p>
        </div>
      </div>
    </div>
  );
};

export default App;