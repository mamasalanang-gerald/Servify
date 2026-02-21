# 🚀 COMPLETE DEVOPS DOCUMENTATION - PART 4: SECURITY, TESTING & MONITORING

---

## SECURITY IMPLEMENTATION

### Image Signing with Cosign

#### Generate Cosign Keys
```bash
# Generate private key
cosign generate-key-pair

# Output:
# Private key saved to cosign.key
# Public key saved to cosign.pub

# Encode for GitHub Secrets
cat cosign.key | base64 > cosign.key.b64
cat cosign.pub | base64 > cosign.pub.b64
```

#### GitHub Secrets Setup
```
COSIGN_KEY_B64=<base64-encoded-private-key>
COSIGN_PASSWORD=<password-for-key>
COSIGN_PUBKEY_B64=<base64-encoded-public-key>
```

#### Signing Process (in CI/CD)
```bash
# Decode key
echo "$COSIGN_KEY_B64" | base64 -d > cosign.key

# Sign image
cosign sign --yes --key cosign.key $REGISTRY/pomodify-backend:$TAG

# Verify signature
cosign verify --key cosign.pub $REGISTRY/pomodify-backend:$TAG

# Cleanup
rm -f cosign.key
```

### Vulnerability Scanning with Trivy

#### Installation
```bash
# Ubuntu/Debian
sudo apt-get install -y trivy

# macOS
brew install trivy

# Docker
docker run aquasec/trivy image <image-name>
```

#### Scanning Images
```bash
# Scan for all vulnerabilities
trivy image pomodify-backend:latest

# Scan for CRITICAL and HIGH only
trivy image --severity CRITICAL,HIGH pomodify-backend:latest

# Generate JSON report
trivy image --format json -o report.json pomodify-backend:latest

# Exit with error if vulnerabilities found
trivy image --exit-code 1 --severity CRITICAL,HIGH pomodify-backend:latest
```

### SBOM Generation with Syft

#### Installation
```bash
# Install Syft
curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh -s -- -b /usr/local/bin

# Verify
syft version
```

#### Generate SBOM
```bash
# Generate SPDX JSON format
syft pomodify-backend:latest -o spdx-json > sbom-backend.json

# Generate CycloneDX format
syft pomodify-backend:latest -o cyclonedx-json > sbom-backend-cyclonedx.json

# Generate table format
syft pomodify-backend:latest -o table
```

### Spring Security Configuration

#### SecurityConfig.java
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors().and()
            .authorizeRequests()
                .antMatchers("/api/auth/**").permitAll()
                .antMatchers("/api/public/**").permitAll()
                .antMatchers("/actuator/health").permitAll()
                .anyRequest().authenticated()
            .and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(jwtExceptionFilter(), JwtAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }
}
```

### JWT Token Management

#### Token Generation
```java
public String generateAccessToken(User user) {
    return Jwts.builder()
        .setSubject(user.getId().toString())
        .claim("email", user.getEmail())
        .claim("roles", user.getRoles())
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + JWT_ACCESS_EXPIRATION))
        .signWith(SignatureAlgorithm.HS512, JWT_SECRET)
        .compact();
}
```

#### Token Validation
```java
public boolean validateToken(String token) {
    try {
        Jwts.parser()
            .setSigningKey(JWT_SECRET)
            .parseClaimsJws(token);
        return true;
    } catch (JwtException | IllegalArgumentException e) {
        return false;
    }
}
```

---

## TESTING STRATEGY

### Unit Testing

#### Backend Unit Tests (JUnit 5 + Mockito)
```java
@WebMvcTest(UserController.class)
class UserControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void testGetUserProfile() throws Exception {
        // Arrange
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("test@example.com");
        when(userService.getUserById(any())).thenReturn(user);

