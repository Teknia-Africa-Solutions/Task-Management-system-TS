// frontend/src/components/admin/Modal.jsx

import React from 'react';

/**
 * Base modal wrapper — reused by all admin modals
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {Function} onClose - Called when user clicks X or backdrop
 * @param {string} title - Modal title
 * @param {number} maxWidth - Max width in px (default: 450)
 * @param {ReactNode} children - Modal content
 */
const Modal = ({ isOpen, onClose, title, maxWidth = 450, children }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: `${maxWidth}px`,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1F2937', margin: 0 }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#6B7280',
              padding: '0 4px',
            }}
            type="button"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;