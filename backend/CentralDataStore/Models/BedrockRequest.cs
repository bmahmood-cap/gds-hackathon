namespace CentralDataStore.Models;

public class BedrockRequest
{
    public string Prompt { get; set; } = string.Empty;
    public string ModelId { get; set; } = "anthropic.claude-3-sonnet-20240229-v1:0";
    public int MaxTokens { get; set; } = 500;
}

public class BedrockResponse
{
    public string Response { get; set; } = string.Empty;
    public bool IsSimulated { get; set; }
    public string ModelUsed { get; set; } = string.Empty;
}
