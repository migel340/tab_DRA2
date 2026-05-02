Error handling

- Use `Schema.parse(raw)` for expected success shapes; let it throw if API contract violated.
- For 404 or not-found cases, service may return `undefined` if callers expect that; document this choice.
- Throw for unexpected server responses to make failures visible and testable.

When to throw vs return

- Throw Response or Error: transport errors, unexpected payload shapes, or retryable failures.
- Return undefined: application-level not-found when caller logic explicitly handles missing data.

Mapping

- Keep mapping simple and explicit. Map only fields needed by domain.
- Centralize transforms in service to avoid duplication in loaders/components.
