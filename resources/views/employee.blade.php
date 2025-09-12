<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>iREPLY</title>
    <!-- Load React and ReactDOM from CDN first to ensure they're available -->
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    
    <!-- Inline the Employee and SimpleEmployee components for fallback -->
    <script>
        // Fallback Employee component
        window.EmployeeFallback = function() {
            return React.createElement('div', { style: { padding: '20px' } },
                React.createElement('h1', { style: { textAlign: 'center', marginBottom: '20px' } }, 'Employee Directory (Fallback)'),
                React.createElement('div', { style: { 
                    padding: '20px', 
                    backgroundColor: '#e6f7ff', 
                    border: '2px solid #1890ff', 
                    borderRadius: '5px', 
                    margin: '20px',
                    textAlign: 'center'
                } },
                    React.createElement('p', null, 'This is a fallback employee component that loads when the main component fails.')
                )
            );
        };
    </script>
    
    <!-- Then load Vite assets -->
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    
    <script>
        // Global error handler for resource loading failures
        window.addEventListener('error', function(e) {
            if (e.target && (e.target.src || e.target.href)) {
                console.error('Resource failed to load:', e.target.src || e.target.href);
                // If a critical resource fails, we might want to reload or show a message
                if ((e.target.src || e.target.href).includes('app.js')) {
                    console.error('Critical app.js resource failed to load');
                    // Add a reload button immediately
                    addReloadButton();
                }
            }
        }, true); // Use capture to get all events
        
        // Function to add a reload button to the page
        function addReloadButton() {
            const container = document.getElementById('employee-root');
            if (container && container.childNodes.length === 0) {
                const reloadButton = document.createElement('button');
                reloadButton.textContent = 'Reload Page';
                reloadButton.style.padding = '10px 20px';
                reloadButton.style.backgroundColor = '#4CAF50';
                reloadButton.style.color = 'white';
                reloadButton.style.border = 'none';
                reloadButton.style.borderRadius = '5px';
                reloadButton.style.cursor = 'pointer';
                reloadButton.style.margin = '20px auto';
                reloadButton.style.display = 'block';
                reloadButton.onclick = function() {
                    window.location.reload();
                };
                
                const message = document.createElement('div');
                message.textContent = 'React components failed to load properly. Try reloading the page.';
                message.style.textAlign = 'center';
                message.style.margin = '20px';
                message.style.fontSize = '16px';
                
                container.appendChild(message);
                container.appendChild(reloadButton);
            }
        }
    </script>
</head>
<body>
    <div id="employee-root"></div>
    <script>
        console.log('Employee page loaded');
        
        // Initialize React component with a timeout to ensure dependencies are loaded
        setTimeout(() => {
            console.log('Checking React availability...');
            const container = document.getElementById('employee-root');
            
            // If app.js failed to load completely, render the fallback directly
            if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined' && 
                typeof ReactDOM.createRoot !== 'undefined' && container && 
                container.childNodes.length === 0) {
                
                console.log('React is available but component did not render - using direct fallback');
                try {
                    // Try to render the fallback component directly
                    const root = ReactDOM.createRoot(container);
                    if (window.EmployeeFallback) {
                        root.render(React.createElement(window.EmployeeFallback));
                        console.log('Direct fallback rendered successfully');
                    } else {
                        // If fallback component is not available, create a simple message
                        const fallbackDiv = document.createElement('div');
                        fallbackDiv.style.padding = '20px';
                        fallbackDiv.style.backgroundColor = 'lightcoral';
                        fallbackDiv.style.border = '2px solid red';
                        fallbackDiv.style.borderRadius = '5px';
                        fallbackDiv.style.margin = '20px';
                        fallbackDiv.style.fontSize = '24px';
                        fallbackDiv.style.textAlign = 'center';
                        fallbackDiv.textContent = 'React Component Failed to Render';
                        container.appendChild(fallbackDiv);
                        
                        // Add reload button
                        const reloadButton = document.createElement('button');
                        reloadButton.textContent = 'Reload Page';
                        reloadButton.style.padding = '10px 20px';
                        reloadButton.style.backgroundColor = '#4CAF50';
                        reloadButton.style.color = 'white';
                        reloadButton.style.border = 'none';
                        reloadButton.style.borderRadius = '5px';
                        reloadButton.style.cursor = 'pointer';
                        reloadButton.style.margin = '20px auto';
                        reloadButton.style.display = 'block';
                        reloadButton.onclick = function() {
                            window.location.reload();
                        };
                        container.appendChild(reloadButton);
                    }
                } catch (error) {
                    console.error('Error rendering direct fallback:', error);
                    // Create basic fallback UI
                    const fallbackDiv = document.createElement('div');
                    fallbackDiv.style.padding = '20px';
                    fallbackDiv.style.backgroundColor = 'lightcoral';
                    fallbackDiv.style.border = '2px solid red';
                    fallbackDiv.style.borderRadius = '5px';
                    fallbackDiv.style.margin = '20px';
                    fallbackDiv.style.fontSize = '24px';
                    fallbackDiv.style.textAlign = 'center';
                    fallbackDiv.textContent = 'React Component Failed to Load';
                    container.appendChild(fallbackDiv);
                    
                    // Add reload button
                    const reloadButton = document.createElement('button');
                    reloadButton.textContent = 'Reload Page';
                    reloadButton.style.padding = '10px 20px';
                    reloadButton.style.backgroundColor = '#4CAF50';
                    reloadButton.style.color = 'white';
                    reloadButton.style.border = 'none';
                    reloadButton.style.borderRadius = '5px';
                    reloadButton.style.cursor = 'pointer';
                    reloadButton.style.margin = '20px auto';
                    reloadButton.style.display = 'block';
                    reloadButton.onclick = function() {
                        window.location.reload();
                    };
                    container.appendChild(reloadButton);
                }
            } else if (typeof React === 'undefined' || typeof ReactDOM === 'undefined' || typeof ReactDOM.createRoot === 'undefined') {
                console.error('React or ReactDOM not properly loaded after timeout');
                // Show fallback UI if React is not available
                if (container) {
                    // Create error message
                    const errorDiv = document.createElement('div');
                    errorDiv.style.padding = '20px';
                    errorDiv.style.backgroundColor = 'lightcoral';
                    errorDiv.style.border = '2px solid red';
                    errorDiv.style.borderRadius = '5px';
                    errorDiv.style.margin = '20px';
                    errorDiv.style.fontSize = '24px';
                    errorDiv.style.textAlign = 'center';
                    errorDiv.textContent = 'React Component Failed to Load';
                    
                    // Create reload button
                    const reloadButton = document.createElement('button');
                    reloadButton.textContent = 'Reload Page';
                    reloadButton.style.padding = '10px 20px';
                    reloadButton.style.backgroundColor = '#4CAF50';
                    reloadButton.style.color = 'white';
                    reloadButton.style.border = 'none';
                    reloadButton.style.borderRadius = '5px';
                    reloadButton.style.cursor = 'pointer';
                    reloadButton.style.margin = '20px auto';
                    reloadButton.style.display = 'block';
                    reloadButton.onclick = function() {
                        window.location.reload();
                    };
                    
                    // Add elements to container
                    container.appendChild(errorDiv);
                    container.appendChild(reloadButton);
                }
            } else {
                console.log('React component appears to have rendered successfully');
            }
        }, 1000); // Reduced wait time to 1 second for faster fallback
    </script>
</body>
</html>