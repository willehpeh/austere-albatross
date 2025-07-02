# CLAUDE.md - Austere Albatross Project

## Project Overview

This is an Nx monorepo workspace using Angular and NestJS with a Clean Architecture approach. The project follows Domain-Driven Design principles with strict module boundaries enforced via ESLint.

## Technology Stack

- **Frontend**: Angular 20 with NgRx state management
- **Backend**: NestJS with CQRS pattern
- **Styling**: TailwindCSS 4.x
- **Testing**: Jest with Angular Testing utilities
- **E2E Testing**: Playwright
- **Build Tool**: Nx 21.x
- **Package Manager**: npm

## Commands

### Build Commands
```bash
# Build all projects
npx nx run-many -t build

# Build specific project
npx nx build <project-name>

# Build with dependencies
npx nx build <project-name> --with-deps
```

### Test Commands
```bash
# Run all tests
npx nx run-many -t test

# Run tests for specific project
npx nx test <project-name>

# Run tests with coverage
npx nx test <project-name> --codeCoverage

# Run tests in CI mode
npx nx test <project-name> --configuration=ci
```

### Lint Commands
```bash
# Lint all projects
npx nx run-many -t lint

# Lint specific project
npx nx lint <project-name>

# Lint with auto-fix
npx nx lint <project-name> --fix
```

### E2E Commands
```bash
# Run e2e tests
npx nx e2e <app-name>
```

### Development Commands
```bash
# Serve application
npx nx serve <app-name>

# Generate new library
npx nx g @nx/js:library <lib-name>

# Generate Angular component
npx nx g @angular/schematics:component <component-name>

# Generate NestJS service
npx nx g @nestjs/schematics:service <service-name>
```

## Architecture

### Clean Architecture Layers

The project follows Clean Architecture with strict dependency rules:

1. **Domain Layer** (`libs/domain/`)
   - Core business logic and entities
   - No external dependencies
   - Tagged with `scope:domain`

2. **Application Layer** (`libs/application/`)
   - Use cases and application services
   - Can depend on: Domain
   - Tagged with `scope:application`

3. **Infrastructure Layer** (`libs/infrastructure/`)
   - External concerns (databases, APIs, frameworks)
   - Can depend on: Application, Domain
   - Tagged with `scope:infrastructure`

4. **Test Layer** (`libs/tests/`)
   - Shared testing utilities
   - Can depend on all layers
   - Tagged with `scope:tests`

### Module Boundaries

ESLint enforces these dependency constraints:
- Domain → Domain only
- Application → Application, Domain
- Infrastructure → Infrastructure, Application, Domain
- Tests → All layers
- API → API, Application, Domain, Infrastructure
- Frontend → Frontend, API, Application

### Path Aliases

```typescript
// Use these imports in your code:
import { ... } from '@austere-albatross/austere-domain';
import { ... } from '@austere-albatross/austere-application';
import { ... } from '@austere-albatross/austere-infrastructure';
import { ... } from '@austere-albatross/austere-tests';
```

## Code Style Guidelines

### General
- TypeScript strict mode enabled
- ESLint with Nx, Angular, and TypeScript rules
- Prettier formatting (configured via ESLint)
- Use decorators for Angular and NestJS
- Prefer ES2015+ features

### Angular Specific
- Use OnPush change detection where possible
- Follow Angular style guide
- Use reactive forms
- Implement proper lifecycle hooks
- Use Jest for unit testing with angular-testing utilities

### NestJS Specific
- Use CQRS pattern for complex operations
- Implement proper dependency injection
- Use decorators for routes and validation
- Follow NestJS conventions

### Testing
- Unit tests: Jest with `.spec.ts` extension
- E2E tests: Playwright
- Use `jest.config.ts` for Jest configuration
- Tests run with `passWithNoTests: true`

## Test-Driven Development (TDD)

This project strictly follows **Kent Beck's TDD approach**. All new features and bug fixes must be developed using the Red-Green-Refactor cycle.

### TDD Cycle

1. **Red**: Write the smallest possible failing test
2. **Green**: Write the simplest code to make the test pass
3. **Refactor**: Improve the code while keeping tests green

### TDD Principles

#### Write Tests First
- **Always** write the test before writing production code
- Start with the test that would be most informative if it failed
- Write only enough test code to make the test fail
- Write only enough production code to make the test pass

