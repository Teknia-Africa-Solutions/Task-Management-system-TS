// frontend/src/pages/Admin/Files.jsx

import React from 'react';

const Files = ({
  files,
  isMobile,
  searchTerm,
  fileTypeFilter,
  setFileTypeFilter,
  fileProjectFilter,
  setFileProjectFilter,
  onUploadClick,
  onFileChange,
  onDelete,
  fileInputRef,
}) => {
  const filteredFiles = files.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = fileTypeFilter === 'all' || f.type === fileTypeFilter;
    const matchesProject = fileProjectFilter === 'all' || f.project === fileProjectFilter;
    return matchesSearch && matchesType && matchesProject;
  });

  const getFileIcon = (type) => {
    if (type === 'Image') return '🖼️';
    if (type === 'PDF') return '📄';
    if (type === 'SQL') return '💻';
    if (type === 'Spreadsheet') return '📊';
    return '📁';
  };

  return (
    <div style={{ padding: isMobile ? '12px' : '16px 24px 24px 24px', overflowX: 'hidden' }}>
      {/* Controls */}
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px',
          alignItems: isMobile ? 'stretch' : 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'white',
            border: '1px solid #E8F4E9',
            borderRadius: '8px',
            padding: '8px 14px',
            flex: '1',
            minWidth: isMobile ? '100%' : '200px',
          }}
        >
          <span style={{ color: '#6B7280', fontSize: '16px', fontWeight: '400' }}>⌕</span>
          <input
            type="text"
            placeholder="Search files..."
            style={{ border: 'none', outline: 'none', flex: 1, fontSize: '13px', background: 'transparent', color: '#1F2937' }}
            value={searchTerm}
            readOnly
          />
        </div>

        <select
          style={{
            padding: '8px 12px',
            border: '1px solid #E8F4E9',
            borderRadius: '8px',
            background: 'white',
            color: '#1F2937',
            fontSize: '13px',
            cursor: 'pointer',
            width: isMobile ? '100%' : 'auto',
          }}
          value={fileTypeFilter}
          onChange={(e) => setFileTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="Image">Image</option>
          <option value="PDF">PDF</option>
          <option value="SQL">SQL</option>
          <option value="Spreadsheet">Spreadsheet</option>
        </select>

        <select
          style={{
            padding: '8px 12px',
            border: '1px solid #E8F4E9',
            borderRadius: '8px',
            background: 'white',
            color: '#1F2937',
            fontSize: '13px',
            cursor: 'pointer',
            width: isMobile ? '100%' : 'auto',
          }}
          value={fileProjectFilter}
          onChange={(e) => setFileProjectFilter(e.target.value)}
        >
          <option value="all">All Projects</option>
          <option value="API Server">API Server</option>
          <option value="Website Redesign">Website Redesign</option>
          <option value="Mobile App">Mobile App</option>
          <option value="QA">QA</option>
          <option value="DevOps">DevOps</option>
        </select>

        <button
          onClick={onUploadClick}
          style={{
            padding: '8px 20px',
            background: '#05620C',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '500',
            cursor: 'pointer',
            fontSize: '13px',
            width: isMobile ? '100%' : 'auto',
          }}
        >
          Upload File
        </button>
        <input type="file" ref={fileInputRef} onChange={onFileChange} style={{ display: 'none' }} />
      </div>

      {/* MOBILE: Card layout */}
      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredFiles.length === 0 ? (
            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center',
                color: '#6B7280',
                border: '1px solid #E8F4E9',
              }}
            >
              <p>No files found.</p>
            </div>
          ) : (
            filteredFiles.map((f) => (
              <div
                key={f.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #E8F4E9',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                }}
              >
                {/* Header: Icon + Name */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '14px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #F3F4F6',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      background: '#E8F4E9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      flexShrink: 0,
                    }}
                  >
                    {getFileIcon(f.type)}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1F2937',
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {f.name}
                    </p>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 0 0' }}>
                      {f.type} • {f.size}
                    </p>
                  </div>
                </div>

                {/* Details: Label + Value rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                      Uploaded By
                    </span>
                    <span style={{ fontSize: '13px', color: '#1F2937', fontWeight: '500' }}>
                      {f.uploader}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                      Project
                    </span>
                    <span style={{ fontSize: '13px', color: '#1F2937', fontWeight: '500' }}>
                      {f.project}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid #F3F4F6' }}>
                  <button
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: '1px solid #E8F4E9',
                      borderRadius: '8px',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: '#1F2937',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download
                  </button>
                  <button
                    onClick={() => onDelete(f.id)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: '1px solid #E8F4E9',
                      borderRadius: '8px',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: '#EF4444',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* DESKTOP: Table layout (unchanged) */
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E8F4E9' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E8F4E9', background: '#F8FAF8' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Type</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Size</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Uploaded By</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Project</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((f) => (
                  <tr key={f.id} style={{ borderBottom: '1px solid #E8F4E9' }}>
                    <td style={{ padding: '10px 16px' }}>{f.name}</td>
                    <td style={{ padding: '10px 16px', color: '#6B7280', fontSize: '13px' }}>{f.type}</td>
                    <td style={{ padding: '10px 16px', color: '#6B7280', fontSize: '13px' }}>{f.size}</td>
                    <td style={{ padding: '10px 16px', color: '#6B7280', fontSize: '13px' }}>{f.uploader}</td>
                    <td style={{ padding: '10px 16px', color: '#6B7280', fontSize: '13px' }}>{f.project}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                      <button style={{ padding: '4px 6px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px', color: '#6B7280' }} title="Download">⬇</button>
                      <button
                        onClick={() => onDelete(f.id)}
                        style={{ padding: '4px 6px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#1F2937', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Delete"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Files;