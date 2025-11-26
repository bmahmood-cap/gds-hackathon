namespace CentralDataStore.Models;

public class ComprehendAnalyzeRequest
{
    public string Text { get; set; } = string.Empty;
    public string LanguageCode { get; set; } = "en";
}

public class ComprehendAnalyzeResponse
{
    public SentimentResult? Sentiment { get; set; }
    public List<EntityResult> Entities { get; set; } = new();
    public List<KeyPhraseResult> KeyPhrases { get; set; } = new();
    public bool IsSimulated { get; set; }
}

public class SentimentResult
{
    public string Sentiment { get; set; } = string.Empty;
    public SentimentScores Scores { get; set; } = new();
}

public class SentimentScores
{
    public float Positive { get; set; }
    public float Negative { get; set; }
    public float Neutral { get; set; }
    public float Mixed { get; set; }
}

public class EntityResult
{
    public string Text { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public float Score { get; set; }
}

public class KeyPhraseResult
{
    public string Text { get; set; } = string.Empty;
    public float Score { get; set; }
}