#### Prefer Fakes and Stubs Over Mocks and Spies
```typescript
// ✅ GOOD: Use fakes (simple implementations)
class FakeUserRepository implements UserRepository {
  private users: User[] = [];
  
  async save(user: User): Promise<void> {
    this.users.push(user);
  }
  
  async findById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }
}

// ✅ GOOD: Use stubs (predetermined responses)
class StubEmailService implements EmailService {
  async sendEmail(): Promise<void> {
    // Does nothing - just fulfills the contract
  }
}

// ❌ AVOID: Complex mocks with behavior verification
// jest.fn().mockImplementation()
// expect(mockService).toHaveBeenCalledWith()
```

#### Social Tests Over Isolated Tests
- Test object collaborations, not just individual methods
- Test behavior that emerges from objects working together
- Focus on testing contracts between objects

```typescript
// ✅ GOOD: Social test - tests how objects work together
describe('UserRegistrationService', () => {
  it('should register user and send welcome email', async () => {
    const fakeRepository = new FakeUserRepository();
    const fakeEmailService = new FakeEmailService();
    const service = new UserRegistrationService(fakeRepository, fakeEmailService);
    
    await service.registerUser('john@example.com', 'password');
    
    const savedUser = await fakeRepository.findByEmail('john@example.com');
    expect(savedUser).toBeDefined();
    expect(fakeEmailService.sentEmails).toHaveLength(1);
  });
});

// ❌ AVOID: Isolated test with complex mocking
describe('UserRegistrationService', () => {
  it('should call repository save method', async () => {
    const mockRepository = jest.fn();
    const mockEmailService = jest.fn();
    // ... complex mock setup and verification
  });
});
```

#### Implementation Strategies

**Obvious Implementation**: When you know how to implement, just write it
```typescript
// Simple, obvious implementations
function add(a: number, b: number): number {
  return a + b;
}
```

**Triangulation**: When unsure, write multiple tests to drive the design
```typescript
describe('Calculator', () => {
  it('should add two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
  
  it('should add negative numbers', () => {
    expect(add(-2, -3)).toBe(-5);
  });
  
  it('should handle zero', () => {
    expect(add(0, 5)).toBe(5);
  });
});
```

#### Test Organization

- **One assertion per test** when possible
- **Descriptive test names** that explain the behavior
- **Arrange-Act-Assert** pattern
- **Independent tests** that can run in any order

```typescript
describe('OrderService', () => {
  describe('when processing valid order', () => {
    it('should create order record', async () => {
      // Arrange
      const fakeRepository = new FakeOrderRepository();
      const service = new OrderService(fakeRepository);
      const orderData = { customerId: '123', items: [{ id: 'item1' }] };
      
      // Act
      await service.processOrder(orderData);
      
      // Assert
      const orders = await fakeRepository.findAll();
      expect(orders).toHaveLength(1);
    });
    
    it('should calculate correct total', async () => {
      // ... separate test for total calculation
    });
  });
});
```

### TDD Guidelines for This Project

1. **No production code without a failing test**
2. **Commit tests and implementation together**
3. **Keep test files alongside source files** (`.spec.ts`)
4. **Use descriptive test and variable names**
5. **Prefer integration tests over unit tests** when testing business logic
6. **Create simple test doubles** rather than using complex mocking frameworks
7. **Focus on testing behavior, not implementation details**
8. **Refactor ruthlessly** while keeping tests green

### Test Double Hierarchy (Prefer in this order)

1. **Real objects** (when practical)
2. **Fakes** (working implementations with shortcuts)
3. **Stubs** (predetermined responses)
4. **Mocks/Spies** (only when absolutely necessary for verification)

### Running TDD Workflow

```bash
# Start TDD session - run tests in watch mode
npx nx test <project-name> --watch

# Run specific test file
npx nx test <project-name> --testNamePattern="UserService"

# Run with coverage to see what code is tested
npx nx test <project-name> --codeCoverage
```

## Domain-Driven Design (DDD) & Clean Architecture

This project strictly follows **Domain-Driven Design principles** and **Clean Architecture** patterns. All code must respect domain boundaries and dependency rules.

### DDD Strategic Patterns

#### Ubiquitous Language
- Use the same terminology in code, tests, documentation, and conversations
- Domain experts and developers must speak the same language
- Model the code to reflect the business domain vocabulary
- Avoid technical jargon in domain layer

