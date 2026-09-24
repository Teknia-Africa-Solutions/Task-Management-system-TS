// frontend/src/pages/Admin/Files.jsx

import React from 'react';

const Files = ({
  files,
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

  return (
    <div style={{ padding: '16px 24px 24px 24px' }}>
      {/* Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #E8F4E9', borderRadius: '8px', padding: '8px 14px', flex: '1', minWidth: '200px' }}>
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
          style={{ padding: '8px 12px', border: '1px solid #E8F4E9', borderRadius: '8px', background: 'white', color: '#1F2937', fontSize: '13px', cursor: 'pointer' }}
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
          style={{ padding: '8px 12px', border: '1px solid #E8F4E9', borderRadius: '8px', background: 'white', color: '#1F2937', fontSize: '13px', cursor: 'pointer' }}
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
          style={{ padding: '8px 20px', background: '#05620C', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', fontSize: '13px' }}
        >
          Upload File
        </button>
        <input type="file" ref={fileInputRef} onChange={onFileChange} style={{ display: 'none' }} />
      </div>

      {/* Files Table */}
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
    </div>
  );
};

export default Files;