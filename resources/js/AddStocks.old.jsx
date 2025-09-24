import React, { useState } from 'react';
import FileUploadWidget from './components/FileUploadWidget';
import HomeSidebar from './HomeSidebar';
import { Copy, Plus, Minus, X, ChevronRight } from 'lucide-react';
import Taskbar from './components/Taskbar.jsx';
import api from './services/api';

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
  const [equipmentRows, setEquipmentRows] = useState([]);

  const fetchEquipment = async () => {
    try {
      const res = await api.get('/equipment');
      if (res?.data?.success && res.data.data?.data) {
        setEquipmentRows(res.data.data.data);
      }
    } catch (e) {
      console.error('Failed to fetch equipment:', e);
    }
  };

  React.useEffect(() => {
    fetchEquipment();
  }, []);

  const addSerialRow = () => setSerialNumbers((prev) => [...prev, '']);
  const removeSerialRow = (index) => {
    setSerialNumbers((prev) => prev.filter((_, i) => i !== index));
  };
  const updateSerial = (index, value) => {
    setSerialNumbers((prev) => prev.map((v, i) => (i === index ? value : v)));
  };

  const closeModal = () => setIsAddStocksOpen(false);

  // Callback to refresh equipment after add
  const handleEquipmentAdded = () => {
    fetchEquipment();
  };

  return (
    <div className="h-screen overflow-hidden bg-white flex">
      <HomeSidebar />
      <div className="flex-1 flex flex-col">
        <Taskbar title="Equipment" />

        {/* Content */}
        <main className="px-10 py-6 mb-10 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto">
          <h2 className="text-3xl font-bold text-blue-600">Equipment</h2>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-gray-700 text-sm">New stocks</span>
            <div className="space-x-3">
              <button onClick={() => setIsAddStocksOpen(true)} className="px-4 py-2 rounded-md bg-blue-100 text-blue-700 text-sm hover:bg-blue-600 hover:text-white">Add Stocks</button>
              <button onClick={() => setIsAddItemOpen(true)} className="px-4 py-2 rounded-md bg-blue-100 text-blue-700 text-sm hover:bg-blue-600 hover:text-white">Add Item</button>
            </div>
          </div>

          {/* Table */}
          <div className="mt-6">
            <div className="grid grid-cols-12 text-sm text-gray-600 px-2">
              <div className="col-span-3">Items</div>
              <div className="col-span-3">Serial Number</div>
              <div className="col-span-3">Stored Date</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Price</div>
              <div className="col-span-1">Actions</div>
            </div>

            <div className="mt-2 divide-y">
              {equipmentRows.map((r) => (
                <div key={r.id} className="grid grid-cols-12 items-center px-3 py-3 hover:bg-gray-50 rounded-lg">
                  <div className="col-span-3">{r.name}</div>
                  <div className="col-span-3">{r.serial_number}</div>
                  <div className="col-span-3">{new Date(r.created_at).toLocaleDateString()}</div>
                  <div className="col-span-1 text-green-600">{r.status}</div>
                  <div className="col-span-1">₱{r.purchase_price || '0.00'}</div>
                  <div className="col-span-1 flex items-center space-x-2 text-gray-600">
                    <Copy className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
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
          <AddItemModal onClose={() => setIsAddItemOpen(false)} onEquipmentAdded={handleEquipmentAdded} />
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
              disabled={categoriesLoading}
            >
              {categoriesLoading ? (
                <option>Loading categories...</option>
              ) : categories.length === 0 ? (
                <option>No categories available</option>
              ) : (
                categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))
              )}
            </select>
            <div className="flex-1 text-xs text-gray-500">iCore i5 16gb RAM, 1T storage, Windows 11</div>
          </div>
        </div>

        {/* Serial Numbers */}
        <div className="mt-6 space-y-3 max-h-60 overflow-y-auto pr-2">
          {serialNumbers.map((value, idx) => (
            <div key={idx} className="flex items-center space-x-3">
              <div className="w-28 text-sm text-gray-600">Serial No.</div>
              <input value={value} onChange={(e) => updateSerial(idx, e.target.value)} placeholder="4354354" className="flex-1 px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={() => addSerialRow()} className="p-1.5 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white"><Plus className="h-4 w-4" /></button>
              <button onClick={() => removeSerialRow(idx)} disabled={serialNumbers.length <= 1} className="p-1.5 rounded-md bg-red-100 text-red-600 hover:bg-red-600 hover:text-white disabled:opacity-40"><Minus className="h-4 w-4" /></button>
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

const AddItemModal = (props) => {
  const [category, setCategory] = useState('Laptop');
  const [serial, setSerial] = useState('');
  const [brand, setBrand] = useState('');
  const [supplier, setSupplier] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [itemImage, setItemImage] = useState(null);
  const [receiptImage, setReceiptImage] = useState(null);
  const [itemImageError, setItemImageError] = useState('');
  const [receiptImageError, setReceiptImageError] = useState('');
  const [serialError, setSerialError] = useState('');
  const [loading, setLoading] = useState(false);
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  // Callback for parent to refresh equipment
  const { onEquipmentAdded, onClose } = props || {};

  // Dynamic file validation handlers
  const validateFile = (file) => {
    if (!file) return { ok: true };
    if (!ALLOWED_TYPES.includes(file.type)) return { ok: false, message: 'Invalid file type. Allowed: JPG, PNG, WEBP, GIF.' };
    if (file.size > MAX_FILE_SIZE) return { ok: false, message: 'File is too large. Max allowed size is 5 MB.' };
    return { ok: true };
  };

  const handleItemImageChange = (e) => {
    const file = e.target.files[0];
    setItemImage(file);
    const v = validateFile(file);
    setItemImageError(v.ok ? '' : v.message);
  };
  const handleReceiptImageChange = (e) => {
    const file = e.target.files[0];
    setReceiptImage(file);
    const v = validateFile(file);
    setReceiptImageError(v.ok ? '' : v.message);
  };

  const resetForm = () => {
    setCategory('Laptop'); setSerial(''); setBrand(''); setSupplier(''); setDescription(''); setPrice(''); setItemImage(null); setReceiptImage(null);
  };

  const handleSave = async () => {
    // Validate required fields
    let valid = true;
    if (!serial) {
      setSerialError('Serial number is required.');
      valid = false;
    } else {
      setSerialError('');
    }
    if (!brand || (!description && !category)) {
      alert('Please provide at least Brand and Description/Category for the item.');
      valid = false;
    }
    // Validate images
    const validateFile = (file) => {
      if (!file) return { ok: false, message: 'Image is required.' };
      if (!ALLOWED_TYPES.includes(file.type)) return { ok: false, message: 'Invalid file type. Allowed: JPG, PNG, WEBP, GIF.' };
      if (file.size > MAX_FILE_SIZE) return { ok: false, message: 'File is too large. Max allowed size is 5 MB.' };
      return { ok: true };
    };
    let v = validateFile(itemImage);
    if (!v.ok) { setItemImageError(v.message); valid = false; } else { setItemImageError(''); }
    v = validateFile(receiptImage);
    if (!v.ok) { setReceiptImageError(v.message); valid = false; } else { setReceiptImageError(''); }
    if (!valid) return;

    setLoading(true);
    try {
      const form = new FormData();
      form.append('name', description || category);
      form.append('brand', brand);
      form.append('serial_number', serial);
      if (price) form.append('purchase_price', price.replace(/[^0-9.]/g, ''));
      if (description) form.append('notes', description);
      form.append('status', 'available');
      form.append('condition', 'good');
      form.append('item_image', itemImage);
      form.append('receipt_image', receiptImage);

      const res = await api.post('/equipment', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res?.data?.success) {
        alert('Equipment created successfully');
        resetForm();
        onClose();
        if (typeof onEquipmentAdded === 'function') onEquipmentAdded();
      } else {
        alert('Failed to create equipment: ' + (res?.data?.message || 'Unknown'));
      }
    } catch (e) {
      console.error(e);
      alert('Error uploading equipment: ' + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

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
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Laptop</option>
                <option>Mouse</option>
                <option>Keyboard</option>
                <option>Monitor</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Serial Number*</label>
            <input value={serial} onChange={(e) => setSerial(e.target.value)} className="mt-2 w-full px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="4354354" />
            {serialError && <div className="mt-1 text-xs text-red-600">{serialError}</div>}
          </div>

          <div>
            <label className="text-sm text-gray-600">Brand*</label>
            <input value={brand} onChange={(e) => setBrand(e.target.value)} className="mt-2 w-full px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Item details" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Supplier*</label>
            <input value={supplier} onChange={(e) => setSupplier(e.target.value)} className="mt-2 w-full px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Item details" />
          </div>

          <div>
            <label className="text-sm text-gray-600">Description*</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} className="mt-2 w-full px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Item details" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Price</label>
            <input value={price} onChange={(e) => setPrice(e.target.value)} className="mt-2 w-full px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="₱ 0.00" />
          </div>

          <div>
            <FileUploadWidget
              label="Item image"
              onFileSelect={file => handleItemImageChange({ target: { files: [file] } })}
              error={itemImageError}
            />
          </div>
          <div>
            <FileUploadWidget
              label="Receipt image"
              onFileSelect={file => handleReceiptImageChange({ target: { files: [file] } })}
              error={receiptImageError}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button onClick={resetForm} className="text-blue-600 hover:underline">Reset all</button>
          <button onClick={handleSave} disabled={loading} className="inline-flex items-center px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700">
            <span>{loading ? 'Saving...' : 'Save'}</span>
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

