using CentralDataStore.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Register application services
builder.Services.AddSingleton<IDataStoreService, DataStoreService>();
builder.Services.AddSingleton<IPeopleService, PeopleService>();
builder.Services.AddSingleton<IBedrockService, BedrockService>();
builder.Services.AddSingleton<IComprehendService, ComprehendService>();

// Add CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowReactApp");
app.MapControllers();

// Health check endpoint
app.MapGet("/health", () => new { Status = "Healthy", Timestamp = DateTime.UtcNow });

app.Run();
