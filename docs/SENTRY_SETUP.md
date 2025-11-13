# Sentry Quraşdırılması

## 1. Sentry Account Yaradın
https://sentry.io/ - Pulsuz account yaradın

## 2. Package quraşdırın
```bash
npm install @sentry/nextjs
```

## 3. Sentry konfiqurasiya edin
```bash
npx @sentry/wizard@latest -i nextjs
```

## 4. Environment variable əlavə edin

`.env.local`:
```bash
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn-here
SENTRY_AUTH_TOKEN=your-auth-token
```

## 5. Sentry istifadəsi

### Error Boundary
```typescript
// src/app/error.tsx
'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function Error({ error }: { error: Error }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return <div>Error occurred</div>;
}
```

### Manual error tracking
```typescript
import * as Sentry from '@sentry/nextjs';

try {
  // some code
} catch (error) {
  Sentry.captureException(error);
}
```

## 6. Production-da istifadə

Build zamanı source maps avtomatik Sentry-yə yüklənəcək:
```bash
npm run build
```

## 7. Dashboard
https://sentry.io/organizations/your-org/issues/

Burada bütün xətaları görə bilərsiniz:
- Stack trace
- User info
- Browser info
- Hansı səhifədə
- Neçə dəfə baş verib


