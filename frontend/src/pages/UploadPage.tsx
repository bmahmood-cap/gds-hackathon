import { useState, useRef, useCallback } from 'react';
import { comprehendApi } from '../services/api';
import type { ComprehendAnalyzeResponse } from '../types';
import './UploadPage.css';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'uploading' | 'analyzing' | 'success' | 'error';
  progress: number;
  content?: string;
  analysisResult?: ComprehendAnalyzeResponse;
  errorMessage?: string;
}

const UploadPage = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const processFiles = useCallback(async (fileList: FileList) => {
    const textFiles = Array.from(fileList).filter(
      (file) => file.type === 'text/plain' || file.name.endsWith('.txt')
    );

    if (textFiles.length === 0) {
      alert('Please select text files (.txt) for analysis');
      return;
    }

    const newFiles: UploadedFile[] = [];

    for (const file of textFiles) {
      const content = await readFileContent(file);
      newFiles.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type || 'text/plain',
        status: 'pending',
        progress: 0,
        content,
      });
    }

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

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
    if (selectedFileId === id) {
      setSelectedFileId(null);
    }
  };

  const handleClearAll = () => {
    setFiles([]);
    setSelectedFileId(null);
  };

  const analyzeFile = async (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (!file || !file.content) return;

    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, status: 'analyzing' as const } : f
      )
    );

    try {
      const response = await comprehendApi.analyze({ text: file.content });
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, status: 'success' as const, analysisResult: response }
            : f
        )
      );
      setSelectedFileId(fileId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, status: 'error' as const, errorMessage }
            : f
        )
      );
    }
  };

  const analyzeAllFiles = async () => {
    const pendingFiles = files.filter((f) => f.status === 'pending');
    for (const file of pendingFiles) {
      await analyzeFile(file.id);
    }
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

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toUpperCase()) {
      case 'POSITIVE':
        return '#48bb78';
      case 'NEGATIVE':
        return '#f56565';
      case 'MIXED':
        return '#ed8936';
      default:
        return '#a0aec0';
    }
  };

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment.toUpperCase()) {
      case 'POSITIVE':
        return '😊';
      case 'NEGATIVE':
        return '😔';
      case 'MIXED':
        return '😐';
      default:
        return '😶';
    }
  };

  const selectedFile = files.find((f) => f.id === selectedFileId);

  return (
    <div className="upload-page">
      <header className="page-header">
        <h1>📤 Upload Case Data</h1>
        <p>Import text files for AWS Comprehend analysis</p>
      </header>

      <div className="upload-notice">
        <span className="notice-icon">🔍</span>
        <div className="notice-content">
          <strong>Text Analysis with AWS Comprehend</strong>
          <p>
            Upload text files to analyze sentiment, detect entities, and extract key phrases 
            using AWS Comprehend natural language processing.
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
              accept=".txt,text/plain"
              className="file-input"
            />
            <div className="upload-icon">📤</div>
            <h3>Drag & Drop Text Files Here</h3>
            <p>or</p>
            <button className="browse-btn" onClick={handleBrowseClick}>
              Browse Files
            </button>
            <p className="upload-hint">
              Supported format: Text files (.txt)
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
                  <div 
                    key={file.id} 
                    className={`file-card ${selectedFileId === file.id ? 'selected' : ''}`}
                    onClick={() => file.analysisResult && setSelectedFileId(file.id)}
                  >
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
                        {file.status === 'analyzing' && 'Analyzing...'}
                        {file.status === 'success' && 'Analyzed'}
                        {file.status === 'error' && 'Failed'}
                      </span>
                    </div>
                    {file.status === 'pending' && (
                      <button
                        className="analyze-single-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          analyzeFile(file.id);
                        }}
                        title="Analyze this file"
                      >
                        🔍
                      </button>
                    )}
                    <button
                      className="remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile(file.id);
                      }}
                      title="Remove file"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div className="upload-actions">
                <button 
                  className="upload-btn" 
                  onClick={analyzeAllFiles}
                  disabled={!files.some((f) => f.status === 'pending')}
                >
                  <span>Analyze All Files</span>
                  <span className="btn-icon">→</span>
                </button>
                <p className="action-hint">Click to send files to AWS Comprehend for analysis</p>
              </div>
            </div>
          )}

          {selectedFile?.analysisResult && (
            <div className="analysis-results">
              <h3>📊 Analysis Results: {selectedFile.name}</h3>
              
              {selectedFile.analysisResult.isSimulated && (
                <div className="simulated-notice">
                  ⚠️ Running in simulated mode - results are pre-configured for demo purposes
                </div>
              )}

              {selectedFile.analysisResult.sentiment && (
                <div className="result-section">
                  <h4>💭 Sentiment Analysis</h4>
                  <div className="sentiment-result">
                    <span 
                      className="sentiment-badge"
                      style={{ backgroundColor: getSentimentColor(selectedFile.analysisResult.sentiment.sentiment) }}
                    >
                      {getSentimentEmoji(selectedFile.analysisResult.sentiment.sentiment)} {selectedFile.analysisResult.sentiment.sentiment}
                    </span>
                    <div className="sentiment-scores">
                      <div className="score-item">
                        <span className="score-label">Positive</span>
                        <div className="score-bar">
                          <div 
                            className="score-fill positive" 
                            style={{ width: `${selectedFile.analysisResult.sentiment.scores.positive * 100}%` }}
                          />
                        </div>
                        <span className="score-value">{(selectedFile.analysisResult.sentiment.scores.positive * 100).toFixed(1)}%</span>
                      </div>
                      <div className="score-item">
                        <span className="score-label">Negative</span>
                        <div className="score-bar">
                          <div 
                            className="score-fill negative" 
                            style={{ width: `${selectedFile.analysisResult.sentiment.scores.negative * 100}%` }}
                          />
                        </div>
                        <span className="score-value">{(selectedFile.analysisResult.sentiment.scores.negative * 100).toFixed(1)}%</span>
                      </div>
                      <div className="score-item">
                        <span className="score-label">Neutral</span>
                        <div className="score-bar">
                          <div 
                            className="score-fill neutral" 
                            style={{ width: `${selectedFile.analysisResult.sentiment.scores.neutral * 100}%` }}
                          />
                        </div>
                        <span className="score-value">{(selectedFile.analysisResult.sentiment.scores.neutral * 100).toFixed(1)}%</span>
                      </div>
                      <div className="score-item">
                        <span className="score-label">Mixed</span>
                        <div className="score-bar">
                          <div 
                            className="score-fill mixed" 
                            style={{ width: `${selectedFile.analysisResult.sentiment.scores.mixed * 100}%` }}
                          />
                        </div>
                        <span className="score-value">{(selectedFile.analysisResult.sentiment.scores.mixed * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedFile.analysisResult.entities.length > 0 && (
                <div className="result-section">
                  <h4>🏷️ Detected Entities</h4>
                  <div className="entities-list">
                    {selectedFile.analysisResult.entities.map((entity, index) => (
                      <div key={index} className="entity-item">
                        <span className="entity-text">{entity.text}</span>
                        <span className="entity-type">{entity.type}</span>
                        <span className="entity-score">{(entity.score * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedFile.analysisResult.keyPhrases.length > 0 && (
                <div className="result-section">
                  <h4>🔑 Key Phrases</h4>
                  <div className="key-phrases-list">
                    {selectedFile.analysisResult.keyPhrases.map((phrase, index) => (
                      <div key={index} className="key-phrase-item">
                        <span className="phrase-text">{phrase.text}</span>
                        <span className="phrase-score">{(phrase.score * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <aside className="upload-sidebar">
          <div className="info-card">
            <h4>📋 Upload Guidelines</h4>
            <ul>
              <li>Maximum file size: 5MB</li>
              <li>Supported format: Text files (.txt)</li>
              <li>Multiple files can be uploaded at once</li>
              <li>Files will be analyzed using AWS Comprehend</li>
            </ul>
          </div>

          <div className="info-card">
            <h4>🔍 Analysis Features</h4>
            <ul>
              <li><strong>Sentiment:</strong> Detect emotional tone</li>
              <li><strong>Entities:</strong> Find people, places, organizations</li>
              <li><strong>Key Phrases:</strong> Extract important phrases</li>
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
