/**
 * Initializes a React component with proper error handling and fallback behavior
 * @param {string} rootId - The ID of the root element to mount the component
 * @param {React.ComponentType} Component - The React component to render
 * @param {React.ComponentType} [FallbackComponent] - Optional fallback component to render on error
 * @param {number} [retryDelay=200] - Delay in ms before retrying component initialization
 */
export function initReact(rootId, Component, FallbackComponent, retryDelay = 200) {
    if (!window.React || !window.ReactDOM || !window.ReactDOM.createRoot) {
        console.error('React dependencies not loaded');
        return;
    }

    const container = document.getElementById(rootId);
    if (!container) {
        console.error(`Root element #${rootId} not found`);
        return;
    }

    try {
        const root = window.ReactDOM.createRoot(container);
        
        try {
            root.render(window.React.createElement(Component));
            console.log(`Successfully rendered ${Component.name || 'component'} to #${rootId}`);
        } catch (componentError) {
            console.error(`Error rendering component:`, componentError);
            
            if (FallbackComponent) {
                try {
                    root.render(window.React.createElement(FallbackComponent));
                    console.log(`Rendered fallback component for ${rootId}`);
                } catch (fallbackError) {
                    console.error('Error rendering fallback:', fallbackError);
                    renderErrorMessage(container);
                }
            } else {
                renderErrorMessage(container);
            }
        }
    } catch (error) {
        console.error('Critical initialization error:', error);
        renderErrorMessage(container);
    }
}

function renderErrorMessage(container) {
    if (!container) return;
    container.innerHTML = `
        <div style="padding: 20px; background-color: #fee2e2; border: 2px solid #ef4444; border-radius: 6px; margin: 20px;">
            <h3 style="color: #991b1b; margin-bottom: 10px; font-size: 18px;">Component Failed to Load</h3>
            <p style="color: #7f1d1d;">Please try refreshing the page. If the problem persists, contact support.</p>
            <button onclick="window.location.reload()" 
                    style="margin-top: 10px; padding: 8px 16px; background-color: #dc2626; color: white; 
                           border: none; border-radius: 4px; cursor: pointer;">
                Reload Page
            </button>
        </div>
    `;
}