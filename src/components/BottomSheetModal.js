const { useState, useEffect, useRef } = React;

function BottomSheetModal({ isOpen, onClose, selectedCarWash }) {
    const [activeCarType, setActiveCarType] = useState('small');
    const sheetRef = useRef(null);
    const overlayRef = useRef(null);

    // Handle opening/closing animations
    useEffect(() => {
        if (isOpen) {
            // Add classes for opening animation
            setTimeout(() => {
                if (overlayRef.current) overlayRef.current.classList.add('open');
                if (sheetRef.current) sheetRef.current.classList.add('open');
            }, 10);
        } else {
            // Remove classes for closing animation
            if (overlayRef.current) overlayRef.current.classList.remove('open');
            if (sheetRef.current) sheetRef.current.classList.remove('open');
        }
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Handle overlay click
    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) {
            onClose();
        }
    };

    // Handle drag to close (simplified)
    const handleHandleClick = () => {
        onClose();
    };

    if (!isOpen || !selectedCarWash) return null;

    return (
        <div 
            className="bottom-sheet-overlay" 
            ref={overlayRef}
            onClick={handleOverlayClick}
        >
            <div className="bottom-sheet" ref={sheetRef}>
                <div className="bottom-sheet-handle" onClick={handleHandleClick}></div>
                <div className="bottom-sheet-content">
                    {/* Header */}
                    <div className="sheet-header">
                        <div className="sheet-info">
                            <h2 className="sheet-title">{selectedCarWash.name}</h2>
                            <div className="sheet-detail">
                                <i className="fas fa-phone"></i> {selectedCarWash.phone}
                            </div>
                            <div className="sheet-detail">
                                <i className="fas fa-envelope"></i> {selectedCarWash.email}
                            </div>
                            <div className="sheet-detail">
                                <i className="fas fa-clock"></i> {selectedCarWash.hours}
                            </div>
                            <div className="sheet-detail">
                                <i className="fas fa-map-marker-alt"></i> {selectedCarWash.address}
                            </div>
                        </div>
                        <div className="sheet-logo">
                            <i className="fas fa-car-wash"></i>
                        </div>
                    </div>

                    {/* Car types selection */}
                    {window.carTypes && window.carTypes.map((type) => (
                        <div
                            key={type.id}
                            className={`car-type-box ${activeCarType === type.id ? 'active' : ''}`}
                            onClick={() => setActiveCarType(type.id)}
                        >
                            <div className="car-icon" style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                fontSize: '24px'
                            }}>
                                {type.icon}
                            </div>
                            <span className="car-type-text">{type.name}</span>
                            <span className="car-type-arrow">›</span>
                        </div>
                    ))}

                    {/* Image gallery */}
                    {selectedCarWash.images && selectedCarWash.images.length > 0 && (
                        <div className="image-gallery">
                            <div className="gallery-scroll">
                                {selectedCarWash.images.map((uri, index) => (
                                    <img
                                        key={index}
                                        src={uri}
                                        alt={`Car wash ${index + 1}`}
                                        className="gallery-image"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bottom large image */}
                    <img
                        src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80"
                        alt="Car wash facility"
                        className="bottom-image"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

// Export component
window.BottomSheetModal = BottomSheetModal;
