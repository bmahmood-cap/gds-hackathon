using Microsoft.AspNetCore.Mvc;
using CentralDataStore.Models;
using CentralDataStore.Services;

namespace CentralDataStore.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BedrockController : ControllerBase
{
    private readonly IBedrockService _bedrockService;

    public BedrockController(IBedrockService bedrockService)
    {
        _bedrockService = bedrockService;
    }

    [HttpPost("invoke")]
    public async Task<ActionResult<BedrockResponse>> Invoke([FromBody] BedrockRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Prompt))
        {
            return BadRequest("Prompt is required");
        }

        var response = await _bedrockService.InvokeModelAsync(request);
        return Ok(response);
    }

    [HttpGet("status")]
    public ActionResult<object> GetStatus()
    {
        return Ok(new
        {
            Connected = _bedrockService.IsConnected,
            Mode = _bedrockService.IsConnected ? "Live" : "Simulated",
            Message = _bedrockService.IsConnected 
                ? "Connected to AWS Bedrock" 
                : "Running in simulation mode - responses are pre-configured for demo purposes"
        });
    }
}
