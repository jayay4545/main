<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>iREPLY - View Approved</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- React CDN (development version) -->
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    
    <!-- Vite Assets -->
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
    </style>
</head>
<body class="antialiased">
    <div id="viewapproved-root"></div>
    
    <script>
        // Wait for React components to be available
        setTimeout(() => {
            try {
                // Check if React and ReactDOM are available
                if (window.React && window.ReactDOM && window.ViewApproved) {
                    // Render the ViewApproved component
                    const root = ReactDOM.createRoot(document.getElementById('viewapproved-root'));
                    root.render(React.createElement(window.ViewApproved));
                } else {
                    console.error('Components not available:', { 
                        React: !!window.React, 
                        ReactDOM: !!window.ReactDOM, 
                        ViewApproved: !!window.ViewApproved 
                    });
                    document.getElementById('viewapproved-root').innerHTML = `
                        <div class="min-h-screen bg-gray-100 flex justify-center items-center p-4">
                            <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
                                <h2 class="text-2xl font-bold text-red-600 mb-4">Error Loading View Approved</h2>
                                <p class="text-gray-700 mb-4">The ViewApproved component could not be loaded. Please try again later.</p>
                                <button onclick="window.location.reload()" 
                                        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                                    Reload Page
                                </button>
                            </div>
                        </div>
                    `;
                }
            } catch (error) {
                console.error('Error rendering ViewApproved component:', error);
                document.getElementById('viewapproved-root').innerHTML = `
                    <div class="min-h-screen bg-gray-100 flex justify-center items-center p-4">
                        <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
                            <h2 class="text-2xl font-bold text-red-600 mb-4">Error</h2>
                            <p class="text-gray-700 mb-4">An error occurred while loading the View Approved page: ${error.message}</p>
                            <button onclick="window.location.reload()" 
                                    class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                                Reload Page
                            </button>
                        </div>
                    </div>
                `;
            }
        }, 500); // Short delay to ensure components are loaded
    </script>
</body>
</html>