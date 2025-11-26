using Amazon.Comprehend;
using Amazon.Comprehend.Model;
using CentralDataStore.Models;

namespace CentralDataStore.Services;

public interface IComprehendService
{
    Task<ComprehendAnalyzeResponse> AnalyzeTextAsync(ComprehendAnalyzeRequest request);
    bool IsConnected { get; }
}

public class ComprehendService : IComprehendService
{
    private readonly IAmazonComprehend? _comprehendClient;
    private readonly ILogger<ComprehendService> _logger;
    private readonly bool _isSimulated;

    public bool IsConnected => !_isSimulated;

    public ComprehendService(ILogger<ComprehendService> logger, IConfiguration configuration)
    {
        _logger = logger;

        try
        {
            var awsRegion = configuration["AWS:Region"] ?? "us-east-1";
            var useSimulated = configuration.GetValue<bool>("AWS:UseSimulated", true);

            if (useSimulated)
            {
                _isSimulated = true;
                _logger.LogInformation("Using simulated AWS Comprehend service (demo mode)");
            }
            else
            {
                _comprehendClient = new AmazonComprehendClient(Amazon.RegionEndpoint.GetBySystemName(awsRegion));
                _isSimulated = false;
                _logger.LogInformation("Connected to AWS Comprehend in region: {Region}", awsRegion);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to initialize AWS Comprehend client, using simulated mode");
            _isSimulated = true;
        }
    }

    public async Task<ComprehendAnalyzeResponse> AnalyzeTextAsync(ComprehendAnalyzeRequest request)
    {
        if (_isSimulated)
        {
            return await SimulateResponseAsync(request);
        }

        try
        {
            var response = new ComprehendAnalyzeResponse { IsSimulated = false };

            // Detect sentiment
            var sentimentRequest = new DetectSentimentRequest
            {
                Text = request.Text,
                LanguageCode = request.LanguageCode
            };
            var sentimentResponse = await _comprehendClient!.DetectSentimentAsync(sentimentRequest);
            response.Sentiment = new SentimentResult
            {
                Sentiment = sentimentResponse.Sentiment.Value,
                Scores = new SentimentScores
                {
                    Positive = sentimentResponse.SentimentScore.Positive ?? 0,
                    Negative = sentimentResponse.SentimentScore.Negative ?? 0,
                    Neutral = sentimentResponse.SentimentScore.Neutral ?? 0,
                    Mixed = sentimentResponse.SentimentScore.Mixed ?? 0
                }
            };

            // Detect entities
            var entitiesRequest = new DetectEntitiesRequest
            {
                Text = request.Text,
                LanguageCode = request.LanguageCode
            };
            var entitiesResponse = await _comprehendClient!.DetectEntitiesAsync(entitiesRequest);
            response.Entities = entitiesResponse.Entities.Select(e => new EntityResult
            {
                Text = e.Text,
                Type = e.Type.Value,
                Score = e.Score ?? 0
            }).ToList();

            // Detect key phrases
            var keyPhrasesRequest = new DetectKeyPhrasesRequest
            {
                Text = request.Text,
                LanguageCode = request.LanguageCode
            };
            var keyPhrasesResponse = await _comprehendClient!.DetectKeyPhrasesAsync(keyPhrasesRequest);
            response.KeyPhrases = keyPhrasesResponse.KeyPhrases.Select(kp => new KeyPhraseResult
            {
                Text = kp.Text,
                Score = kp.Score ?? 0
            }).ToList();

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling AWS Comprehend, falling back to simulated response");
            return await SimulateResponseAsync(request);
        }
    }

    private Task<ComprehendAnalyzeResponse> SimulateResponseAsync(ComprehendAnalyzeRequest request)
    {
        var text = request.Text.ToLower();

        // Simulate sentiment based on text content
        var sentiment = "NEUTRAL";
        var positive = 0.25f;
        var negative = 0.25f;
        var neutral = 0.4f;
        var mixed = 0.1f;

        if (text.Contains("homeless") || text.Contains("evict") || text.Contains("crisis") || 
            text.Contains("abuse") || text.Contains("risk") || text.Contains("danger"))
        {
            sentiment = "NEGATIVE";
            positive = 0.1f;
            negative = 0.7f;
            neutral = 0.15f;
            mixed = 0.05f;
        }
        else if (text.Contains("help") || text.Contains("support") || text.Contains("improve") || 
                 text.Contains("success") || text.Contains("progress"))
        {
            sentiment = "POSITIVE";
            positive = 0.65f;
            negative = 0.1f;
            neutral = 0.2f;
            mixed = 0.05f;
        }

        // Simulate entity detection
        var entities = new List<EntityResult>();
        var words = request.Text.Split(new[] { ' ', '\n', '\r', '\t', '.', ',', '!', '?' }, StringSplitOptions.RemoveEmptyEntries);
        
        foreach (var word in words)
        {
            // Simple heuristic: capitalize words might be names or locations
            if (word.Length > 2 && char.IsUpper(word[0]))
            {
                var entityType = word.ToLower() switch
                {
                    var w when w.Contains("council") || w.Contains("nhs") || w.Contains("school") => "ORGANIZATION",
                    var w when w.Contains("london") || w.Contains("street") || w.Contains("road") => "LOCATION",
                    _ => "PERSON"
                };
                
                if (!entities.Any(e => e.Text.Equals(word, StringComparison.OrdinalIgnoreCase)))
                {
                    entities.Add(new EntityResult
                    {
                        Text = word,
                        Type = entityType,
                        Score = 0.85f + (float)(new Random().NextDouble() * 0.1)
                    });
                }
            }
        }

        // Limit to top 10 entities
        entities = entities.Take(10).ToList();

        // Simulate key phrase detection
        var keyPhrases = new List<KeyPhraseResult>();
        var phrases = new[] { "housing support", "mental health", "family breakdown", "social services", 
                              "care placement", "youth worker", "housing officer", "risk assessment",
                              "early intervention", "support network" };
        
        foreach (var phrase in phrases)
        {
            if (text.Contains(phrase))
            {
                keyPhrases.Add(new KeyPhraseResult
                {
                    Text = phrase,
                    Score = 0.9f + (float)(new Random().NextDouble() * 0.08)
                });
            }
        }

        // Add some generic key phrases if none found
        if (keyPhrases.Count == 0)
        {
            keyPhrases.Add(new KeyPhraseResult { Text = "case information", Score = 0.88f });
            keyPhrases.Add(new KeyPhraseResult { Text = "support services", Score = 0.85f });
        }

        return Task.FromResult(new ComprehendAnalyzeResponse
        {
            Sentiment = new SentimentResult
            {
                Sentiment = sentiment,
                Scores = new SentimentScores
                {
                    Positive = positive,
                    Negative = negative,
                    Neutral = neutral,
                    Mixed = mixed
                }
            },
            Entities = entities,
            KeyPhrases = keyPhrases,
            IsSimulated = true
        });
    }
}
