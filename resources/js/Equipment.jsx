import React, { useState, useEffect } from 'react';
import HomeSidebar from './HomeSidebar';
import Taskbar from './components/Taskbar.jsx';
import api from './services/api';

const Card = ({ selected, name, qty, image, onClick }) => {
  return (
    <button 
      onClick={onClick} 
      className={`relative h-56 w-64 rounded-xl overflow-hidden shadow-sm border ${
        selected ? 'border-blue-500' : 'border-gray-200'
      } bg-white text-left focus:outline-none`}
    > 
      <div className="h-2/3 w-full flex items-center justify-center">
        {image ? (
          <img
            src={image.startsWith('http') ? image : image.startsWith('/storage') ? image : `/storage/${image}`}
            alt={name}
            className="h-24 w-40 object-cover rounded-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/placeholder-equipment.png';
            }}
          />
        ) : (
          <div className="h-24 w-40 bg-gray-200 rounded-md" />
        )}
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
  const [selected, setSelected] = useState(null);
  const [categories, setCategories] = useState([]);
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories first
        const catRes = await api.get('/categories');
        if (catRes?.data?.success && Array.isArray(catRes.data.data)) {
          const categoriesData = catRes.data.data;
          setCategories(categoriesData);
          
          // Then fetch equipment
          const eqRes = await api.get('/equipment');
          if (eqRes?.data?.success && eqRes.data.data && Array.isArray(eqRes.data.data.data)) {
            const equipmentData = eqRes.data.data.data;
            
            // Separate assigned and unassigned equipment
            const assignedEquipment = equipmentData.filter(eq => eq.category_id);
            const unassignedEquipment = equipmentData.filter(eq => !eq.category_id);
            
            // Update categories with equipment count
            const categoriesWithCount = categoriesData.map(cat => ({
              ...cat,
              qty: `${assignedEquipment.filter(eq => eq.category_id === cat.id).length}`
            }));
            setCategories(categoriesWithCount);
            setEquipment(assignedEquipment);
          }
        }
      } catch (e) {
        console.error('Failed to fetch categories/equipment:', e);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-white flex">
      <HomeSidebar />
      <div className="flex-1 flex flex-col">
        <Taskbar title="John F." />
        
        <main className="px-10 py-6 mb-10 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto">
            <h2 className="text-3xl font-bold text-blue-600">Equipment</h2>
            {!selected && (
              <>
                <h3 className="text-base font-semibold text-gray-700 mt-3">Categories</h3>
                <div className="mt-6 grid grid-cols-4 gap-6">
                  {categories.map((cat) => (
                    <div key={cat.id} className="group relative">
                      <Card
                        selected={selected === cat.name}
                        name={cat.name}
                        qty={cat.qty || '0/0'}
                        image={cat.image}
                        onClick={() => setSelected(cat.name)}
                      />
                      {/* Equipment items for this category - Shows on hover */}
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        <div className="p-4 max-h-96 overflow-y-auto">
                        {equipment
                          .filter(eq => eq.category_id === cat.id)
                          .map(eq => (
                            <div key={eq.id} className="w-full bg-gray-50 rounded-lg p-3 mb-2 text-xs text-gray-700 hover:bg-blue-50/50 transition-colors">
                              <div className="flex items-center space-x-2">
                                <span>{eq.brand || eq.name}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium
                                  ${eq.status === 'available' ? 'bg-green-100 text-green-800' : ''}
                                  ${eq.status === 'in_use' ? 'bg-blue-100 text-blue-800' : ''}
                                  ${eq.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' : ''}
                                  ${eq.status === 'retired' ? 'bg-gray-100 text-gray-800' : ''}
                                `}>
                                  {eq.status}
                                </span>
                              </div>
                              <span className="text-gray-500">{eq.serial_number}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {selected && (
              <>
                <div className="mt-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-700">
                    Inventory / {selected}
                  </h3>
                </div>
                <div className="mt-6 flex flex-col items-start w-full">
                  {categories.filter(cat => cat.name === selected).map(cat => (
                    <div key={cat.id} className="w-full">
                      <div className="mb-2 text-lg font-bold text-blue-600">{cat.name}</div>
                      <div className="overflow-x-auto">
                        <div className="grid grid-cols-3 gap-4 px-2 mb-2 text-gray-600 text-sm font-semibold">
                          <div>Items</div>
                          <div>Available/Total</div>
                          <div>Total Price(₱)</div>
                        </div>
                          {equipment.filter(eq => eq.category_id === cat.id && !(eq.name === 'Lenovo' && eq.serial_number === '87123qwe')).length === 0 ? (
                            <div className="text-gray-400 text-sm px-2">No equipment found for this category.</div>
                          ) : (
                            equipment.filter(eq => eq.category_id === cat.id && !(eq.name === 'Lenovo' && eq.serial_number === '87123qwe')).map(eq => (
                              <div key={eq.id} className="grid grid-cols-3 gap-4 bg-white rounded-lg shadow p-3 mb-3 items-center">
                                <div className="font-medium">{eq.name}</div>
                                <div className="text-center">{eq.available_stock || '10'}/{eq.total_stock || '20'}</div>
                                <div className="text-right">₱{eq.purchase_price ? Number(eq.purchase_price).toFixed(2) : '0.00'}</div>
                              </div>
                            ))
                        )}
                      </div>
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