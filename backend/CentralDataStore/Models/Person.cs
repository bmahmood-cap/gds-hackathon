namespace CentralDataStore.Models;

public class Person
{
    public int Id { get; set; }
    public string? PersonId { get; set; } // Original person_id from dataset
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public List<int> ConnectionIds { get; set; } = new();
    public string RiskScore { get; set; } = "green";
    public Signals Signals { get; set; } = new();
    // Additional fields from dataset
    public int? Age { get; set; }
    public string? AgeGroup { get; set; }
    public string? Gender { get; set; }
    public string? Ethnicity { get; set; }
    public string? HousingTenure { get; set; }
    public string? EmploymentStatus { get; set; }
    public string? IncomeLevel { get; set; }
}

public class Signals
{
    public bool PreviousHomelessness { get; set; }
    public bool TemporaryAccommodation { get; set; }
    public bool CareStatus { get; set; }
    public bool ParentalSubstanceAbuse { get; set; }
    public bool ParentalCrimes { get; set; }
    public bool YouthJustice { get; set; }
    public bool EducationStatus { get; set; }
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
