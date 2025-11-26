using Amazon.BedrockRuntime;
using Amazon.BedrockRuntime.Model;
using CentralDataStore.Models;
using System.Text;
using System.Text.Json;

namespace CentralDataStore.Services;

public interface IBedrockService
{
    Task<BedrockResponse> InvokeModelAsync(BedrockRequest request);
    bool IsConnected { get; }
}

public class BedrockService : IBedrockService
{
    private readonly IAmazonBedrockRuntime? _bedrockClient;
    private readonly ILogger<BedrockService> _logger;
    private readonly bool _isSimulated;

    public bool IsConnected => !_isSimulated;

    public BedrockService(ILogger<BedrockService> logger, IConfiguration configuration)
    {
        _logger = logger;
        
        // Try to initialize AWS Bedrock client
        // In development/demo mode, we'll use simulated responses
        try
        {
            var awsRegion = configuration["AWS:Region"] ?? "us-east-1";
            var useSimulated = configuration.GetValue<bool>("AWS:UseSimulated", true);
            
            if (useSimulated)
            {
                _isSimulated = true;
                _logger.LogInformation("Using simulated AWS Bedrock service (demo mode)");
            }
            else
            {
                _bedrockClient = new AmazonBedrockRuntimeClient(Amazon.RegionEndpoint.GetBySystemName(awsRegion));
                _isSimulated = false;
                _logger.LogInformation("Connected to AWS Bedrock in region: {Region}", awsRegion);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to initialize AWS Bedrock client, using simulated mode");
            _isSimulated = true;
        }
    }

    public async Task<BedrockResponse> InvokeModelAsync(BedrockRequest request)
    {
        if (_isSimulated)
        {
            return await SimulateResponseAsync(request);
        }

        try
        {
            var payload = new
            {
                anthropic_version = "bedrock-2023-05-31",
                max_tokens = request.MaxTokens,
                messages = new[]
                {
                    new { role = "user", content = request.Prompt }
                }
            };

            var invokeRequest = new InvokeModelRequest
            {
                ModelId = request.ModelId,
                ContentType = "application/json",
                Accept = "application/json",
                Body = new MemoryStream(Encoding.UTF8.GetBytes(JsonSerializer.Serialize(payload)))
            };

            var response = await _bedrockClient!.InvokeModelAsync(invokeRequest);
            
            using var reader = new StreamReader(response.Body);
            var responseBody = await reader.ReadToEndAsync();
            var jsonResponse = JsonSerializer.Deserialize<JsonElement>(responseBody);
            
            var content = jsonResponse.GetProperty("content")[0].GetProperty("text").GetString();

            return new BedrockResponse
            {
                Response = content ?? "No response generated",
                IsSimulated = false,
                ModelUsed = request.ModelId
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error invoking Bedrock model");
            return await SimulateResponseAsync(request);
        }
    }

    private Task<BedrockResponse> SimulateResponseAsync(BedrockRequest request)
    {
        // Simulated AI responses for demo purposes
        var simulatedResponses = new Dictionary<string, string>
        {
            { "network", "Based on the network analysis, the central data store shows strong connectivity patterns between the Engineering and Product departments. Key influencers in the network include individuals with cross-functional roles." },
            { "connection", "The connection analysis reveals clusters of related teams. Recommendations for improving collaboration: 1) Establish regular cross-team sync meetings 2) Create shared communication channels 3) Implement project-based working groups." },
            { "data", "The central data store contains well-organized information across multiple categories. Suggested optimizations: 1) Add tagging for better discoverability 2) Implement access controls 3) Set up automated data quality checks." },
            { "default", "I've analyzed your request. The central data store provides a comprehensive view of your organization's data assets and people networks. Key insights: strong interdepartmental collaboration, well-maintained data catalogs, and clear organizational structure." }
        };

        var promptLower = request.Prompt.ToLower();
        var responseText = simulatedResponses.FirstOrDefault(kvp => promptLower.Contains(kvp.Key)).Value 
                          ?? simulatedResponses["default"];

        return Task.FromResult(new BedrockResponse
        {
            Response = responseText,
            IsSimulated = true,
            ModelUsed = $"{request.ModelId} (simulated)"
        });
    }
}
