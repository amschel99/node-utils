

### v2.0.0

Fixed a critical bug to correctly initialize __dirname at src/seed.ts line 8
```javascript
const __dirname = dirname(fileURLToPath(import.meta.url));
```