```typescript
// ✅ GOOD: Business language
class Order {
  fulfill(shippingAddress: Address): void { }
  cancel(reason: CancellationReason): void { }
}

// ❌ BAD: Technical language
class Order {
  setStatus(status: number): void { }
  updateRecord(data: any): void { }
}
```

#### Bounded Contexts
- Each subdomain should have clear boundaries
- Use separate models for different contexts
- Avoid sharing domain objects across contexts
- Use integration events for cross-context communication

```typescript
// ✅ GOOD: Context-specific models
namespace OrderManagement {
  export class Customer {
    id: CustomerId;
    billingAddress: Address;
    creditLimit: Money;
  }
}

namespace Shipping {
  export class Customer {
    id: CustomerId;
    shippingAddress: Address;
    preferredCarrier: Carrier;
  }
}
```

### DDD Tactical Patterns

#### Entities
- Have identity that persists over time
- Mutable objects with business logic
- Identity must be immutable

```typescript
// Domain layer: libs/domain/src/entities/
export class Order {
  constructor(
    private readonly id: OrderId,
    private customerId: CustomerId,
    private items: OrderItem[],
    private status: OrderStatus
  ) {}

  getId(): OrderId {
    return this.id; // Identity never changes
  }

  addItem(product: Product, quantity: Quantity): void {
    if (this.status !== OrderStatus.DRAFT) {
      throw new Error('Cannot modify confirmed order');
    }
    this.items.push(new OrderItem(product, quantity));
  }

  confirm(): void {
    if (this.items.length === 0) {
      throw new Error('Cannot confirm empty order');
    }
    this.status = OrderStatus.CONFIRMED;
  }
}
```

#### Value Objects
- Immutable objects without identity
- Represent concepts that are defined by their attributes
- Use for money, addresses, measurements, etc.

```typescript
// Domain layer: libs/domain/src/value-objects/
export class Money {
  constructor(
    private readonly amount: number,
    private readonly currency: Currency
  ) {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }
  }

  add(other: Money): Money {
    if (!this.currency.equals(other.currency)) {
      throw new Error('Cannot add different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency.equals(other.currency);
  }
}
```

#### Aggregates
- Cluster of entities and value objects
- Enforce business invariants
- Only access through aggregate root
- Persist and load as a unit

```typescript
// Domain layer: libs/domain/src/aggregates/
export class Order { // Aggregate Root
  private items: OrderItem[] = [];
  private readonly MAX_ITEMS = 50;

  addItem(product: Product, quantity: Quantity): void {
    if (this.items.length >= this.MAX_ITEMS) {
      throw new Error('Order cannot exceed maximum items');
    }
    
    const existingItem = this.items.find(item => 
      item.getProductId().equals(product.getId())
    );
    
    if (existingItem) {
      existingItem.increaseQuantity(quantity);
    } else {
      this.items.push(new OrderItem(product, quantity));
    }
    
    // Aggregate ensures business rules are maintained
    this.recalculateTotal();
  }
}
```

#### Domain Services
- Stateless services for domain logic that doesn't belong to entities
- Use when operation involves multiple aggregates
- Keep in domain layer

```typescript
// Domain layer: libs/domain/src/services/
export class PricingService {
  calculateDiscount(
    customer: Customer, 
    order: Order, 
    promotions: Promotion[]
  ): Money {
    // Complex pricing logic that doesn't belong to any single entity
    let discount = Money.zero();
    
    if (customer.isVip()) {
      discount = discount.add(order.getTotal().multiply(0.1));
    }
    
    // Apply applicable promotions...
    return discount;
  }
}
```

#### Domain Events
- Represent something that happened in the domain
- Immutable records of business events
- Enable loose coupling between bounded contexts

```typescript
// Domain layer: libs/domain/src/events/
export class OrderConfirmedEvent {
  constructor(
    public readonly orderId: OrderId,
    public readonly customerId: CustomerId,
    public readonly confirmedAt: Date,
    public readonly items: ReadonlyArray<OrderItem>
  ) {}
}

// In aggregate
export class Order {
  private events: DomainEvent[] = [];

  confirm(): void {
    this.status = OrderStatus.CONFIRMED;
    this.events.push(new OrderConfirmedEvent(
      this.id,
      this.customerId,
      new Date(),
      this.items
    ));
  }

  getEvents(): ReadonlyArray<DomainEvent> {
    return this.events;
  }
}
```

### Clean Architecture Layers

