import React from "react";
import FileUploadWidget from "./components/FileUploadWidget";
import { Search, UserCog } from "lucide-react";
import HomeSidebar from "./HomeSidebar";
import GlobalHeader from "./components/GlobalHeader";

const ControlPanel = () => {
  // Page-level data only (cards)

  const controlPanelCards = [
    { id: 1, title: 'Admin Position', subtitle: 'Manage', icon: UserCog },
    { id: 2, title: 'Add Categories', subtitle: 'Manage', icon: UserCog },
    { id: 3, title: 'Item Condition', subtitle: 'Manage', icon: UserCog },
    { id: 4, title: 'Admin Position', subtitle: 'Manage', icon: UserCog },
    { id: 5, title: 'Admin Position', subtitle: 'Manage', icon: UserCog },
  ];

  const [showCategoryModal, setShowCategoryModal] = React.useState(false);
  const [catName, setCatName] = React.useState('');
  const [catDesc, setCatDesc] = React.useState('');
  const [catImage, setCatImage] = React.useState(null);
  const [catError, setCatError] = React.useState('');
  const [catLoading, setCatLoading] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const handleCardClick = (card) => {
    if (card.title === 'Add Categories') {
      setShowCategoryModal(true);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setCatError('');
    
    // Validate all required fields
    if (!catName.trim()) {
      setCatError('Category name is required.');
      return;
    }
    if (!catImage) {
      setCatError('Category image is required.');
      return;
    }
    
    setCatLoading(true);
    try {
      const form = new FormData();
      form.append('name', catName.trim());
      form.append('description', catDesc.trim());
      form.append('image', catImage);
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content },
        body: form
      });
      const contentType = res.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        // Try to get text (likely HTML error page)
        const text = await res.text();
        setCatError('Server error: Unexpected response format.');
        return;
      }
      if (data.success) {
        setShowCategoryModal(false);
        setCatName(''); setCatDesc(''); setCatImage(null); setCatError('');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000); // Hide after 3 seconds
      } else {
        // Show detailed validation errors if present
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(' ');
          setCatError(errorMessages || data.message || 'Failed to add category');
        } else {
          setCatError(data.message || 'Failed to add category');
        }
      }
    } catch (err) {
      setCatError('Error: ' + (err.message || 'Unknown'));
    } finally {
      setCatLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-white flex">
      <HomeSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <GlobalHeader title="Control Panel" />
        {/* Header */}
        <header className="flex items-center justify-between px-10 py-6 bg-white border-b border-gray-100">
          {/* Search */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-3 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          {/* Profile Section */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>
            <span className="text-gray-700 font-medium">John F.</span>
            <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
              J
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="px-10 py-6 flex-1 overflow-y-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#2262C6] mb-2">Control Panel</h1>
            <p className="text-gray-500 text-lg">Control Panel</p>
          </div>

          {/* Control Panel Cards */}
          <div className="grid grid-cols-3 gap-6 max-w-4xl">
            {controlPanelCards.map((card, index) => (
              <div
                key={card.id}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                style={{ boxShadow: '0 2px 8px rgba(29, 78, 216, 0.4)' }}
                onClick={() => handleCardClick(card)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-blue-600 mb-1">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {card.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Category Modal */}
          {showCategoryModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/30" onClick={() => setShowCategoryModal(false)} />
              <div className="relative bg-white rounded-2xl shadow-xl w-[400px] max-w-[95vw] p-8">
                <h3 className="text-xl font-bold text-blue-600 text-center mb-4">Add Category</h3>
                <form onSubmit={handleCategorySubmit}>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-1">Name*</label>
                    <input type="text" value={catName} onChange={e => setCatName(e.target.value)} className="w-full px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-1">Description</label>
                    <input type="text" value={catDesc} onChange={e => setCatDesc(e.target.value)} className="w-full px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <FileUploadWidget
                    label="Image"
                    onFileSelect={file => setCatImage(file)}
                    error="Category image is required."
                    required={true}
                  />
                  {catError && <div className="mb-2 text-xs text-red-600">{catError}</div>}
                  <div className="flex justify-end mt-6">
                    <button type="button" className="mr-3 px-4 py-2 rounded bg-gray-200 text-gray-700" onClick={() => setShowCategoryModal(false)}>Cancel</button>
                    <button type="submit" disabled={catLoading} className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                      {catLoading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Success Notification */}
          {showSuccess && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-xl p-6 flex items-center space-x-4 border-l-4 border-green-500">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Success!</h3>
                  <p className="text-gray-600">Category has been added successfully.</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ControlPanel;