        // Act & Assert
        mockMvc.perform(get("/api/users/{id}", user.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("test@example.com"));
    }
}
```

#### Frontend Unit Tests (Jasmine + Karma)
```typescript
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch user profile', () => {
    const mockUser = { id: '123', email: 'test@example.com' };

    service.getUserProfile().subscribe(user => {
      expect(user.email).toBe('test@example.com');
    });

    const req = httpMock.expectOne('/api/users/profile');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });
});
```

### Integration Testing

#### Backend Integration Tests (Testcontainers)
```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class SessionControllerIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = 
        new PostgreSQLContainer<>("postgres:15-alpine")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void testCreateSession() {
        // Arrange
        CreateSessionRequest request = new CreateSessionRequest();
        request.setActivityId(UUID.randomUUID());
        request.setDurationMinutes(25);

        // Act
        ResponseEntity<SessionResponse> response = restTemplate.postForEntity(
            "/api/sessions",
            request,
            SessionResponse.class
        );

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getDurationMinutes()).isEqualTo(25);
    }
}
```

### E2E Testing

#### Playwright E2E Tests
```typescript
import { test, expect } from '@playwright/test';

test.describe('Session Timer', () => {
  test('should create and start a session', async ({ page }) => {
    // Navigate to app
    await page.goto('http://localhost:4200');

    // Login
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button:has-text("Login")');

    // Wait for dashboard
    await page.waitForURL('**/dashboard');

    // Create session
    await page.click('button:has-text("New Session")');
    await page.fill('input[name="duration"]', '25');
    await page.click('button:has-text("Start")');

    // Verify session started
    const timer = page.locator('[data-testid="timer"]');
    await expect(timer).toContainText('25:00');
  });
});
```

### Property-Based Testing

#### Backend Property Tests (jqwik)
```java
class SessionPropertyTests {

    @Property
    void sessionDurationShouldBePositive(@Positive int duration) {
        Session session = new Session();
        session.setDurationMinutes(duration);
        
        assertThat(session.getDurationMinutes()).isGreaterThan(0);
    }

    @Property
    void sessionStateTransitionsShouldBeValid(
        @ForAll("validStates") SessionState from,
        @ForAll("validStates") SessionState to) {
        
        Session session = new Session();
        session.setState(from);
        
        boolean canTransition = session.canTransitionTo(to);
        assertThat(canTransition).isNotNull();
    }
}
```

#### Frontend Property Tests (fast-check)
```typescript
import fc from 'fast-check';

describe('Timer Calculation Properties', () => {
  it('should always calculate remaining time correctly', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 60 }),
        fc.integer({ min: 0, max: 59 }),
        (minutes, seconds) => {
          const totalSeconds = minutes * 60 + seconds;
          const remaining = calculateRemaining(totalSeconds);
          
          return remaining >= 0 && remaining <= totalSeconds;
        }
      )
    );
  });
});
```

---

## MONITORING & HEALTH CHECKS

### Spring Boot Actuator

#### Configuration (application.properties)
```properties
management.endpoints.web.exposure.include=health,metrics,info,prometheus
management.endpoint.health.show-details=when-authorized
management.metrics.export.prometheus.enabled=true
```

#### Health Check Endpoints
```
GET /actuator/health                    # Basic health
GET /actuator/health/db                 # Database health
GET /actuator/health/diskSpace          # Disk space
GET /actuator/metrics                   # All metrics
GET /actuator/metrics/jvm.memory.used   # JVM memory
GET /actuator/prometheus                # Prometheus format
```

### Docker Health Checks

#### Backend Health Check
```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
  CMD curl -f http://localhost:8081/actuator/health || exit 1
```

#### Frontend Health Check
```bash
# Nginx responds with 200 on /
curl -f http://localhost:80/ || exit 1
```

### Logging Configuration

#### Backend Logging (logback-spring.xml)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <property name="LOG_FILE" value="${LOG_FILE:-${LOG_PATH:-${LOG_TEMP:-${java.io.tmpdir:-/tmp}}/}spring.log}"/>
    
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOG_FILE}</file>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} - %msg%n</pattern>
        </encoder>
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>${LOG_FILE}.%d{yyyy-MM-dd}.%i.gz</fileNamePattern>
            <maxFileSize>10MB</maxFileSize>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
    </appender>

    <root level="INFO">
        <appender-ref ref="FILE"/>
    </root>
</configuration>
```

