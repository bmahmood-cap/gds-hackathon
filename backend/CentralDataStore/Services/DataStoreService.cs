using CentralDataStore.Models;

namespace CentralDataStore.Services;

public interface IDataStoreService
{
    List<DataItem> GetAllItems();
    DataItem? GetItem(int id);
    DataItem AddItem(DataItem item);
    DataItem? UpdateItem(int id, DataItem item);
    bool DeleteItem(int id);
}

public class DataStoreService : IDataStoreService
{
    private readonly List<DataItem> _items = new()
    {
        new DataItem { Id = 1, Name = "Customer Database", Category = "Database", Description = "Central customer information repository", CreatedAt = DateTime.UtcNow.AddDays(-30), UpdatedAt = DateTime.UtcNow },
        new DataItem { Id = 2, Name = "Product Catalog", Category = "Catalog", Description = "Complete product listing with details", CreatedAt = DateTime.UtcNow.AddDays(-25), UpdatedAt = DateTime.UtcNow },
        new DataItem { Id = 3, Name = "Analytics Data", Category = "Analytics", Description = "Business intelligence and metrics", CreatedAt = DateTime.UtcNow.AddDays(-20), UpdatedAt = DateTime.UtcNow },
        new DataItem { Id = 4, Name = "Employee Directory", Category = "HR", Description = "Staff information and organizational structure", CreatedAt = DateTime.UtcNow.AddDays(-15), UpdatedAt = DateTime.UtcNow },
        new DataItem { Id = 5, Name = "Financial Records", Category = "Finance", Description = "Transaction history and financial data", CreatedAt = DateTime.UtcNow.AddDays(-10), UpdatedAt = DateTime.UtcNow }
    };

    private int _nextId = 6;

    public List<DataItem> GetAllItems() => _items;

    public DataItem? GetItem(int id) => _items.FirstOrDefault(i => i.Id == id);

    public DataItem AddItem(DataItem item)
    {
        item.Id = _nextId++;
        item.CreatedAt = DateTime.UtcNow;
        item.UpdatedAt = DateTime.UtcNow;
        _items.Add(item);
        return item;
    }

    public DataItem? UpdateItem(int id, DataItem item)
    {
        var existing = _items.FirstOrDefault(i => i.Id == id);
        if (existing == null) return null;

        existing.Name = item.Name;
        existing.Category = item.Category;
        existing.Description = item.Description;
        existing.Metadata = item.Metadata;
        existing.UpdatedAt = DateTime.UtcNow;
        return existing;
    }

    public bool DeleteItem(int id)
    {
        var item = _items.FirstOrDefault(i => i.Id == id);
        if (item == null) return false;
        return _items.Remove(item);
    }
}