#### Domain Layer (`libs/domain/`)
**What belongs here:**
- Entities and Value Objects
- Domain Services
- Domain Events
- Business rules and invariants
- Interfaces for repositories (contracts only)

**What is forbidden:**
- Framework dependencies
- Database concerns
- HTTP concerns
- External service calls

```typescript
// ✅ GOOD: Pure domain logic
export interface OrderRepository {
  save(order: Order): Promise<void>;
  findById(id: OrderId): Promise<Order | null>;
}

export class Order {
  // Business logic only, no infrastructure concerns
}
```

#### Application Layer (`libs/application/`)
**What belongs here:**
- Use cases / Application Services
- Command and Query handlers (CQRS)
- Application-specific business rules
- Orchestration logic
- DTO definitions

**What is forbidden:**
- Direct database access
- HTTP request/response handling
- Framework-specific code

```typescript
// Application layer: libs/application/src/use-cases/
export class ConfirmOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private paymentService: PaymentService,
    private eventBus: EventBus
  ) {}

  async execute(command: ConfirmOrderCommand): Promise<void> {
    const order = await this.orderRepository.findById(command.orderId);
    if (!order) {
      throw new OrderNotFoundError(command.orderId);
    }

    // Application coordinates the workflow
    await this.paymentService.processPayment(order.getTotal());
    order.confirm();
    await this.orderRepository.save(order);
    
    // Publish domain events
    for (const event of order.getEvents()) {
      await this.eventBus.publish(event);
    }
  }
}
```

#### Infrastructure Layer (`libs/infrastructure/`)
**What belongs here:**
- Repository implementations
- Database entities/schemas
- External service adapters
- Framework configurations
- Event handlers

```typescript
// Infrastructure layer: libs/infrastructure/src/repositories/
export class TypeOrmOrderRepository implements OrderRepository {
  constructor(private entityManager: EntityManager) {}

  async save(order: Order): Promise<void> {
    const entity = this.toEntity(order);
    await this.entityManager.save(entity);
  }

  async findById(id: OrderId): Promise<Order | null> {
    const entity = await this.entityManager.findOne(OrderEntity, id.value);
    return entity ? this.toDomain(entity) : null;
  }

  private toEntity(order: Order): OrderEntity {
    // Map domain object to database entity
  }

  private toDomain(entity: OrderEntity): Order {
    // Map database entity to domain object
  }
}
```

### Dependency Rules

#### The Dependency Rule
- **Dependencies point inward** toward the domain
- **Inner layers know nothing about outer layers**
- **Outer layers depend on inner layers through interfaces**

```typescript
// ✅ GOOD: Dependency inversion
class ConfirmOrderUseCase {
  constructor(
    private orderRepository: OrderRepository, // Interface from domain
    private paymentService: PaymentService   // Interface from domain
  ) {}
}

// ❌ BAD: Direct dependency on infrastructure
class ConfirmOrderUseCase {
  constructor(
    private sqlOrderRepository: SqlOrderRepository, // Concrete implementation
    private stripePaymentService: StripePaymentService // External service
  ) {}
}
```

### Implementation Guidelines

#### Repository Pattern
- Define interfaces in domain layer
- Implement in infrastructure layer
- One repository per aggregate root

```typescript
// Domain layer interface
export interface CustomerRepository {
  save(customer: Customer): Promise<void>;
  findById(id: CustomerId): Promise<Customer | null>;
  findByEmail(email: Email): Promise<Customer | null>;
}

// Infrastructure implementation
@Injectable()
export class TypeOrmCustomerRepository implements CustomerRepository {
  // Implementation details
}
```

#### Use Case Pattern
- One use case per business operation
- Clear input/output contracts
- Handle cross-cutting concerns (transactions, events)

```typescript
export class CreateCustomerCommand {
  constructor(
    public readonly email: string,
    public readonly name: string
  ) {}
}

export class CreateCustomerResult {
  constructor(
    public readonly customerId: string
  ) {}
}

export class CreateCustomerUseCase {
  async execute(command: CreateCustomerCommand): Promise<CreateCustomerResult> {
    // Implementation
  }
}
```

#### Error Handling
- Domain errors for business rule violations
- Application errors for workflow issues
- Infrastructure errors for technical problems

```typescript
// Domain errors
export class InvalidEmailError extends Error {
  constructor(email: string) {
    super(`Invalid email: ${email}`);
  }
}

// Application errors  
export class CustomerNotFoundError extends Error {
  constructor(id: CustomerId) {
    super(`Customer not found: ${id.value}`);
  }
}
```

