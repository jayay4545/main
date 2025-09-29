import React, { useState, useEffect } from "react";
import HomeSidebar from "./HomeSidebar";
import Taskbar from "./components/Taskbar.jsx";

const HomePage = () => {
  const [activeView, setActiveView] = useState("Dashboard");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      // Add a small delay to ensure session is established
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
      console.log('Fetching user profile...');
      console.log('Document cookies:', document.cookie);
      console.log('CSRF token:', document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'));
      
      // Check if Laravel session cookie exists
      const sessionCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('laravel-session='));
      console.log('Laravel session cookie:', sessionCookie || 'NOT FOUND');
      
      // Debug: Check all cookies
      const allCookies = document.cookie.split(';').map(cookie => cookie.trim());
      console.log('All cookies:', allCookies);
      
      // Debug: Check if there are any JavaScript errors
      console.log('Current URL:', window.location.href);
      console.log('Current domain:', window.location.hostname);
      
      // First try to get login data (in case we just logged in)
      let response;
      try {
        response = await fetch('/login-data', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          },
          credentials: 'same-origin',
        });
        
        if (response.ok) {
          const loginData = await response.json();
          if (loginData.success) {
            console.log('Got user data from login-data endpoint:', loginData.user);
            setUser(loginData.user);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.log('Login-data endpoint failed, trying profile endpoint:', error);
      }
      
      // If login-data failed, try the profile endpoint
      response = await fetch('/api/profile', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          },
          credentials: 'same-origin', // Include cookies for session authentication
        });

        console.log('Profile API response status:', response.status);
        console.log('Profile API response headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
          const data = await response.json();
          console.log('Profile API response data:', data);
          if (data.success) {
            setUser(data.data);
            console.log('User data set:', data.data);
          } else {
            console.error('API returned error:', data.message);
            // Show loading error instead of hardcoded data
            setUser({
              name: "Loading...",
              role: "Please wait",
              email: "Loading user data...",
              phone: "",
              location: "",
              image: null
            });
          }
        } else {
          console.error('API request failed with status:', response.status);
          // Try to get user from localStorage first
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
              console.log('Using stored user data after API failure:', parsedUser);
            } catch (e) {
              console.error('Failed to parse stored user data:', e);
              setUser({
                name: "API Error",
                role: "Please refresh",
                email: "Failed to load user data",
                phone: "",
                location: "",
                image: null
              });
            }
          } else {
            setUser({
                name: "Not Authenticated",
                role: "Please login",
                email: "No user data available",
              phone: "",
              location: "",
              image: null
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        // Try to get user from localStorage first
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            console.log('Using stored user data after error:', parsedUser);
          } catch (e) {
            console.error('Failed to parse stored user data:', e);
            setUser({
                name: "Not Authenticated",
                role: "Please login",
                email: "No user data available",
              phone: "",
              location: "",
              image: null
            });
          }
        } else {
          setUser({
            name: "Not Authenticated",
            role: "Please login",
            email: "No user data available",
            phone: "",
            location: "",
            image: null
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
    // The profile modal will be opened by the BubbleProfile component
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/logout', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      if (response.ok) {
        // Clear any stored user data
        localStorage.removeItem('user');
        // Redirect to login page
        window.location.href = '/';
      } else {
        console.error('Logout failed');
        // Still redirect to login page
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect to login page
      window.location.href = '/';
    }
  };

  // Show loading state while fetching user data
  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-white">
        <HomeSidebar onSelect={(label) => setActiveView(label)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <HomeSidebar onSelect={(label) => setActiveView(label)} />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        <Taskbar 
          title={user?.name || "User"} 
          user={user}
          onEditProfile={handleEditProfile}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main className="px-10 pt-3 pb-6 mb-10 flex flex-col overflow-hidden">
          <h2 className="text-4xl font-bold text-[#2262C6]">Dashboard</h2>

            <>
          {/* Stats Cards - Much Smaller Size with Fixed Height */}
      <div className="grid grid-cols-3 gap-9 mt-6">
        <div className="bg-gradient-to-b from-[#0064FF] to-[#003C99] text-white rounded-2xl p-3 shadow flex flex-col h-26">
          <h4 className="text-xs uppercase tracking-wider opacity-80">Total Number of Equipment</h4>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-2xl font-bold">90</p>
            <div className="w-6 h-6 rounded-full bg-white/30"></div>
          </div>
        </div>
        <div className="bg-gray-100 rounded-2xl p-3 shadow flex flex-col h-26">
          <h4 className="text-xs font-semibold text-gray-600">Available stock</h4>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-2xl font-bold text-gray-900">49</p>
            <div className="w-6 h-6 rounded-full bg-gray-300"></div>
          </div>
        </div>
        <div className="bg-gray-100 rounded-2xl p-3 shadow flex flex-col h-26">
          <h4 className="text-xs font-semibold text-gray-600">Current holder</h4>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-2xl font-bold text-gray-900">41</p>
            <div className="w-6 h-6 rounded-full bg-gray-300"></div>
          </div>
        </div>
      </div>

          {/* Tables */}
          <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Equipment by Category */}
           <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Equipment by Category</h3>
              </div>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr className="text-left">
                      <th className="py-2.5 px-4 font-semibold">Items</th>
                      <th className="py-2.5 px-4 font-semibold">Available</th>
                      <th className="py-2.5 px-4 font-semibold">Total</th>
                      <th className="py-2.5 px-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-blue-50/40">
                      <td className="py-2.5 px-4">Laptop</td>
                      <td className="py-2.5 px-4">23</td>
                      <td className="py-2.5 px-4">30</td>
                      <td className="py-2.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">77% Available</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-50/40">
                      <td className="py-2.5 px-4">Mouse</td>
                      <td className="py-2.5 px-4">23</td>
                      <td className="py-2.5 px-4">30</td>
                      <td className="py-2.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">77% Available</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-50/40">
                      <td className="py-2.5 px-4">Keyboard</td>
                      <td className="py-2.5 px-4">3</td>
                      <td className="py-2.5 px-4">30</td>
                      <td className="py-2.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">10% Available</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* New Arrival */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">New Arrival</h3>
              </div>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr className="text-left">
                      <th className="py-2.5 px-4 font-semibold">Date</th>
                      <th className="py-2.5 px-4 font-semibold">Items</th>
                      <th className="py-2.5 px-4 font-semibold">Available</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-blue-50/40">
                      <td className="py-2.5 px-4">Sept 04 2025</td>
                      <td className="py-2.5 px-4">Laptop</td>
                      <td className="py-2.5 px-4">20</td>
                      <td className="py-2.5 px-4 text-right">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">20</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-50/40">
                      <td className="py-2.5 px-4">Sept 04 2025</td>
                      <td className="py-2.5 px-4">Mouse</td>
                      <td className="py-2.5 px-4">10</td>
                      <td className="py-2.5 px-4 text-right">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">10</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-50/40">
                      <td className="py-2.5 px-4">Sept 04 2025</td>
                      <td className="py-2.5 px-4">Keyboard</td>
                      <td className="py-2.5 px-4">10</td>
                      <td className="py-2.5 px-4 text-right">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">10</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Additional Boxes */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Report Overview */}
           <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Report Overview</h3>
              </div>
              <div className="h-40 bg-gray-100 rounded-xl border border-dashed border-gray-300"></div>
            </div>
            {/* Add Category */}
           <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Add Category</h3>
              </div>
              <div className="h-40 bg-gray-100 rounded-xl border border-dashed border-gray-300"></div>
            </div>
          </div>
          </div>
            </>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
