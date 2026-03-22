# Backend Events Pattern Reference

Step-by-step guide for creating events, handlers, and event bus wiring in the NestJS backend.

## Step 1: Define the Event in ApiEvents

File: `libs/event-store/src/events/api-events.ts`

```typescript
export const ApiEvents = {
  // Add to the appropriate domain section
  OrderRefunded: 'store.order.refunded',
} as const

export type ApiEventMap = {
  [ApiEvents.OrderRefunded]: { orderId: string; refundAmount: number }
}
```

**Naming**: `{Domain}{Entity}{PastTenseVerb}` → `'store.{entity}.{verb}'`

## Step 2: Append the Event (Producer Side)

```typescript
import { EventStoreService } from '@/libs/event-store/services'
import { ApiEvents } from '@/libs/event-store/events'

// Inside a service method — always pass transaction if inside a DB transaction
await this.eventStore.append({
  eventName: ApiEvents.OrderRefunded,
  payload: { orderId, refundAmount },
  transaction  // CRITICAL: ties event to the same DB transaction
})
```

Options: `eventName`, `payload`, `transaction` (optional), `delay` (optional, seconds).

## Step 3: Create the Event Handler (Consumer Side)

File: `apps/{app}/src/modules/{module}/events/handlers/{descriptive-name}.handler.ts`

```typescript
import { IMessageHandler, MessageHandler } from '@nestjstools/messaging'
import { ApiEventEnvelope, ApiEvents } from '@/libs/event-store/events'
import { Logger } from '@nestjs/common'

type Event = ApiEventEnvelope<typeof ApiEvents.OrderRefunded>

@MessageHandler(ApiEvents.OrderRefunded)
export class ProcessRefundedOrderHandler implements IMessageHandler<Event> {
  constructor(
    private readonly someService: SomeService,
    private readonly logger: Logger
  ) {}

  async handle(event: Event) {
    const { orderId, refundAmount } = event.payload

    this.logger.debug('Processing refunded order', { orderId })

    // Your business logic here

    this.logger.debug('Processed refunded order', { orderId })
  }
}
```

**Handler naming**: `{DescriptiveAction}Handler` → file: `{descriptive-action}.handler.ts`

## Step 4: Register the Handler in the Module

```typescript
// In the module file
@Module({
  providers: [
    ProcessRefundedOrderHandler,
    // ... other providers
  ]
})
export class SomeModule {}
```

## Step 5: Add the Binding Key to EventBusModule

File: `apps/{app}/src/modules/core/event-bus.module.ts`

Add the event to the `bindingKeys` array of the consuming app:

```typescript
bindingKeys: [
  ApiEvents.OrderRefunded,  // ADD THIS
  // ... existing binding keys
],
```

**CRITICAL**: Without the binding key, the handler will never receive the event.

## Event Bus Queue Reference

| App | Queue Name | Has Consumer | Notes |
|-----|-----------|-------------|-------|
| dash-api | `api_event_bus_dash` | Yes | Primary event producer + consumer |
| shop-api | `api_event_bus_shop` | Yes | Customer-facing event consumer |
| job-worker | `api_event_bus_job_worker` | Yes | Cron + event hybrid |
| store-webhook | `api_event_bus_store_webhook` | Yes | Webhook delivery consumer |
| tracking | N/A | No (publisher only) | Publishes events, no consumer |
| comms-hub | N/A | No (uses Bull queues) | Email/SMS via Bull, not RabbitMQ |
| short-url | N/A | No | Standalone REST service |
| internal-api | N/A | No | Standalone REST service |

## Multi-Event Handler Pattern

```typescript
@MessageHandler(ApiEvents.OrderCreated, ApiEvents.OrderConfirmed, ApiEvents.OrderPaymentSucceeded)
export class OrderEventsHandler implements IMessageHandler<Event> {
  async handle(event: Event) {
    // Use event.topic to distinguish which event was received
    switch (event.topic) {
      case ApiEvents.OrderCreated:
        // handle creation
        break
      case ApiEvents.OrderConfirmed:
        // handle confirmation
        break
    }
  }
}
```

**Remember**: Add ALL binding keys for multi-event handlers to the EventBusModule.

## Event Chaining (Handler Emits New Events)

```typescript
@MessageHandler(ApiEvents.OrderCancelled)
export class UnfulfillCancelledOrderHandler implements IMessageHandler<Event> {
  constructor(
    private readonly eventStore: EventStoreService,
    // ...
  ) {}

  async handle(event: Event) {
    const { orderId } = event.payload
    // Do work...

    // Emit a follow-up event (NO transaction needed — handlers run outside DB transactions)
    await this.eventStore.append({
      eventName: ApiEvents.OrderUnfulfilled,
      payload: { orderId }
    })
  }
}
```

## Redis Dedup Lock Pattern (store-webhook, comms-hub)

For handlers that must be idempotent:

```typescript
import { DistributedLockService } from '@/libs/distributed-lock'

async handle(event: Event) {
  const lockKey = `handler:process-refund:${event.payload.orderId}`
  const acquired = await this.lockService.acquire(lockKey, 60) // 60s TTL
  if (!acquired) return // Already processed
  // ... handle event
}
```

## Common Mistakes

1. **Forgetting to add binding key** — Handler exists but never fires
2. **Not passing `transaction`** — Event dispatched even if DB transaction rolls back
3. **Wrong event name casing** — Use `ApiEvents.X` constant, never raw strings
4. **Missing handler registration** — Handler class not added to module `providers`
5. **Mutating in public shop-api handlers** — Shop-api handlers should rarely write to DB; prefer emitting events back to dash-api
