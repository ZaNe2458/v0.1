const { useState, useCallback } = React;

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCarWash, setSelectedCarWash] = useState(null);

    // Handle marker click
    const handleMarkerClick = useCallback((location) => {
        setSelectedCarWash(location);
        setIsModalOpen(true);
    }, []);

    // Handle modal close
    const handleModalClose = useCallback(() => {
        setIsModalOpen(false);
        // Small delay to allow animation to complete before clearing data
        setTimeout(() => {
            if (!isModalOpen) {
                setSelectedCarWash(null);
            }
        }, 300);
    }, [isModalOpen]);

    return (
        <div className="app-container">
            {/* Map View */}
            <window.MapView onMarkerClick={handleMarkerClick} />
            
            {/* Bottom Sheet Modal */}
            <window.BottomSheetModal 
                isOpen={isModalOpen}
                onClose={handleModalClose}
                selectedCarWash={selectedCarWash}
            />
        </div>
    );
}

// Export App component
window.App = App;
