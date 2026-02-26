# Service Removal Strategy (Keep Booking History)

## Goal
Allow a provider/admin to remove a service from the active catalog while preserving all past booking records and their business/audit value.

## Recommended Approach
Use **soft removal (archive)** for services with booking history, and optional hard delete only when no bookings exist.

- Provider action: `Remove Service` should become `Archive Service` when bookings exist.
- Data model keeps service row for historical joins, but removes it from customer discovery.
- Existing bookings continue to reference the same `service_id`.

## Why This Is Production-Safe
- Preserves audit trail and dispute evidence.
- Preserves analytics/revenue/reporting integrity.
- Avoids FK breakage and accidental data loss.
- Keeps legal/compliance retention options open.

## Data Model Changes
Add explicit lifecycle fields to `services`:

- `archived_at TIMESTAMPTZ NULL`
- `archived_by UUID NULL REFERENCES users(id)`
- `archive_reason TEXT NULL`

Keep `is_active` for listing toggle, but define states:

- Active: `is_active = true` and `archived_at IS NULL`
- Hidden/Paused: `is_active = false` and `archived_at IS NULL`
- Archived/Removed: `archived_at IS NOT NULL` (cannot be booked)

### Migration Example
```sql
ALTER TABLE services
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS archived_by UUID NULL REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS archive_reason TEXT NULL;

CREATE INDEX IF NOT EXISTS idx_services_archived_at ON services(archived_at);
```

## API Behavior
### 1) Catalog endpoints
Filter out archived services:

```sql
WHERE s.is_active = true
  AND s.archived_at IS NULL
```

### 2) Booking endpoint
Reject booking if archived or inactive:
- `409 Conflict`
- Message: `This service is no longer available.`

### 3) Provider remove endpoint
`DELETE /services/:id` should be behavior-based:

- If booking count = 0: hard delete allowed.
- If booking count > 0: archive instead of hard delete.

Response example:
```json
{
  "mode": "archived",
  "message": "Service archived because it has booking history.",
  "service_id": "..."
}
```

### 4) Optional admin force-delete endpoint
If ever needed, make it admin-only with explicit reason and audit log:
- `DELETE /admin/services/:id?force=true`
- Requires no active legal hold/compliance lock
- Writes audit entry

## Query/Join Strategy for History
Bookings should not rely on live service fields for historical display.

For durable history, add snapshot fields on booking creation:
- `bookings.service_title_snapshot`
- `bookings.service_price_snapshot`
- `bookings.service_category_snapshot`

This guarantees booking detail pages still show meaningful service metadata even if service is archived/renamed.

## UI/UX Changes
### Provider dashboard
- Replace destructive `Delete` label with `Remove`.
- If service has bookings:
  - Show modal: `This service has booking history and will be archived, not permanently deleted.`
  - Confirm button: `Archive Service`.
- If no bookings:
  - Confirm button: `Delete Permanently`.

### Client side
- Archived services not shown in browse/search/saved lists.
- If trying to book stale open detail page, booking summary shows error and redirects to Services (already aligned with current behavior).

## Operational Guardrails
- Add audit log entries for archive/delete actions.
- Prevent unarchive unless role permits.
- Keep DB FK from `bookings.service_id -> services.id` as-is (no cascade delete for provider actions).

## Testing Plan
1. Service with bookings -> remove action archives, bookings remain intact.
2. Service with zero bookings -> hard delete succeeds.
3. Archived service no longer appears in catalog.
4. Booking archived service returns `409`.
5. Provider cannot archive/delete another provider’s service.
6. Historical booking detail still renders service info (snapshot-backed).

## Implementation Order
1. DB migration for archive columns (and optional booking snapshots).
2. Backend service listing filters + booking guard.
3. Remove endpoint behavior (archive vs hard delete).
4. Provider UI copy + modal logic update.
5. Tests (controller/model/integration).

## Decision Summary
For this platform, the safest production design is:
- **Archive by default when history exists**
- **Hard delete only when no bookings exist**
- **Retain booking history always**
