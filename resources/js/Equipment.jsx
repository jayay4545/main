import React, { useState } from 'react';
import HomeSidebar from './HomeSidebar';
import { Search } from 'lucide-react';

const items = [
  { id: 1, name: 'LAPTOP', qty: '4/10', img: null },
  { id: 2, name: 'Projector', qty: '4/10', img: null },
  { id: 3, name: 'Mouse', qty: '4/10', img: null },
  { id: 4, name: 'Keyboard', qty: '4/10', img: null },
  { id: 5, name: 'LAPTOP', qty: '4/10', img: null },
  { id: 6, name: 'Projector', qty: '4/10', img: null },
  { id: 7, name: 'Mouse', qty: '4/10', img: null },
  { id: 8, name: 'Keyboard', qty: '4/10', img: null },
];

const Card = ({ selected, name, qty, onClick }) => {
  return (
    <button onClick={onClick} className={`relative h-56 w-64 rounded-xl overflow-hidden shadow-sm border ${selected ? 'border-blue-500' : 'border-gray-200'} bg-white text-left focus:outline-none`}> 
      <div className="h-2/3 w-full flex items-center justify-center">
        <div className="h-24 w-40 bg-gray-200 rounded-md" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-blue-50 to-blue-200" />
      <div className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-700 uppercase">{name}</span>
        <span className="text-xs text-blue-700 font-medium">{qty}</span>
      </div>
    </button>
  );
};

const Equipment = () => {
  const [selected, setSelected] = useState(null); // e.g. 'Laptop'
  return (
    <div className="h-screen overflow-hidden bg-white flex">
      <HomeSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-10 py-6 bg-white">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="text" placeholder="Search" className="w-full pl-10 pr-4 py-3 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-gray-700 font-medium">John F.</span>
            <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white">J</div>
          </div>
        </header>

        {/* Content */}
        <main className="px-10 py-6 mb-10 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto">
          <h2 className="text-3xl font-bold text-blue-600">Equipment</h2>
          {!selected && (
            <>
              <h3 className="text-base font-semibold text-gray-700 mt-3">Inventory</h3>
              <div className="mt-6 grid grid-cols-4 gap-6">
                {items.map((it, idx) => (
                  <Card
                    key={it.id}
                    selected={selected ? selected === it.name : idx === 1}
                    name={it.name}
                    qty={it.qty}
                    onClick={() => setSelected(it.name)}
                  />
                ))}
              </div>
            </>
          )}

          {selected && (
            <>
              <div className="mt-3 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-700">Inventory / {selected}</h3>
              </div>
              {/* Table header */}
              <div className="mt-6 grid grid-cols-12 text-sm text-gray-600 px-2">
                <div className="col-span-6">Items</div>
                <div className="col-span-3">Available/Total</div>
                <div className="col-span-3 text-right">Total Price(₱)</div>
              </div>
              {/* Rows */}
              <div className="mt-3 space-y-3">
                {[1,2,3,4].map((rowIdx) => (
                  <div key={rowIdx} className={`grid grid-cols-12 items-center bg-white rounded-xl shadow-sm border ${rowIdx===1 ? 'ring-2 ring-blue-400' : 'border-gray-200'} px-5 py-4`}>
                    <div className="col-span-6 text-gray-700">{rowIdx===1 ? 'Lenovo Asus' : rowIdx===2 ? 'Toshiba Acer' : rowIdx===3 ? 'Asus LF' : 'Toshiba thinkpad'}</div>
                    <div className="col-span-3 text-gray-600">10/20</div>
                    <div className="col-span-3 text-right text-gray-700">₱0.00</div>
                  </div>
                ))}
              </div>
            </>
          )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Equipment;