### Project Structure Rules

1. **Domain layer must not import from other layers**
2. **Application layer may only import from domain**
3. **Infrastructure layer implements interfaces from inner layers**
4. **Use dependency injection at application boundaries**
5. **Keep aggregates small and focused**
6. **Use events for eventual consistency**
7. **Separate read and write models when complexity demands it**

## Event Sourcing

This project uses **Event Sourcing** with **NestJS CQRS** for aggregate persistence. All aggregate state changes are captured as events and stored in event streams.

### Event Sourcing Principles

#### Events as Source of Truth
- **All state changes are events** - never update aggregate state directly
- **Events are immutable** - once written, they cannot be changed
- **Event streams represent aggregate history** - current state is derived from events
- **Events are facts** - they represent what happened, not what should happen

#### Aggregate Design

**Aggregates extend AggregateRoot:**
```typescript
// Domain layer: libs/domain/src/entities/
export class Organization extends AggregateRoot<DomainEvent> {
  private nextEventVersion = 0;

  constructor(
    private readonly id: OrganizationId,
    private readonly name: OrganizationName
  ) {
    super();
    // Apply event when creating new aggregate
    this.apply(new OrgRegisteredEvent(
      id.value(),
      this.nextEventVersion++,
      { name: name.value() }
    ));
  }

  // Static factory method for reconstruction from events
  static fromEvents(id: OrganizationId, events: DomainEvent[]): Organization {
    const aggregate = Object.create(Organization.prototype);
    aggregate.id = id;
    aggregate.nextEventVersion = 0;
    
    // Replay events to rebuild state
    events.forEach(event => {
      aggregate.when(event);
      aggregate.nextEventVersion++;
    });
    
    return aggregate;
  }

  // Event application logic
  private when(event: DomainEvent): void {
    if (event instanceof OrgRegisteredEvent) {
      this.name = new OrganizationName(event.data.name);
    }
    // Handle other event types...
  }

  // Business methods that apply events
  changeName(newName: OrganizationName): void {
    this.apply(new OrgNameChangedEvent(
      this.id.value(),
      this.nextEventVersion++,
      { name: newName.value() }
    ));
  }
}
```

#### Domain Events

**Events must be immutable and serializable:**
```typescript
// Domain layer: libs/domain/src/events/
export class OrgRegisteredEvent extends DomainEvent {
  public readonly data: OrgRegisteredEventProps;

  constructor(
    aggregateId: string, 
    eventVersion: number, 
    data: OrgRegisteredEventProps
  ) {
    super(aggregateId, eventVersion, 'OrgRegistered');
    this.data = data;
  }
}

export type OrgRegisteredEventProps = { 
  readonly name: string;
};
```

**Event Properties:**
- `aggregateId`: Identifies which aggregate the event belongs to
- `eventVersion`: Position in the aggregate's event stream
- `eventType`: String identifier for event type
- `occurredOn`: Timestamp when event was created
- `data`: Immutable event payload

#### Event Store

**EventStore interface for persistence:**
```typescript
// Domain layer: libs/domain/src/common/
export interface EventStore {
  appendEvents(streamId: string, events: DomainEvent[], expectedVersion?: number): Promise<void>;
  getEvents(streamId: string, fromVersion?: number): Promise<DomainEvent[]>;
}
```

**Usage patterns:**
- `appendEvents`: Store new events for an aggregate stream
- `getEvents`: Retrieve events to reconstruct aggregate
- `expectedVersion`: Optimistic concurrency control
- `streamId`: Aggregate ID (one stream per aggregate)

### Command Handlers

**Command handlers orchestrate event sourcing:**
```typescript
// Application layer: libs/application/src/commands/
@CommandHandler(RegisterOrgCommand)
export class RegisterOrgCommandHandler implements ICommandHandler<RegisterOrgCommand> {
  constructor(
    private readonly eventStore: EventStore,
    private readonly eventPublisher: EventPublisher
  ) {}

  async execute(command: RegisterOrgCommand): Promise<string> {
    const id = new OrganizationId(crypto.randomUUID());
    const name = new OrganizationName(command.name);
    
    // Create new aggregate
    const org = new Organization(id, name);
    
    // Enable event publishing
    this.eventPublisher.mergeObjectContext(org);
    
    // Store events
    await this.eventStore.appendEvents(
      id.value(), 
      org.getUncommittedEvents()
    );
    
    // Commit and publish events
    org.commit();
    
    return id.value();
  }
}
```

