using Microsoft.AspNetCore.Mvc;
using CentralDataStore.Models;
using CentralDataStore.Services;

namespace CentralDataStore.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DataController : ControllerBase
{
    private readonly IDataStoreService _dataService;

    public DataController(IDataStoreService dataService)
    {
        _dataService = dataService;
    }

    [HttpGet]
    public ActionResult<IEnumerable<DataItem>> GetAll()
    {
        return Ok(_dataService.GetAllItems());
    }

    [HttpGet("{id}")]
    public ActionResult<DataItem> Get(int id)
    {
        var item = _dataService.GetItem(id);
        if (item == null) return NotFound();
        return Ok(item);
    }

    [HttpPost]
    public ActionResult<DataItem> Create([FromBody] DataItem item)
    {
        var created = _dataService.AddItem(item);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public ActionResult<DataItem> Update(int id, [FromBody] DataItem item)
    {
        var updated = _dataService.UpdateItem(id, item);
        if (updated == null) return NotFound();
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public ActionResult Delete(int id)
    {
        var deleted = _dataService.DeleteItem(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}
