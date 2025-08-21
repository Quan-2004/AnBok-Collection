/**
 * Real-time Database Demo for AnBok Collection
 * Demonstrates how to use the RealtimeDatabaseManager
 */

class RealtimeDatabaseDemo {
    constructor() {
        this.isRunning = false;
        this.demoListeners = [];
    }

    /**
     * Start the demo
     */
    start() {
        if (this.isRunning) {
            console.log('Demo is already running');
            return;
        }

        console.log('Starting Real-time Database Demo...');
        this.isRunning = true;

        // Check if RealtimeDatabaseManager is available
        if (!window.realtimeDB || !window.realtimeDB.isInitialized) {
            console.error('RealtimeDatabaseManager not available');
            this.showDemoStatus('RealtimeDatabaseManager not available');
            return;
        }

        // Show demo status
        this.showDemoStatus('Demo started successfully');

        // Set up demo listeners
        this.setupDemoListeners();

        // Start periodic updates simulation
        this.startPeriodicUpdates();
    }

    /**
     * Stop the demo
     */
    stop() {
        if (!this.isRunning) {
            console.log('Demo is not running');
            return;
        }

        console.log('Stopping Real-time Database Demo...');
        this.isRunning = false;

        // Clean up demo listeners
        this.cleanupDemoListeners();

        // Stop periodic updates
        this.stopPeriodicUpdates();

        this.showDemoStatus('Demo stopped');
    }

    /**
     * Set up demo listeners
     */
    setupDemoListeners() {
        try {
            // Demo listener for Stories
            const storyListener = window.realtimeDB.setupListener('Stories', 'demo-story', (story, snapshot) => {
                if (story) {
                    console.log('Demo: Story updated in real-time:', story);
                    this.updateDemoDisplay('Stories', story);
                }
            }, { autoCleanup: false });

            if (storyListener) {
                this.demoListeners.push({ type: 'Stories', listener: storyListener });
            }

            // Demo listener for Books
            const bookListener = window.realtimeDB.setupListener('Books', 'demo-book', (book, snapshot) => {
                if (book) {
                    console.log('Demo: Book updated in real-time:', book);
                    this.updateDemoDisplay('Books', book);
                }
            }, { autoCleanup: false });

            if (bookListener) {
                this.demoListeners.push({ type: 'Books', listener: bookListener });
            }

            console.log('Demo listeners set up successfully');

        } catch (error) {
            console.error('Error setting up demo listeners:', error);
            this.showDemoStatus('Error setting up demo listeners');
        }
    }

    /**
     * Clean up demo listeners
     */
    cleanupDemoListeners() {
        this.demoListeners.forEach(({ type, listener }) => {
            try {
                window.realtimeDB.removeListener(`${type}_demo-${type.toLowerCase()}`);
                console.log(`Demo listener for ${type} removed`);
            } catch (error) {
                console.error(`Error removing demo listener for ${type}:`, error);
            }
        });

        this.demoListeners = [];
    }

    /**
     * Start periodic updates simulation
     */
    startPeriodicUpdates() {
        this.updateInterval = setInterval(() => {
            if (this.isRunning) {
                this.simulateDataUpdate();
            }
        }, 5000); // Update every 5 seconds
    }

    /**
     * Stop periodic updates
     */
    stopPeriodicUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    /**
     * Simulate data update for demo purposes
     */
    simulateDataUpdate() {
        console.log('Demo: Simulating data update...');
        
        // This would normally update Firebase, but for demo we just log
        const timestamp = new Date().toLocaleTimeString();
        console.log(`Demo: Data update simulated at ${timestamp}`);
        
        // Update demo display
        this.updateDemoDisplay('Demo', { 
            timestamp: timestamp, 
            message: 'Simulated update',
            type: 'demo'
        });
    }

    /**
     * Update demo display
     */
    updateDemoDisplay(type, data) {
        // Create or update demo display element
        let demoDisplay = document.getElementById('demo-display');
        if (!demoDisplay) {
            demoDisplay = document.createElement('div');
            demoDisplay.id = 'demo-display';
            demoDisplay.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 15px;
                border-radius: 10px;
                font-family: monospace;
                font-size: 12px;
                max-width: 300px;
                z-index: 10000;
            `;
            document.body.appendChild(demoDisplay);
        }

        // Update display content
        const timestamp = new Date().toLocaleTimeString();
        demoDisplay.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: bold;">Real-time Demo</div>
            <div>Type: ${type}</div>
            <div>Time: ${timestamp}</div>
            <div>Data: ${JSON.stringify(data, null, 2)}</div>
            <div style="margin-top: 10px; font-size: 10px; opacity: 0.7;">
                Status: ${this.isRunning ? 'Running' : 'Stopped'}
            </div>
        `;
    }

    /**
     * Show demo status
     */
    showDemoStatus(message) {
        console.log('Demo Status:', message);
        
        // Show status in console and optionally in UI
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Real-time Demo',
                text: message,
                icon: 'info',
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
        }
    }

    /**
     * Get demo status
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            activeListeners: this.demoListeners.length,
            listenerTypes: this.demoListeners.map(l => l.type),
            realtimeDBStatus: window.realtimeDB ? window.realtimeDB.getStatus() : 'Not available'
        };
    }

    /**
     * Toggle demo on/off
     */
    toggle() {
        if (this.isRunning) {
            this.stop();
        } else {
            this.start();
        }
    }
}

// Create global demo instance
window.realtimeDemo = new RealtimeDatabaseDemo();

// Add demo controls to the page
function addDemoControls() {
    const controls = document.createElement('div');
    controls.id = 'demo-controls';
    controls.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(74, 99, 102, 0.9);
        color: white;
        padding: 15px;
        border-radius: 10px;
        font-family: Arial, sans-serif;
        z-index: 10001;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;

    controls.innerHTML = `
        <div style="margin-bottom: 10px; font-weight: bold;">Real-time Demo</div>
        <button id="demo-toggle" style="
            background: #F4A261;
            border: none;
            color: white;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            margin-right: 10px;
        ">Start Demo</button>
        <button id="demo-status" style="
            background: #6c757d;
            border: none;
            color: white;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
        ">Status</button>
    `;

    document.body.appendChild(controls);

    // Add event listeners
    document.getElementById('demo-toggle').addEventListener('click', () => {
        window.realtimeDemo.toggle();
        const button = document.getElementById('demo-toggle');
        button.textContent = window.realtimeDemo.isRunning ? 'Stop Demo' : 'Start Demo';
        button.style.background = window.realtimeDemo.isRunning ? '#dc3545' : '#F4A261';
    });

    document.getElementById('demo-status').addEventListener('click', () => {
        const status = window.realtimeDemo.getStatus();
        console.log('Demo Status:', status);
        alert(`Demo Status:\n${JSON.stringify(status, null, 2)}`);
    });
}

// Auto-add demo controls when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addDemoControls);
} else {
    addDemoControls();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealtimeDatabaseDemo;
} 