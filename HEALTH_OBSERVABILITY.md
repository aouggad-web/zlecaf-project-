# Health Observability Documentation

## Overview

The ZLECAf API includes comprehensive health monitoring capabilities to ensure system reliability and facilitate troubleshooting. This document describes the health check endpoint, monitoring strategies, and best practices for observability.

## Health Check Endpoint

### Endpoint Details

**URL**: `/api/health`  
**Method**: `GET`  
**Authentication**: None required  
**Rate Limiting**: No rate limit

### Response Format

```json
{
  "status": "healthy" | "unhealthy",
  "timestamp": "ISO 8601 timestamp",
  "service": "ZLECAf API",
  "version": "2.0.0",
  "checks": {
    "database": {
      "status": "healthy" | "unhealthy",
      "message": "Status description"
    },
    "external_apis": {
      "world_bank": "configured",
      "oec": "configured"
    }
  }
}
```

### Example Responses

#### Healthy System

```json
{
  "status": "healthy",
  "timestamp": "2024-10-08T14:30:00.000Z",
  "service": "ZLECAf API",
  "version": "2.0.0",
  "checks": {
    "database": {
      "status": "healthy",
      "message": "MongoDB connection successful"
    },
    "external_apis": {
      "world_bank": "configured",
      "oec": "configured"
    }
  }
}
```

#### Unhealthy System

```json
{
  "status": "unhealthy",
  "timestamp": "2024-10-08T14:35:00.000Z",
  "service": "ZLECAf API",
  "version": "2.0.0",
  "checks": {
    "database": {
      "status": "unhealthy",
      "message": "MongoDB connection failed: Connection timeout"
    },
    "external_apis": {
      "world_bank": "configured",
      "oec": "configured"
    }
  }
}
```

## Health Checks Performed

### 1. Database Connectivity

**Check**: MongoDB connection and responsiveness  
**Implementation**: Executes a `ping` command to MongoDB  
**Success Criteria**: Command completes without exception  
**Failure Impact**: Critical - API cannot persist or retrieve data

### 2. External API Configuration

**Check**: World Bank and OEC API client initialization  
**Implementation**: Verifies clients are configured  
**Success Criteria**: Client objects exist and are initialized  
**Failure Impact**: Moderate - Some features may be unavailable

## Usage Examples

### Command Line (curl)

```bash
# Basic health check
curl http://localhost:8000/api/health

# Pretty printed with jq
curl -s http://localhost:8000/api/health | jq

# Save response to file
curl -o health-status.json http://localhost:8000/api/health
```

### Python

```python
import requests

response = requests.get('http://localhost:8000/api/health')
health_data = response.json()

if health_data['status'] == 'healthy':
    print("✅ System is healthy")
else:
    print("❌ System is unhealthy")
    print(f"Issues: {health_data['checks']}")
```

### JavaScript/TypeScript

```javascript
async function checkHealth() {
  try {
    const response = await fetch('http://localhost:8000/api/health');
    const health = await response.json();
    
    if (health.status === 'healthy') {
      console.log('✅ System is healthy');
      return true;
    } else {
      console.error('❌ System is unhealthy', health.checks);
      return false;
    }
  } catch (error) {
    console.error('Failed to check health:', error);
    return false;
  }
}
```

## Monitoring Strategies

### 1. Continuous Monitoring

Set up a monitoring service to poll the health endpoint regularly:

```bash
# Example: Poll every 30 seconds
*/30 * * * * curl -f http://localhost:8000/api/health || echo "Health check failed"
```

### 2. Container Health Checks

#### Docker Compose

```yaml
services:
  api:
    image: zlecaf-api
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

#### Kubernetes

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: zlecaf-api
spec:
  containers:
  - name: api
    image: zlecaf-api
    livenessProbe:
      httpGet:
        path: /api/health
        port: 8000
      initialDelaySeconds: 30
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /api/health
        port: 8000
      initialDelaySeconds: 5
      periodSeconds: 5
```

### 3. Alerting

Configure alerts based on health status:

**Alert Conditions:**
- Health endpoint returns non-200 status code
- Response contains `"status": "unhealthy"`
- Health endpoint doesn't respond within 5 seconds
- Multiple consecutive failed checks

**Example Alert Script:**

```bash
#!/bin/bash

HEALTH_URL="http://localhost:8000/api/health"
ALERT_EMAIL="admin@example.com"

response=$(curl -s -w "%{http_code}" $HEALTH_URL)
http_code="${response: -3}"
body="${response:0:${#response}-3}"

if [ "$http_code" != "200" ]; then
  echo "Alert: Health check failed with HTTP $http_code" | mail -s "ZLECAf API Alert" $ALERT_EMAIL
fi

status=$(echo $body | jq -r '.status')
if [ "$status" == "unhealthy" ]; then
  echo "Alert: System is unhealthy: $body" | mail -s "ZLECAf API Alert" $ALERT_EMAIL
fi
```

