using CentralDataStore.Models;

namespace CentralDataStore.Services;

public interface IPeopleService
{
    List<Person> GetAllPeople();
    Person? GetPerson(int id);
    Person AddPerson(Person person);
    Person? UpdatePerson(int id, Person person);
    bool DeletePerson(int id);
    List<Connection> GetConnections();
    Connection? AddConnection(Connection connection);
    NetworkData GetNetworkData();
}

public class PeopleService : IPeopleService
{
    private readonly List<Person> _people = new()
    {
        new Person { Id = 1, Name = "Alice Johnson", Email = "alice@example.com", Department = "Engineering", Role = "Senior Developer", ConnectionIds = new List<int> { 2, 3, 5 } },
        new Person { Id = 2, Name = "Bob Smith", Email = "bob@example.com", Department = "Engineering", Role = "Tech Lead", ConnectionIds = new List<int> { 1, 3, 4 } },
        new Person { Id = 3, Name = "Carol Williams", Email = "carol@example.com", Department = "Product", Role = "Product Manager", ConnectionIds = new List<int> { 1, 2, 4, 6 } },
        new Person { Id = 4, Name = "David Brown", Email = "david@example.com", Department = "Design", Role = "UX Designer", ConnectionIds = new List<int> { 2, 3, 5 } },
        new Person { Id = 5, Name = "Eva Martinez", Email = "eva@example.com", Department = "Marketing", Role = "Marketing Lead", ConnectionIds = new List<int> { 1, 4, 6 } },
        new Person { Id = 6, Name = "Frank Chen", Email = "frank@example.com", Department = "Sales", Role = "Sales Director", ConnectionIds = new List<int> { 3, 5 } }
    };

    private readonly List<Connection> _connections = new()
    {
        new Connection { Id = 1, SourcePersonId = 1, TargetPersonId = 2, RelationType = "Colleague", Description = "Work on same team" },
        new Connection { Id = 2, SourcePersonId = 1, TargetPersonId = 3, RelationType = "Project", Description = "Collaborate on Project X" },
        new Connection { Id = 3, SourcePersonId = 1, TargetPersonId = 5, RelationType = "Cross-functional", Description = "Marketing liaison" },
        new Connection { Id = 4, SourcePersonId = 2, TargetPersonId = 3, RelationType = "Stakeholder", Description = "Product review meetings" },
        new Connection { Id = 5, SourcePersonId = 2, TargetPersonId = 4, RelationType = "Project", Description = "Design collaboration" },
        new Connection { Id = 6, SourcePersonId = 3, TargetPersonId = 4, RelationType = "Project", Description = "UX/Product alignment" },
        new Connection { Id = 7, SourcePersonId = 3, TargetPersonId = 6, RelationType = "Business", Description = "Sales enablement" },
        new Connection { Id = 8, SourcePersonId = 4, TargetPersonId = 5, RelationType = "Cross-functional", Description = "Marketing materials design" },
        new Connection { Id = 9, SourcePersonId = 5, TargetPersonId = 6, RelationType = "Partner", Description = "Marketing-Sales pipeline" }
    };

    private int _nextPersonId = 7;
    private int _nextConnectionId = 10;

    public List<Person> GetAllPeople() => _people;

    public Person? GetPerson(int id) => _people.FirstOrDefault(p => p.Id == id);

    public Person AddPerson(Person person)
    {
        person.Id = _nextPersonId++;
        _people.Add(person);
        return person;
    }

    public Person? UpdatePerson(int id, Person person)
    {
        var existing = _people.FirstOrDefault(p => p.Id == id);
        if (existing == null) return null;

        existing.Name = person.Name;
        existing.Email = person.Email;
        existing.Department = person.Department;
        existing.Role = person.Role;
        existing.ConnectionIds = person.ConnectionIds;
        return existing;
    }

    public bool DeletePerson(int id)
    {
        var person = _people.FirstOrDefault(p => p.Id == id);
        if (person == null) return false;
        return _people.Remove(person);
    }

    public List<Connection> GetConnections() => _connections;

    public Connection? AddConnection(Connection connection)
    {
        var sourcePerson = _people.FirstOrDefault(p => p.Id == connection.SourcePersonId);
        var targetPerson = _people.FirstOrDefault(p => p.Id == connection.TargetPersonId);
        
        if (sourcePerson == null || targetPerson == null) return null;

        connection.Id = _nextConnectionId++;
        _connections.Add(connection);

        if (!sourcePerson.ConnectionIds.Contains(connection.TargetPersonId))
            sourcePerson.ConnectionIds.Add(connection.TargetPersonId);
        if (!targetPerson.ConnectionIds.Contains(connection.SourcePersonId))
            targetPerson.ConnectionIds.Add(connection.SourcePersonId);

        return connection;
    }

    public NetworkData GetNetworkData()
    {
        var nodes = _people.Select(p => new NetworkNode
        {
            Id = p.Id,
            Label = p.Name,
            Group = p.Department
        }).ToList();

        var links = _connections.Select(c => new NetworkLink
        {
            Source = c.SourcePersonId,
            Target = c.TargetPersonId,
            Label = c.RelationType
        }).ToList();

        return new NetworkData { Nodes = nodes, Links = links };
    }
}
