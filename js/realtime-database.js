/**
 * Real-time Database Manager for AnBok Collection
 * Handles real-time data fetching from Books and Stories nodes
 */

class RealtimeDatabaseManager {
    constructor() {
        this.listeners = new Map();
        this.cache = new Map();
        this.isInitialized = false;
    }

    /**
     * Initialize the real-time database manager
     * @param {Object} firebase - Firebase instance
     * @param {Object} database - Database instance
     */
    initialize(firebase, database) {
        if (this.isInitialized) return;
        
        this.firebase = firebase;
        this.database = database;
        this.isInitialized = true;
        
        console.log('RealtimeDatabaseManager initialized');
    }

    /**
     * Set up real-time listener for a specific node
     * @param {string} nodePath - Path to the node (e.g., 'Books', 'Stories')
     * @param {string} itemId - ID of the specific item to watch
     * @param {Function} callback - Callback function when data changes
     * @param {Object} options - Additional options
     */
    setupListener(nodePath, itemId, callback, options = {}) {
        if (!this.isInitialized) {
            console.error('RealtimeDatabaseManager not initialized');
            return null;
        }

        const listenerKey = `${nodePath}_${itemId}`;
        
        // Remove existing listener if any
        this.removeListener(listenerKey);

        try {
            const nodeRef = this.firebase.ref(this.database, nodePath);
            
            // Create the listener
            const listener = this.firebase.onValue(nodeRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    // Find the specific item
                    const item = this.findItemById(data, itemId);
                    if (item) {
                        // Cache the data
                        this.cache.set(listenerKey, item);
                        
                        // Call the callback with the found item
                        callback(item, snapshot);
                    } else {
                        // Item not found
                        callback(null, snapshot);
                    }
                } else {
                    // No data in the node
                    callback(null, snapshot);
                }
            }, (error) => {
                console.error(`Error in ${nodePath} real-time listener:`, error);
                callback(null, null, error);
            });

            // Store the listener reference
            this.listeners.set(listenerKey, {
                ref: nodeRef,
                listener: listener,
                nodePath: nodePath,
                itemId: itemId,
                callback: callback,
                options: options
            });

            console.log(`Real-time listener set up for ${nodePath}/${itemId}`);
            return listener;

        } catch (error) {
            console.error(`Error setting up listener for ${nodePath}/${itemId}:`, error);
            return null;
        }
    }

    /**
     * Set up multiple listeners for different nodes
     * @param {Array} listeners - Array of listener configurations
     */
    setupMultipleListeners(listeners) {
        const results = [];
        
        listeners.forEach(config => {
            const listener = this.setupListener(
                config.nodePath,
                config.itemId,
                config.callback,
                config.options
            );
            
            if (listener) {
                results.push({
                    nodePath: config.nodePath,
                    itemId: config.itemId,
                    listener: listener,
                    success: true
                });
            } else {
                results.push({
                    nodePath: config.nodePath,
                    itemId: config.itemId,
                    success: false,
                    error: 'Failed to setup listener'
                });
            }
        });

        return results;
    }

    /**
     * Remove a specific listener
     * @param {string} listenerKey - Key of the listener to remove
     */
    removeListener(listenerKey) {
        const listenerInfo = this.listeners.get(listenerKey);
        if (listenerInfo) {
            try {
                this.firebase.off(listenerInfo.listener);
                this.listeners.delete(listenerKey);
                this.cache.delete(listenerKey);
                console.log(`Listener removed: ${listenerKey}`);
            } catch (error) {
                console.error(`Error removing listener ${listenerKey}:`, error);
            }
        }
    }

    /**
     * Remove all listeners
     */
    removeAllListeners() {
        const listenerKeys = Array.from(this.listeners.keys());
        
        listenerKeys.forEach(key => {
            this.removeListener(key);
        });

        console.log('All real-time listeners removed');
    }

    /**
     * Get cached data for a specific item
     * @param {string} nodePath - Path to the node
     * @param {string} itemId - ID of the item
     */
    getCachedData(nodePath, itemId) {
        const listenerKey = `${nodePath}_${itemId}`;
        return this.cache.get(listenerKey);
    }

    /**
     * Fetch data once without setting up a listener
     * @param {string} nodePath - Path to the node
     * @param {string} itemId - ID of the specific item
     */
    async fetchDataOnce(nodePath, itemId) {
        if (!this.isInitialized) {
            console.error('RealtimeDatabaseManager not initialized');
            return null;
        }

        try {
            const nodeRef = this.firebase.ref(this.database, nodePath);
            const snapshot = await this.firebase.get(nodeRef);
            const data = snapshot.val();
            
            if (data) {
                const item = this.findItemById(data, itemId);
                return item;
            }
            
            return null;
        } catch (error) {
            console.error(`Error fetching data from ${nodePath}/${itemId}:`, error);
            return null;
        }
    }

    /**
     * Search for items across multiple nodes
     * @param {Array} nodePaths - Array of node paths to search
     * @param {string} itemId - ID of the item to find
     * @param {Function} callback - Callback function when item is found
     */
    async searchAcrossNodes(nodePaths, itemId, callback) {
        const searchPromises = nodePaths.map(async (nodePath) => {
            try {
                const item = await this.fetchDataOnce(nodePath, itemId);
                return { nodePath, item, found: !!item };
            } catch (error) {
                console.error(`Error searching in ${nodePath}:`, error);
                return { nodePath, item: null, found: false, error };
            }
        });

        const results = await Promise.all(searchPromises);
        const foundResult = results.find(result => result.found);
        
        if (foundResult) {
            callback(foundResult.item, foundResult.nodePath);
            return foundResult;
        } else {
            callback(null, null);
            return null;
        }
    }

    /**
     * Find item by ID in the data object
     * @param {Object} data - Data object from Firebase
     * @param {string} itemId - ID to search for
     */
    findItemById(data, itemId) {
        if (!data || typeof data !== 'object') return null;

        // Check if the itemId is a direct key
        if (data[itemId]) {
            return data[itemId];
        }

        // Search through all entries
        const entries = Object.entries(data);
        const foundEntry = entries.find(([key, item]) => {
            // Check various ID fields that might exist
            return (
                item.id === itemId ||
                item.book_id === itemId ||
                item.story_id === itemId ||
                item.uid === itemId ||
                key === itemId
            );
        });

        return foundEntry ? foundEntry[1] : null;
    }

    /**
     * Get listener status
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            activeListeners: this.listeners.size,
            cachedItems: this.cache.size,
            listeners: Array.from(this.listeners.keys())
        };
    }

    /**
     * Cleanup and destroy the manager
     */
    destroy() {
        this.removeAllListeners();
        this.cache.clear();
        this.isInitialized = false;
        console.log('RealtimeDatabaseManager destroyed');
    }
}

// Create global instance
window.realtimeDB = new RealtimeDatabaseManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealtimeDatabaseManager;
} 