## Logging

Health check failures are logged to the application logs:

```python
# Example log entry
2024-10-08 14:35:00,123 - __main__ - ERROR - Database health check failed: Connection timeout
```

### Log Locations

- **Development**: Console output
- **Production**: Configured log file or log aggregation service

### Log Levels

- `INFO`: Health check performed successfully
- `ERROR`: Health check failed with details

## Metrics Collection

### Recommended Metrics

1. **Availability**
   - Uptime percentage
   - Health check success rate
   - Time to recovery after failure

2. **Performance**
   - Health check response time
   - Database query latency
   - API endpoint response times

3. **Resource Usage**
   - CPU utilization
   - Memory consumption
   - Database connection pool status

### Prometheus Integration Example

```python
from prometheus_client import Counter, Histogram

health_check_counter = Counter('health_checks_total', 'Total health checks')
health_check_failures = Counter('health_check_failures_total', 'Failed health checks')
health_check_duration = Histogram('health_check_duration_seconds', 'Health check duration')

@api_router.get("/health")
async def health_check():
    with health_check_duration.time():
        health_check_counter.inc()
        try:
            # ... health check logic ...
            return health_status
        except Exception as e:
            health_check_failures.inc()
            raise
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Failure

**Symptom**: `"database": {"status": "unhealthy"}`

**Possible Causes:**
- MongoDB is not running
- Incorrect connection string in `.env`
- Network connectivity issues
- MongoDB authentication failure

**Resolution:**
```bash
# Check if MongoDB is running
systemctl status mongod

# Test connection manually
mongo mongodb://localhost:27017/zlecaf_db

# Verify environment variables
cat backend/.env
```

#### 2. Health Endpoint Timeout

**Symptom**: Request times out, no response

**Possible Causes:**
- API server is not running
- Server is overloaded
- Network issues

**Resolution:**
```bash
# Check if API server is running
ps aux | grep python | grep server.py

# Check server logs
tail -f logs/api.log

# Restart server
python backend/server.py
```

#### 3. Intermittent Failures

**Symptom**: Health checks fail occasionally

**Possible Causes:**
- Resource exhaustion (CPU, memory)
- Database connection pool exhaustion
- Network instability

**Resolution:**
- Monitor resource usage
- Increase database connection pool size
- Review application logs for patterns

## Best Practices

### 1. Regular Monitoring
- Poll health endpoint at least every minute in production
- Set up automated alerts for failures
- Track health check metrics over time

### 2. Graceful Degradation
- Return partial health status if some checks fail
- Continue serving requests if non-critical components fail
- Log all failures for investigation

### 3. Security
- Don't expose sensitive information in health responses
- Consider authentication for detailed health endpoints
- Rate limit health endpoint to prevent abuse

### 4. Performance
- Keep health checks lightweight (< 1 second)
- Cache health status if checks are expensive
- Use separate endpoint for deep health checks

### 5. Testing
- Include health endpoint in integration tests
- Test failure scenarios
- Verify alerting mechanisms

## Integration with CI/CD

### Pre-deployment Health Check

```yaml
# .github/workflows/deploy.yml
- name: Wait for deployment
  run: |
    for i in {1..30}; do
      if curl -f http://your-api.com/api/health; then
        echo "Deployment successful"
        exit 0
      fi
      sleep 10
    done
    echo "Deployment failed - health check unsuccessful"
    exit 1
```

### Smoke Tests

```bash
#!/bin/bash
# smoke-test.sh

echo "Running smoke tests..."

# Check health endpoint
curl -f http://localhost:8000/api/health || exit 1

# Verify healthy status
status=$(curl -s http://localhost:8000/api/health | jq -r '.status')
if [ "$status" != "healthy" ]; then
  echo "Health check returned: $status"
  exit 1
fi

echo "✅ All smoke tests passed"
```

## Future Enhancements

Planned improvements to health observability:

1. **Detailed Component Health**
   - Individual API endpoint health
   - External API reachability tests
   - Cache health status

2. **Health History**
   - Store health check results
   - Trend analysis
   - Downtime tracking

3. **Advanced Metrics**
   - Request rate monitoring
   - Error rate tracking
   - Response time percentiles

4. **Dashboard**
   - Real-time health visualization
   - Historical trends
   - Alert management interface

## Support

For questions or issues related to health monitoring:
- Review application logs
- Check MongoDB connection status
- Verify environment configuration
- Consult the troubleshooting section above
