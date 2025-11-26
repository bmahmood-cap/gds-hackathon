using Microsoft.AspNetCore.Mvc;
using CentralDataStore.Models;
using CentralDataStore.Services;

namespace CentralDataStore.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ComprehendController : ControllerBase
{
    private readonly IComprehendService _comprehendService;

    public ComprehendController(IComprehendService comprehendService)
    {
        _comprehendService = comprehendService;
    }

    [HttpPost("analyze")]
    public async Task<ActionResult<ComprehendAnalyzeResponse>> Analyze([FromBody] ComprehendAnalyzeRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Text))
        {
            return BadRequest("Text is required");
        }

        var response = await _comprehendService.AnalyzeTextAsync(request);
        return Ok(response);
    }

    [HttpGet("status")]
    public ActionResult<object> GetStatus()
    {
        return Ok(new
        {
            Connected = _comprehendService.IsConnected,
            Mode = _comprehendService.IsConnected ? "Live" : "Simulated",
            Message = _comprehendService.IsConnected
                ? "Connected to AWS Comprehend"
                : "Running in simulation mode - responses are pre-configured for demo purposes"
        });
    }
}
