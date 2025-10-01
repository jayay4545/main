import React, { useEffect, useMemo, useState } from "react";
import HomeSidebar from "./HomeSidebar";
import GlobalHeader from "./components/GlobalHeader";
import { Search, Filter, Download, Calendar } from "lucide-react";
import { reportService } from "./services/api";

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [summary, setSummary] = useState({ total_items: 0, available_stock: 0, low_stock: 0, out_of_stock: 0 });
  const [departmentData, setDepartmentData] = useState([]);
  const [itemDistribution, setItemDistribution] = useState([]);
  const [monthlyTrendData, setMonthlyTrendData] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      if (searchTerm) params.search = searchTerm;
      const res = await reportService.getOverview(params);
      if (res.success) {
        const data = res.data;
        setSummary(data.summary || {});
        setDepartmentData((data.department || []).map(d => ({ department: d.department, requests: d.requests })));
        setItemDistribution((data.categories || []).map(c => ({ category: c.category, count: c.count })));
        setMonthlyTrendData(data.trend || []);
        setTransactions(data.transactions || []);
      } else {
        setError(res.message || 'Failed to load reports');
      }
    } catch (err) {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <HomeSidebar />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        <GlobalHeader title="Reports" />

        {/* Main Content Area */}
        <main className="px-10 py-6 mb-10 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
          <h2 className="text-4xl font-bold text-[#2262C6] mb-6">Reports</h2>

          {/* Filter and Action Bar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search employee / Item"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm flex-1"
              />
            </div>
            <button onClick={() => {
              if (startDate && endDate && startDate > endDate) {
                setError('Start date must be before end date');
                return;
              }
              fetchData();
            }} className="flex items-center gap-2 px-4 py-2 bg-[#2262C6] text-white rounded-lg hover:bg-[#1e40af] transition-colors">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button onClick={async () => {
              if (startDate && endDate && startDate > endDate) {
                setError('Start date must be before end date');
                return;
              }
              try {
                const params = {};
                if (startDate) params.start_date = startDate;
                if (endDate) params.end_date = endDate;
                if (searchTerm) params.search = searchTerm;
                const res = await reportService.exportCsv(params);
                const blob = new Blob([res.data], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `reports-transactions-${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.csv`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
              } catch (e) {
                setError('Failed to export CSV');
              }
            }} className="flex items-center gap-2 px-4 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-colors">
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">{error}</div>
          )}
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Items</h3>
              <p className="text-3xl font-bold text-gray-900">{summary.total_items ?? 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Available Stock</h3>
              <p className="text-3xl font-bold text-gray-900">{summary.available_stock ?? 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Low Stock</h3>
              <p className="text-3xl font-bold text-gray-900">{summary.low_stock ?? 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Out of stock</h3>
              <p className="text-3xl font-bold text-gray-900">{summary.out_of_stock ?? 0}</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Requests per Department Bar Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Requests per Department</h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {departmentData.map((dept, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className="bg-[#2262C6] rounded-t w-full mb-2 transition-all duration-500 hover:bg-[#1e40af]"
                      style={{ height: `${(dept.requests / Math.max(1, (departmentData[0]?.requests || 1))) * 200}px` }}
                    ></div>
                    <span className="text-xs text-gray-600">{dept.department}</span>
                    <span className="text-xs font-semibold">{dept.requests}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>0</span>
                  <span>30</span>
                  <span>60</span>
                  <span>90</span>
                  <span>120</span>
                </div>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Item Distribution</h3>
              <div className="flex items-center justify-center h-64">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    {(() => {
                      const total = itemDistribution.reduce((sum, item) => sum + (item.count || 0), 0) || 1;
                      let offset = 0;
                      return itemDistribution.map((item, idx) => {
                        const percentage = Math.round(((item.count || 0) / total) * 100);
                        const dash = `${percentage * 2.51} ${100 * 2.51}`;
                        const circle = (
                          <circle
                            key={idx}
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke={['#1e40af','#3b82f6','#60a5fa','#93c5fd','#bfdbfe'][idx % 5]}
                            strokeWidth="8"
                            strokeDasharray={dash}
                            strokeDashoffset={`-${offset}`}
                          />
                        );
                        offset += percentage * 2.51;
                        return circle;
                      });
                    })()}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{itemDistribution.reduce((s,i)=>s + (i.count||0),0)}</div>
                      <div className="text-xs text-gray-500">Total Items</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {itemDistribution.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: ['#1e40af','#3b82f6','#60a5fa','#93c5fd','#bfdbfe'][index % 5] }}
                    ></div>
                    <span className="text-sm text-gray-600">{item.category} ({item.count})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Trend Line Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Trend</h3>
              <div className="h-64 relative">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  {/* Grid lines */}
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Completed line */}
                  <polyline
                    fill="none"
                    stroke="#1e40af"
                    strokeWidth="3"
                    points={monthlyTrendData.map((point, index) => 
                      `${index * 50 + 25},${200 - (point.completed / Math.max(1, ...monthlyTrendData.map(p=>p.completed))) * 180}`
                    ).join(' ')}
                  />
                  
                  {/* Requests line */}
                  <polyline
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="3"
                    points={monthlyTrendData.map((point, index) => 
                      `${index * 50 + 25},${200 - (point.requests / Math.max(1, ...monthlyTrendData.map(p=>p.requests))) * 180}`
                    ).join(' ')}
                  />
                  
                  {/* Data points */}
                  {monthlyTrendData.map((point, index) => (
                    <g key={index}>
                      <circle
                        cx={index * 50 + 25}
                        cy={200 - (point.completed / 60) * 180}
                        r="3"
                        fill="#1e40af"
                      />
                      <circle
                        cx={index * 50 + 25}
                        cy={200 - (point.requests / 60) * 180}
                        r="3"
                        fill="#60a5fa"
                      />
                    </g>
                  ))}
                </svg>
                
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
                  <span>60</span>
                  <span>45</span>
                  <span>30</span>
                  <span>15</span>
                  <span>0</span>
                </div>
                
                {/* X-axis labels */}
                <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-500 px-6">
                  {monthlyTrendData.map((point, index) => (
                    <span key={index}>{point.month}</span>
                  ))}
                </div>
              </div>
              
              {/* Legend */}
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-[#1e40af]"></div>
                  <span className="text-xs text-gray-600">completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-[#60a5fa]"></div>
                  <span className="text-xs text-gray-600">requests</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Transactions Table */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Detailed Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Employee</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Item</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Qty</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Approved By</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 text-gray-900">{transaction.date}</td>
                      <td className="py-3 px-2 text-gray-900">{transaction.employee}</td>
                      <td className="py-3 px-2 text-gray-900">{transaction.item}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-900">{transaction.qty}</td>
                      <td className="py-3 px-2 text-gray-900">{transaction.approvedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;