#### Frontend Logging (logger.service.ts)
```typescript
@Injectable({ providedIn: 'root' })
export class LoggerService {
  log(message: string, data?: any) {
    console.log(`[${new Date().toISOString()}] ${message}`, data);
  }

  error(message: string, error?: any) {
    console.error(`[ERROR] ${message}`, error);
  }

  warn(message: string, data?: any) {
    console.warn(`[WARN] ${message}`, data);
  }
}
```

---

## PERFORMANCE OPTIMIZATION

### Backend Optimization

#### JVM Tuning
```bash
# Container-aware JVM settings
-XX:+UseContainerSupport          # Respect container limits
-XX:MaxRAMPercentage=75.0         # Use 75% of container memory
-XX:+UseG1GC                      # G1 garbage collector
-XX:+ExitOnOutOfMemoryError       # Exit on OOM
```

#### Database Connection Pooling
```properties
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=20000
spring.datasource.hikari.idle-timeout=300000
spring.datasource.hikari.max-lifetime=1200000
```

#### Caching
```java
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager("users", "activities", "sessions");
    }
}
```

### Frontend Optimization

#### Build Optimization
```bash
# Production build with optimization
ng build --configuration=production --source-map=false --optimization=true

# Bundle analysis
ng build --stats-json
webpack-bundle-analyzer dist/pomodify-frontend/stats.json
```

#### Lazy Loading
```typescript
const routes: Routes = [
  { path: '', component: DashboardComponent },
  { 
    path: 'sessions', 
    loadChildren: () => import('./sessions/sessions.module').then(m => m.SessionsModule)
  },
  { 
    path: 'activities', 
    loadChildren: () => import('./activities/activities.module').then(m => m.ActivitiesModule)
  }
];
```

---

## TROUBLESHOOTING GUIDE

### Common Issues & Solutions

#### Backend Container Won't Start
```bash
# Check logs
docker logs pomodify-backend

# Common causes:
# 1. Database not ready
#    Solution: Ensure RDS is accessible
# 2. Missing environment variables
#    Solution: Check all required env vars are set
# 3. Port already in use
#    Solution: docker ps | grep 8081; docker stop <container>
```

#### Frontend Container Won't Start
```bash
# Check logs
docker logs pomodify-frontend

# Common causes:
# 1. Nginx config error
#    Solution: docker exec pomodify-frontend nginx -t
# 2. Port already in use
#    Solution: docker ps | grep 8080; docker stop <container>
```

#### Database Connection Issues
```bash
# Test connection
psql -h $DB_HOST -U $DB_USERNAME -d $DB_NAME -p $DB_PORT

# Check security group
# Ensure EC2 security group allows port 5432 from EC2 instance

# Check RDS parameter group
# Ensure max_connections is sufficient
```

#### Tests Failing in CI
```bash
# Run locally first
mvn test                    # Backend unit tests
mvn verify                  # Backend integration tests
npm test                    # Frontend unit tests
npm run e2e                 # Frontend E2E tests

# Check for environment-specific issues
# CI uses different environment than local
```

---

## DISASTER RECOVERY

### Database Backup & Restore

#### Automated Backups (RDS)
```
Backup Retention: 7 days
Backup Window: 03:00-04:00 UTC
Multi-AZ: Enabled
```

#### Manual Backup
```bash
# Backup database
pg_dump -h $DB_HOST -U $DB_USERNAME -d $DB_NAME > backup.sql

# Restore database
psql -h $DB_HOST -U $DB_USERNAME -d $DB_NAME < backup.sql
```

### Container Rollback

#### Rollback to Previous Version
```bash
# SSH into EC2
ssh -i key.pem ubuntu@$EC2_IP

# Stop current containers
sudo docker stop pomodify-frontend pomodify-backend

# Pull previous version
sudo docker pull $REGISTRY/pomodify-backend:previous-tag
sudo docker pull $REGISTRY/pomodify-frontend:previous-tag

# Start previous version
sudo docker run -d ... $REGISTRY/pomodify-backend:previous-tag
sudo docker run -d ... $REGISTRY/pomodify-frontend:previous-tag
```

---

**Continue to PART 5 for Complete Code References & Troubleshooting...**
