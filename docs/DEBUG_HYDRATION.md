# Hydration Xətalarını Debug Etmək

## 🔍 Method 1: React DevTools

### Quraşdırma:
1. Chrome/Edge Extension mağazasından "React Developer Tools" quraşdırın
2. Browser console açın (F12)
3. "Components" tab-a keçin

### İstifadə:
- Xəta baş verdikdə console-da hansı komponentin səbəb olduğunu göstərir
- Component tree-də problem olan yeri vurğulayır

---

## 🔍 Method 2: Console Log Debugging

### Komponenti izləmək:
```typescript
'use client';

export function MyComponent() {
  console.log('🔵 Server/Client render');
  
  const [data, setData] = useState(() => {
    console.log('🟢 Initial state');
    return null;
  });

  useEffect(() => {
    console.log('🟡 useEffect (client only)');
  }, []);

  return <div>Content</div>;
}
```

### Output:
```
Server render:
🔵 Server/Client render
🟢 Initial state

Client render:
🔵 Server/Client render
🟢 Initial state
🟡 useEffect (client only)
```

---

## 🔍 Method 3: Suppressions (Müvəqqəti)

**QEYD**: Yalnız debug üçün! Production-da istifadə etməyin.

```typescript
<div suppressHydrationWarning>
  {new Date().toLocaleString()}
</div>
```

---

## 🔍 Method 4: React 18 DevTools

Next.js 14-də React DevTools avtomatik olaraq hydration xətalarını göstərir.

### Aktivləşdirmək:
`.env.local`:
```bash
NEXT_PUBLIC_REACT_STRICT_MODE=true
```

`next.config.js`:
```javascript
module.exports = {
  reactStrictMode: true,
}
```

---

## 🐛 Ümumi Hydration Problemləri

### 1. localStorage
```typescript
// ❌ Səhv
const [user, setUser] = useState(localStorage.getItem('user'));

// ✅ Düzgün
const [user, setUser] = useState(null);
useEffect(() => {
  setUser(localStorage.getItem('user'));
}, []);
```

### 2. Date.now() və random
```typescript
// ❌ Səhv
<div>{Date.now()}</div>

// ✅ Düzgün
const [time, setTime] = useState<number | null>(null);
useEffect(() => {
  setTime(Date.now());
}, []);
```

### 3. window/document
```typescript
// ❌ Səhv
const width = window.innerWidth;

// ✅ Düzgün
const [width, setWidth] = useState(0);
useEffect(() => {
  setWidth(window.innerWidth);
}, []);
```

### 4. Third-party libraries (recharts, etc)
```typescript
// ✅ Həll
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);

if (!isMounted) {
  return <div>Loading...</div>;
}

return <ThirdPartyComponent />;
```

---

## 🛠️ isMounted Pattern

**Universal həll**:
```typescript
'use client';

export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return isMounted;
}

// İstifadə:
export function MyComponent() {
  const isMounted = useIsMounted();
  
  if (!isMounted) {
    return <Skeleton />;
  }
  
  return <ActualContent />;
}
```

---

## 📊 Next.js Debugging Tools

### 1. Analyze Bundle
```bash
npm install @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({...})

# Run
ANALYZE=true npm run build
```

### 2. Turbopack Dev Mode
```bash
npm run dev --turbo
```

---

## 🎯 Best Practices

1. **'use client' directive**
   - Yalnız lazım olan komponentlərə əlavə edin
   - Server Components default-dur

2. **Dynamic imports**
   ```typescript
   const Chart = dynamic(() => import('./Chart'), { ssr: false });
   ```

3. **isMounted pattern**
   - Third-party libraries üçün
   - Browser API-lər üçün

4. **typeof window checks**
   - window, localStorage istifadə edərkən

5. **Sentry/Error tracking**
   - Production xətalarını izləmək üçün


