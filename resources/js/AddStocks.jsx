import React, { useState } from 'react';
import HomeSidebar from './HomeSidebar';
import { Copy, Plus, Minus, X, ChevronRight } from 'lucide-react';
import Taskbar from './components/Taskbar.jsx';

const rows = [
  { id: 1, item: 'Lenovo', serial: '353454', date: 'Sept 05 2025', status: 'Available', price: '₱0.00' },
  { id: 2, item: 'Mouse', serial: '4543543', date: 'Sept 5 2025', status: 'Available', price: '₱0.00' },
  { id: 3, item: 'Acer', serial: '345435', date: 'Sept 5 2025', status: 'Available', price: '₱0.00' },
  { id: 4, item: 'Keyboard', serial: '6456546', date: 'Sept 5 2025', status: 'Available', price: '₱0.00' },
  { id: 5, item: 'Monitor', serial: '545644', date: 'Sept 5 2025', status: 'Available', price: '₱0.00' },
  { id: 6, item: 'Mouse', serial: '5646436', date: 'Sept 5 2025', status: 'Available', price: '₱0.00' },
];

const AddStocks = () => {
  const [isAddStocksOpen, setIsAddStocksOpen] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('LENOVO');
  const [serialNumbers, setSerialNumbers] = useState(['', '', '']);

  const addSerialRow = () => setSerialNumbers((prev) => [...prev, '']);
  const removeSerialRow = (index) => {
    setSerialNumbers((prev) => prev.filter((_, i) => i !== index));
  };
  const updateSerial = (index, value) => {
    setSerialNumbers((prev) => prev.map((v, i) => (i === index ? value : v)));
  };

  const closeModal = () => setIsAddStocksOpen(false);

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      <div className="flex-shrink-0">
        <HomeSidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <Taskbar title="Equipment" />

        <main className="flex-1 px-10 py-6 overflow-y-auto">
          <h2 className="text-3xl font-bold text-blue-600">Equipment</h2>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-gray-700 text-sm">New stocks</span>
            <div className="space-x-3">
              <button 
                onClick={() => setIsAddStocksOpen(true)} 
                className="px-4 py-2 rounded-md bg-blue-100 text-blue-700 text-sm hover:bg-blue-600 hover:text-white"
              >
                Add Stocks
              </button>
              <button 
                onClick={() => setIsAddItemOpen(true)} 
                className="px-4 py-2 rounded-md bg-blue-100 text-blue-700 text-sm hover:bg-blue-600 hover:text-white"
              >
                Add Item
              </button>
            </div>
          </div>

          {/* Table with proper HTML structure */}
          <div className="mt-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Items</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Serial Number</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Stored Date</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Price</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr 
                      key={row.id}
                      className={`
                        ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} 
                        hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0
                      `}
                    >
                      <td className="py-4 px-6 font-medium text-gray-900">{row.item}</td>
                      <td className="py-4 px-6 text-gray-700">{row.serial}</td>
                      <td className="py-4 px-6 text-gray-700">{row.date}</td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 font-medium">
                          {row.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-700 font-medium">{row.price}</td>
                      <td className="py-4 px-6">
                        <button 
                          className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                          title="Copy"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {isAddStocksOpen && (
          <AddStocksModal
            onClose={closeModal}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            serialNumbers={serialNumbers}
            addSerialRow={addSerialRow}
            removeSerialRow={removeSerialRow}
            updateSerial={updateSerial}
          />
        )}
        {isAddItemOpen && (
          <AddItemModal onClose={() => setIsAddItemOpen(false)} />
        )}
      </div>
    </div>
  );
};

export default AddStocks;

// Modal Component
const AddStocksModal = ({ onClose, selectedItem, setSelectedItem, serialNumbers, addSerialRow, removeSerialRow, updateSerial }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-[700px] max-w-[92vw] p-6">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-blue-600">
          <X className="h-6 w-6" />
        </button>
        <h3 className="text-xl font-bold text-blue-600 text-center">Add Stocks</h3>

        {/* Item Select */}
        <div className="mt-5">
          <label className="text-sm text-gray-600">Item</label>
          <div className="mt-2 flex items-center space-x-3">
            <select 
              value={selectedItem} 
              onChange={(e) => setSelectedItem(e.target.value)} 
              className="w-60 px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>LENOVO</option>
              <option>ACER</option>
              <option>ASUS</option>
              <option>DELL</option>
            </select>
            <div className="flex-1 text-xs text-gray-500">iCore i5 16gb RAM, 1T storage, Windows 11</div>
          </div>
        </div>

        {/* Serial Numbers */}
        <div className="mt-6 space-y-3 max-h-60 overflow-y-auto pr-2">
          {serialNumbers.map((value, idx) => (
            <div key={idx} className="flex items-center space-x-3">
              <div className="w-28 text-sm text-gray-600">Serial No.</div>
              <input 
                value={value} 
                onChange={(e) => updateSerial(idx, e.target.value)} 
                placeholder="4354354" 
                className="flex-1 px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <button 
                onClick={() => addSerialRow()} 
                className="p-1.5 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button 
                onClick={() => removeSerialRow(idx)} 
                disabled={serialNumbers.length <= 1} 
                className="p-1.5 rounded-md bg-red-100 text-red-600 hover:bg-red-600 hover:text-white disabled:opacity-40"
              >
                <Minus className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Receipt Upload Placeholder */}
        <div className="mt-6">
          <div className="w-28 text-sm text-gray-600">Receipt.</div>
          <div className="mt-2">
            <div className="h-28 w-full max-w-md bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">Image</div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end">
          <button className="inline-flex items-center px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700">
            <span>Save</span>
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const AddItemModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-[880px] max-w-[95vw] p-8">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-blue-600">
          <X className="h-6 w-6" />
        </button>
        <h3 className="text-xl font-bold text-blue-600 text-center">Add Equipment</h3>

        <div className="mt-6 grid grid-cols-2 gap-8">
          <div>
            <label className="text-sm text-gray-600">Category</label>
            <div className="mt-2">
              <select className="w-full px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Laptop</option>
                <option>Mouse</option>
                <option>Keyboard</option>
                <option>Monitor</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Serial Number*</label>
            <input className="mt-2 w-full px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="4354354" />
          </div>

          <div>
            <label className="text-sm text-gray-600">Brand*</label>
            <input className="mt-2 w-full px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Item details" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Supplier*</label>
            <input className="mt-2 w-full px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Item details" />
          </div>

          <div>
            <label className="text-sm text-gray-600">Description*</label>
            <input className="mt-2 w-full px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Item details" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Price</label>
            <input className="mt-2 w-full px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="₱ 0.00" />
          </div>

          <div>
            <label className="text-sm text-gray-600">Item image</label>
            <div className="mt-2 h-28 w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">Image</div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Receipt image</label>
            <div className="mt-2 h-28 w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">Image</div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button className="text-blue-600 hover:underline">Reset all</button>
          <button className="inline-flex items-center px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700">
            <span>Save</span>
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};