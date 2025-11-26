using System.Security.Cryptography;
using System.Text;
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
    private readonly List<Person> _people;
    private readonly List<Connection> _connections;
    private int _nextPersonId;
    private int _nextConnectionId;

    public PeopleService(IConfiguration configuration)
    {
        _people = new List<Person>();
        _connections = new List<Connection>();
        
        var csvPath = configuration.GetValue<string>("DatasetPath") ?? "../datasets/homelessness_all_years.csv";
        LoadDataFromCsv(csvPath);
        
        _nextPersonId = _people.Any() ? _people.Max(p => p.Id) + 1 : 1;
        _nextConnectionId = _connections.Any() ? _connections.Max(c => c.Id) + 1 : 1;
    }

    private void LoadDataFromCsv(string csvPath)
    {
        try
        {
            if (!File.Exists(csvPath))
            {
                Console.WriteLine($"CSV file not found at {csvPath}, loading default mock data");
                LoadDefaultMockData();
                return;
            }

            var lines = File.ReadAllLines(csvPath);
            if (lines.Length < 2)
            {
                LoadDefaultMockData();
                return;
            }

            var header = lines[0].Split(',');
            var rows = lines.Skip(1).Take(500).ToList();

            // Select a diverse set of people: high risk youth, medium risk, low risk
            var parsedRows = new List<Dictionary<string, string>>();
            foreach (var line in rows)
            {
                var values = ParseCsvLine(line, header);
                parsedRows.Add(values);
            }

            // Filter for high risk youth
            var highRiskYouth = parsedRows
                .Where(r => (double.TryParse(r["risk_score"], out var score) && score > 0.15) || r["future_homeless"] == "1")
                .Where(r => r["age_group"] == "0‑17" || r["age_group"] == "18‑24")
                .Take(5)
                .ToList();

            // Filter for medium risk
            var mediumRisk = parsedRows
                .Where(r => double.TryParse(r["risk_score"], out var score) && score > 0.08 && score <= 0.15)
                .Where(r => r["age_group"] == "0‑17" || r["age_group"] == "18‑24" || r["age_group"] == "25‑34")
                .Except(highRiskYouth)
                .Take(5)
                .ToList();

            // Filter for low risk
            var lowRisk = parsedRows
                .Where(r => double.TryParse(r["risk_score"], out var score) && score <= 0.08)
                .Except(highRiskYouth)
                .Except(mediumRisk)
                .Take(4)
                .ToList();

            var selected = highRiskYouth.Concat(mediumRisk).Concat(lowRisk).ToList();

            // Worker IDs for connection mapping
            var workerMap = new Dictionary<string, int>
            {
                { "Youth Housing", 1 },
                { "Child Protection", 2 },
                { "Care Leavers", 2 },
                { "Family Support", 3 }
            };

            var usedIds = new HashSet<int>();
            foreach (var row in selected)
            {
                var person = ParsePerson(row, usedIds, workerMap);
                if (person != null)
                {
                    _people.Add(person);
                }
            }

            GenerateConnections();
            Console.WriteLine($"Loaded {_people.Count} people from CSV dataset");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error loading CSV: {ex.Message}, loading default mock data");
            LoadDefaultMockData();
        }
    }

    private Dictionary<string, string> ParseCsvLine(string line, string[] header)
    {
        var values = new Dictionary<string, string>();
        var parts = line.Split(',');
        for (int i = 0; i < Math.Min(header.Length, parts.Length); i++)
        {
            values[header[i]] = parts[i];
        }
        return values;
    }

    private Person? ParsePerson(Dictionary<string, string> row, HashSet<int> usedIds, Dictionary<string, int> workerMap)
    {
        if (!row.TryGetValue("person_id", out var personId) || !row.TryGetValue("name", out var name))
            return null;

        var id = PersonIdToInt(personId);
        while (usedIds.Contains(id)) id++;
        usedIds.Add(id);

        var department = GetDepartment(row);
        var workerId = workerMap.GetValueOrDefault(department, 1);
        var riskCategory = GetRiskCategory(row);
        var connectionIds = new List<int> { workerId };
        
        // High risk individuals get additional connections
        if (riskCategory == "red")
        {
            var additionalWorker = new[] { 1, 2, 3 }.FirstOrDefault(w => w != workerId);
            if (additionalWorker != 0)
                connectionIds.Add(additionalWorker);
        }

        return new Person
        {
            Id = id,
            PersonId = personId,
            Name = name,
            Email = GenerateEmail(name),
            Department = department,
            Role = GetRole(row),
            ConnectionIds = connectionIds,
            RiskScore = riskCategory,
            Signals = GetSignals(row),
            Age = int.TryParse(row.GetValueOrDefault("age", ""), out var age) ? age : null,
            AgeGroup = row.GetValueOrDefault("age_group", null),
            Gender = row.GetValueOrDefault("gender", null),
            Ethnicity = row.GetValueOrDefault("ethnicity", null),
            HousingTenure = row.GetValueOrDefault("housing_tenure", null),
            EmploymentStatus = row.GetValueOrDefault("employment_status", null),
            IncomeLevel = row.GetValueOrDefault("annual_income_bracket", null)
        };
    }

    private int PersonIdToInt(string pid)
    {
        using var md5 = MD5.Create();
        var hash = md5.ComputeHash(Encoding.UTF8.GetBytes(pid));
        return (int)(BitConverter.ToUInt32(hash, 0) % 10000) + 100;
    }

    private string GenerateEmail(string name)
    {
        var parts = name.ToLower().Split(' ');
        if (parts.Length >= 2)
            return $"{parts[0][0]}.{parts[^1].Replace(",", "").Replace(".", "")}@email.com";
        return $"{parts[0]}@email.com";
    }

    private string GetDepartment(Dictionary<string, string> row)
    {
        var housing = row.GetValueOrDefault("housing_tenure", "");
        var ageGroup = row.GetValueOrDefault("age_group", "");
        var tempStatus = row.GetValueOrDefault("temp_accommodation_status", "");
        var socialWorker = row.GetValueOrDefault("social_worker_involvement", "");

        if (!string.IsNullOrEmpty(tempStatus) && tempStatus != "None")
            return "Youth Housing";
        if (socialWorker == "1")
            return "Child Protection";
        if (ageGroup == "0‑17")
            return "Family Support";
        if (housing == "Social housing" || housing == "Homeless/temporary")
            return "Youth Housing";
        if (ageGroup == "18‑24" || ageGroup == "25‑34")
            return "Care Leavers";
        return "Family Support";
    }

    private string GetRole(Dictionary<string, string> row)
    {
        int.TryParse(row.GetValueOrDefault("age", "0"), out var age);
        double.TryParse(row.GetValueOrDefault("risk_score", "0"), out var risk);
        var tempStatus = row.GetValueOrDefault("temp_accommodation_status", "");
        var futureHomeless = row.GetValueOrDefault("future_homeless", "");

        if (age < 18)
            return risk > 0.15 ? "Vulnerable Child" : "At-Risk Child";
        if (age < 25)
        {
            if (!string.IsNullOrEmpty(tempStatus) && tempStatus != "None")
                return "At-Risk Youth";
            return risk > 0.15 ? "At-Risk Youth" : "Young Adult";
        }
        if (futureHomeless == "1" || risk > 0.15)
            return "At-Risk Adult";
        return "Adult";
    }

    private string GetRiskCategory(Dictionary<string, string> row)
    {
        double.TryParse(row.GetValueOrDefault("risk_score", "0"), out var risk);
        var futureHomeless = row.GetValueOrDefault("future_homeless", "");

        if (futureHomeless == "1" || risk > 0.15)
            return "red";
        if (risk > 0.08)
            return "amber";
        return "green";
    }

    private Signals GetSignals(Dictionary<string, string> row)
    {
        return new Signals
        {
            PreviousHomelessness = row.GetValueOrDefault("history_temp_accommodation", "") != "0" && 
                                   row.GetValueOrDefault("history_temp_accommodation", "") != "False" &&
                                   !string.IsNullOrEmpty(row.GetValueOrDefault("history_temp_accommodation", "")),
            TemporaryAccommodation = row.GetValueOrDefault("temp_accommodation_status", "") != "None" &&
                                     !string.IsNullOrEmpty(row.GetValueOrDefault("temp_accommodation_status", "")),
            CareStatus = row.GetValueOrDefault("social_worker_involvement", "") == "1",
            ParentalSubstanceAbuse = row.GetValueOrDefault("familiar_domestic_abuse_flag", "") == "1",
            ParentalCrimes = row.GetValueOrDefault("eviction_flag", "") == "1",
            YouthJustice = row.GetValueOrDefault("youth_justice_history", "") == "1",
            EducationStatus = row.GetValueOrDefault("school_attendance", "") != "Full" &&
                              row.GetValueOrDefault("school_attendance", "") != "N/A" &&
                              !string.IsNullOrEmpty(row.GetValueOrDefault("school_attendance", ""))
        };
    }

    private void GenerateConnections()
    {
        var connectionId = 1;
        var addedPairs = new HashSet<(int, int)>();

        foreach (var person in _people)
        {
            foreach (var targetId in person.ConnectionIds)
            {
                var pair = (Math.Min(person.Id, targetId), Math.Max(person.Id, targetId));
                if (!addedPairs.Contains(pair))
                {
                    addedPairs.Add(pair);
                    var relationType = GetRelationType(person.Department);
                    _connections.Add(new Connection
                    {
                        Id = connectionId++,
                        SourcePersonId = person.Id,
                        TargetPersonId = targetId,
                        RelationType = relationType,
                        Description = $"{relationType} relationship"
                    });
                }
            }
        }
    }

    private string GetRelationType(string department)
    {
        return department switch
        {
            "Youth Housing" => "Housing Support",
            "Child Protection" => "Case Worker",
            "Care Leavers" => "Care Support",
            "Family Support" => "Family Support",
            _ => "Support"
        };
    }

    private void LoadDefaultMockData()
    {
        _people.AddRange(new List<Person>
        {
            new() { Id = 101, Name = "Ryan Munoz", Email = "r.munoz@email.com", Department = "Youth Housing", Role = "Vulnerable Child", ConnectionIds = new List<int> { 1, 2 }, RiskScore = "red", Signals = new Signals { PreviousHomelessness = true, TemporaryAccommodation = true }, Age = 16, AgeGroup = "0‑17", Gender = "Female", Ethnicity = "White‑British", HousingTenure = "Private rented" },
            new() { Id = 102, Name = "Matthew Foster", Email = "m.foster@email.com", Department = "Care Leavers", Role = "At-Risk Youth", ConnectionIds = new List<int> { 2, 1 }, RiskScore = "red", Signals = new Signals { ParentalSubstanceAbuse = true }, Age = 21, AgeGroup = "18‑24", Gender = "Male", Ethnicity = "White‑British", HousingTenure = "Owner‑occupied" },
            new() { Id = 103, Name = "Jessica Callahan", Email = "j.callahan@email.com", Department = "Family Support", Role = "At-Risk Child", ConnectionIds = new List<int> { 3, 1 }, RiskScore = "red", Signals = new Signals(), Age = 13, AgeGroup = "0‑17", Gender = "Female", Ethnicity = "White‑British", HousingTenure = "Homeless/temporary" },
            new() { Id = 104, Name = "Abigail Shaffer", Email = "a.shaffer@email.com", Department = "Youth Housing", Role = "Adult", ConnectionIds = new List<int> { 1 }, RiskScore = "amber", Signals = new Signals { ParentalSubstanceAbuse = true }, Age = 25, AgeGroup = "25‑34", Gender = "Female", Ethnicity = "Mixed", HousingTenure = "Social housing" },
            new() { Id = 105, Name = "Lisa Hensley", Email = "l.hensley@email.com", Department = "Youth Housing", Role = "At-Risk Youth", ConnectionIds = new List<int> { 1 }, RiskScore = "amber", Signals = new Signals { PreviousHomelessness = true, TemporaryAccommodation = true }, Age = 22, AgeGroup = "18‑24", Gender = "Female", Ethnicity = "Black‑Caribbean", HousingTenure = "Social housing" },
            new() { Id = 106, Name = "Allison Hill", Email = "a.hill@email.com", Department = "Care Leavers", Role = "Young Adult", ConnectionIds = new List<int> { 2 }, RiskScore = "green", Signals = new Signals(), Age = 19, AgeGroup = "18‑24", Gender = "Male", Ethnicity = "White‑British", HousingTenure = "Owner‑occupied" },
        });

        GenerateConnections();
    }

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
        existing.RiskScore = person.RiskScore;
        existing.Signals = person.Signals;
        existing.Age = person.Age;
        existing.AgeGroup = person.AgeGroup;
        existing.Gender = person.Gender;
        existing.Ethnicity = person.Ethnicity;
        existing.HousingTenure = person.HousingTenure;
        existing.EmploymentStatus = person.EmploymentStatus;
        existing.IncomeLevel = person.IncomeLevel;
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

        var nodeIds = new HashSet<int>(_people.Select(p => p.Id));
        
        // Only include links where both source and target nodes exist
        var links = _connections
            .Where(c => nodeIds.Contains(c.SourcePersonId) && nodeIds.Contains(c.TargetPersonId))
            .Select(c => new NetworkLink
            {
                Source = c.SourcePersonId,
                Target = c.TargetPersonId,
                Label = c.RelationType
            }).ToList();

        return new NetworkData { Nodes = nodes, Links = links };
    }
}
