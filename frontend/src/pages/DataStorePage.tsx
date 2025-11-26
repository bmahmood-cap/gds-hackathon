import { useState, useEffect } from 'react';
import { dataApi } from '../services/api';
import type { DataItem } from '../types';
import './DataStorePage.css';

const DataStorePage = () => {
  const [items, setItems] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await dataApi.getAll();
      setItems(data);
      setError(null);
    } catch {
      setError('Failed to load data items. Make sure the backend is running.');
      // Use mock data for demo
      setItems([
        { id: 1, name: 'Customer Database', category: 'Database', description: 'Central customer information repository', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), metadata: {} },
        { id: 2, name: 'Product Catalog', category: 'Catalog', description: 'Complete product listing with details', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), metadata: {} },
        { id: 3, name: 'Analytics Data', category: 'Analytics', description: 'Business intelligence and metrics', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), metadata: {} },
        { id: 4, name: 'Employee Directory', category: 'HR', description: 'Staff information and organizational structure', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), metadata: {} },
        { id: 5, name: 'Financial Records', category: 'Finance', description: 'Transaction history and financial data', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), metadata: {} },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      Database: '🗄️',
      Catalog: '📦',
      Analytics: '📈',
      HR: '👤',
      Finance: '💰',
    };
    return icons[category] || '📁';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="data-store-page">
      <header className="page-header">
        <h1>📊 Central Data Store</h1>
        <p>Browse and manage your organization's data assets</p>
      </header>

      {error && (
        <div className="alert alert-warning">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <span>Loading data...</span>
        </div>
      ) : (
        <div className="content-grid">
          <section className="items-list">
            <h2>Data Assets ({items.length})</h2>
            <div className="items-grid">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`item-card ${selectedItem?.id === item.id ? 'selected' : ''}`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="item-icon">{getCategoryIcon(item.category)}</div>
                  <div className="item-content">
                    <h3>{item.name}</h3>
                    <span className="category-badge">{item.category}</span>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="item-details">
            {selectedItem ? (
              <>
                <h2>Item Details</h2>
                <div className="details-card">
                  <div className="detail-header">
                    <span className="detail-icon">{getCategoryIcon(selectedItem.category)}</span>
                    <div>
                      <h3>{selectedItem.name}</h3>
                      <span className="category-badge large">{selectedItem.category}</span>
                    </div>
                  </div>
                  <div className="detail-body">
                    <div className="detail-row">
                      <label>Description</label>
                      <p>{selectedItem.description}</p>
                    </div>
                    <div className="detail-row">
                      <label>Created</label>
                      <p>{formatDate(selectedItem.createdAt)}</p>
                    </div>
                    <div className="detail-row">
                      <label>Last Updated</label>
                      <p>{formatDate(selectedItem.updatedAt)}</p>
                    </div>
                    <div className="detail-row">
                      <label>ID</label>
                      <p className="mono">{selectedItem.id}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="no-selection">
                <span className="no-selection-icon">👆</span>
                <p>Select an item to view details</p>
              </div>
            )}
          </section>
        </div>
      )}

      <section className="stats-section">
        <h2>Overview Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{items.length}</span>
            <span className="stat-label">Total Items</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{new Set(items.map(i => i.category)).size}</span>
            <span className="stat-label">Categories</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">Active</span>
            <span className="stat-label">Status</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">99.9%</span>
            <span className="stat-label">Uptime</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DataStorePage;