**For loading existing aggregates:**
```typescript
async execute(command: ChangeOrgNameCommand): Promise<void> {
  // Load events from store
  const events = await this.eventStore.getEvents(command.orgId);
  
  // Reconstruct aggregate from events
  const org = Organization.fromEvents(
    new OrganizationId(command.orgId), 
    events
  );
  
  // Execute business logic
  org.changeName(new OrganizationName(command.newName));
  
  // Store new events
  this.eventPublisher.mergeObjectContext(org);
  await this.eventStore.appendEvents(
    command.orgId, 
    org.getUncommittedEvents(),
    events.length // Expected version for concurrency control
  );
  
  org.commit();
}
```

### Concurrency Control

**Use optimistic locking with expected version:**
```typescript
// When loading aggregate
const events = await this.eventStore.getEvents(aggregateId);
const expectedVersion = events.length;

// When saving changes
await this.eventStore.appendEvents(
  aggregateId, 
  newEvents, 
  expectedVersion // Throws if another process modified the stream
);
```

### Testing Event Sourced Aggregates

**Use FakeEventStore for testing:**
```typescript
// Test: libs/tests/src/
describe('RegisterOrgCommand', () => {
  let eventStore: FakeEventStore;
  let eventPublisher: FakeEventPublisher;
  let handler: RegisterOrgCommandHandler;

  beforeEach(() => {
    eventStore = new FakeEventStore();
    eventPublisher = new FakeEventPublisher();
    handler = new RegisterOrgCommandHandler(eventStore, eventPublisher);
  });

  it('should register organization and store events', async () => {
    const command = new RegisterOrgCommand('Test Org');
    
    const orgId = await handler.execute(command);
    
    // Verify events were stored
    const events = eventStore.events.get(orgId);
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(OrgRegisteredEvent);
    
    // Verify events were published
    expect(eventPublisher.getPublishedEvents()).toEqual(events);
  });
});
```

### Event Sourcing Guidelines

1. **Never mutate aggregate state directly** - always apply events
2. **Events represent facts** - use past tense naming (OrgRegistered, not RegisterOrg)
3. **Keep events small and focused** - one business fact per event
4. **Event data must be serializable** - no complex objects, functions, or circular references
5. **Use event versioning** - track position in aggregate stream
6. **Handle concurrency** - use expected version for optimistic locking
7. **Separate event data from domain objects** - use simple data types in events
8. **Test event application** - verify aggregates can be reconstructed from events
9. **Use aggregate factories** - static `fromEvents()` methods for reconstruction
10. **Keep event streams bounded** - snapshot large aggregates if needed

### Event Naming Conventions

- **Event class names**: PastTense + Event (e.g., `OrgRegisteredEvent`)
- **Event types**: PastTense (e.g., `'OrgRegistered'`)
- **Event data**: Use readonly properties and simple types
- **Stream IDs**: Use aggregate IDs as stream identifiers

### Integration with NestJS CQRS

- **Extend AggregateRoot**: All aggregates must extend `AggregateRoot<DomainEvent>`
- **Use this.apply()**: Apply events using the NestJS method
- **Use EventPublisher**: Merge object context for automatic event publishing
- **Call commit()**: Commit and publish events after storing
- **Handle in EventHandlers**: Create event handlers for side effects

## Project Structure

```
apps/
├── austere-albatross/     # Main Angular application
└── austere-api/           # NestJS API application

libs/
├── application/           # Application layer (use cases)
├── domain/               # Domain layer (business logic)
├── infrastructure/       # Infrastructure layer (external concerns)
└── tests/               # Shared testing utilities
```

## Development Workflow

1. Follow feature branch workflow
2. Run linting before commits: `npx nx run-many -t lint`
3. Run tests before commits: `npx nx run-many -t test`
4. Use Nx affected commands for CI: `npx nx affected -t test,lint,build`
5. Ensure module boundary rules are respected

## Useful Nx Commands

```bash
# See project graph
npx nx graph

# Show project details
npx nx show project <project-name>

# Show affected projects
npx nx affected:apps
npx nx affected:libs

# Run only affected tests/builds
npx nx affected -t test
npx nx affected -t build
```
