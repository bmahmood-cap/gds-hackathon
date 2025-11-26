namespace CentralDataStore.Models;

public class Person
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public List<int> ConnectionIds { get; set; } = new();
}

public class Connection
{
    public int Id { get; set; }
    public int SourcePersonId { get; set; }
    public int TargetPersonId { get; set; }
    public string RelationType { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class NetworkNode
{
    public int Id { get; set; }
    public string Label { get; set; } = string.Empty;
    public string Group { get; set; } = string.Empty;
}

public class NetworkLink
{
    public int Source { get; set; }
    public int Target { get; set; }
    public string Label { get; set; } = string.Empty;
}

public class NetworkData
{
    public List<NetworkNode> Nodes { get; set; } = new();
    public List<NetworkLink> Links { get; set; } = new();
}
