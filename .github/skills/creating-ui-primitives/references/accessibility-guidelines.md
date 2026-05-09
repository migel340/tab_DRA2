Accessibility guidelines — quick checklist

- Semantic roles & structure:
  - Use semantic elements first: `<table>`, `<thead>`, `<tbody>`, `<button>`, `<a>`.
  - Add roles when semantics are insufficient: `role="row"`, `role="cell"`, `role="columnheader"`.

- Keyboard interaction:
  - Ensure all interactive controls are reachable via Tab.
  - Provide `onKeyDown` handlers mirroring click behavior for `Enter` and `Space`.
  - Example: `onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(e)}`.

- Focus management:
  - Use `tabIndex={0}` for focusable non-button rows.
  - Ensure visible focus ring via repo CSS utilities (use `cn()` to toggle focus styles).
  - Move focus programmatically when opening dialogs or navigating between regions.

- Announcements / live regions:
  - Provide an `aria-live` region for non-focus announcements: `aria-live="polite"`.
  - Update the region text when sorting/filtering completes or when errors occur.

- Accessible sorting:
  - Mark headers with `aria-sort` values: `"none" | "ascending" | "descending"`.
  - Example: `<button aria-sort="ascending" aria-label="Sort by name ascending">Name</button>`.

- Contrast & labels:
  - Ensure text/icon contrast meets WCAG AA.
  - Provide clear labels: `aria-label`, `aria-labelledby`, or visible labels for controls.

- Error announcements:
  - Use `aria-describedby` to point to an error message element.
  - For global errors, update an `aria-live` region with the error message.
  - Example: `<div id="error-msg">Failed to save</div><input aria-describedby="error-msg" />`.

- Testing tips:
  - Keyboard-only walkthrough: Tab through controls, use Enter/Space, verify focus.
  - Screen reader check: With NVDA/VoiceOver, verify announcements and reading order.
  - Automated checks: Add a11y linting (eslint-plugin-jsx-a11y) in CI.
