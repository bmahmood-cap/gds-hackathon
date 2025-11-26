import { useState, useRef, useCallback } from 'react';
import './UploadPage.css';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
}

const UploadPage = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type || 'unknown',
      status: 'pending' as const,
      progress: 0,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleClearAll = () => {
    setFiles([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv')) return '📊';
    if (type.includes('json')) return '📋';
    if (type.includes('text')) return '📝';
    if (type.includes('zip') || type.includes('archive')) return '📦';
    return '📁';
  };

  return (
    <div className="upload-page">
      <header className="page-header">
        <h1>📤 Upload Case Data</h1>
        <p>Import individual and family data into Signify</p>
      </header>

      <div className="upload-notice">
        <span className="notice-icon">ℹ️</span>
        <div className="notice-content">
          <strong>Coming Soon</strong>
          <p>
            Data format specifications are being finalised. You can prepare your case files now, 
            and full upload functionality will be available once the format is defined.
          </p>
        </div>
      </div>

      <div className="upload-content">
        <section className="upload-section">
          <div
            className={`upload-zone ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              className="file-input"
            />
            <div className="upload-icon">📤</div>
            <h3>Drag & Drop Files Here</h3>
            <p>or</p>
            <button className="browse-btn" onClick={handleBrowseClick}>
              Browse Files
            </button>
            <p className="upload-hint">
              Supported formats will be announced soon
            </p>
          </div>

          {files.length > 0 && (
            <div className="files-list">
              <div className="files-header">
                <h3>Selected Files ({files.length})</h3>
                <button className="clear-btn" onClick={handleClearAll}>
                  Clear All
                </button>
              </div>
              <div className="files-grid">
                {files.map((file) => (
                  <div key={file.id} className="file-card">
                    <div className="file-icon">{getFileIcon(file.type)}</div>
                    <div className="file-info">
                      <span className="file-name">{file.name}</span>
                      <span className="file-meta">
                        {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                      </span>
                    </div>
                    <div className="file-status">
                      <span className={`status-badge ${file.status}`}>
                        {file.status === 'pending' && 'Ready'}
                        {file.status === 'uploading' && 'Uploading...'}
                        {file.status === 'success' && 'Uploaded'}
                        {file.status === 'error' && 'Failed'}
                      </span>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveFile(file.id)}
                      title="Remove file"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div className="upload-actions">
                <button className="upload-btn" disabled>
                  <span>Upload Files</span>
                  <span className="btn-icon">→</span>
                </button>
                <p className="action-hint">Upload will be enabled once format is defined</p>
              </div>
            </div>
          )}
        </section>

        <aside className="upload-sidebar">
          <div className="info-card">
            <h4>📋 Upload Guidelines</h4>
            <ul>
              <li>Maximum file size: TBD</li>
              <li>Supported formats: CSV, Excel, JSON</li>
              <li>Multiple files can be uploaded at once</li>
              <li>Files will be validated before processing</li>
            </ul>
          </div>

          <div className="info-card">
            <h4>🔒 Data Security</h4>
            <p>
              All uploaded data is encrypted in transit and at rest. 
              Access controls ensure only authorised council employees can view sensitive case data.
            </p>
          </div>

          <div className="info-card">
            <h4>❓ Need Help?</h4>
            <p>
              Contact the Signify support team for assistance with data formats 
              or upload requirements.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default UploadPage;
