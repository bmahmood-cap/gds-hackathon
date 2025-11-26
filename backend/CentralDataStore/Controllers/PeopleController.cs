using Microsoft.AspNetCore.Mvc;
using CentralDataStore.Models;
using CentralDataStore.Services;

namespace CentralDataStore.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PeopleController : ControllerBase
{
    private readonly IPeopleService _peopleService;

    public PeopleController(IPeopleService peopleService)
    {
        _peopleService = peopleService;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Person>> GetAll()
    {
        return Ok(_peopleService.GetAllPeople());
    }

    [HttpGet("{id}")]
    public ActionResult<Person> Get(int id)
    {
        var person = _peopleService.GetPerson(id);
        if (person == null) return NotFound();
        return Ok(person);
    }

    [HttpPost]
    public ActionResult<Person> Create([FromBody] Person person)
    {
        var created = _peopleService.AddPerson(person);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public ActionResult<Person> Update(int id, [FromBody] Person person)
    {
        var updated = _peopleService.UpdatePerson(id, person);
        if (updated == null) return NotFound();
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public ActionResult Delete(int id)
    {
        var deleted = _peopleService.DeletePerson(id);
        if (!deleted) return NotFound();
        return NoContent();
    }

    [HttpGet("connections")]
    public ActionResult<IEnumerable<Connection>> GetConnections()
    {
        return Ok(_peopleService.GetConnections());
    }

    [HttpPost("connections")]
    public ActionResult<Connection> CreateConnection([FromBody] Connection connection)
    {
        var created = _peopleService.AddConnection(connection);
        if (created == null) return BadRequest("Invalid source or target person ID");
        return Ok(created);
    }

    [HttpGet("network")]
    public ActionResult<NetworkData> GetNetworkData()
    {
        return Ok(_peopleService.GetNetworkData());
    }
}
