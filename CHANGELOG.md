## Changelog

### 1.0.2
- Added Theme Hook API for dynamic styling (useTheme, applyPreset)
- Improved styling system with CSS variable + hook compatibility
- Static styling via CSS variables is fully supported

### 1.0.22
- Added built-in form compatibility API for `<f-dropdown>`:
  - `checkValidity()` → returns `true/false` based on selected value
  - `reportValidity()` → applies `aria-invalid` state when invalid
  - `isValid()` → convenience wrapper around validation flow
  - `isRequired()` → detects presence of `required` attribute

- Added native-style validation support for required dropdowns:
  - Empty selection is treated as invalid when `required` is present
  - Validation is safe to call externally without breaking component state

Usage
```html
<f-dropdown name="programme" required>
  Select your programme
  <f-option value="BCS">BCS</f-option>
</f-dropdown>
```

JS validation API
```js
const dropdown = document.querySelector("f-dropdown");

// Check validity (no UI side effects)
dropdown.checkValidity();

// Validate + show UI state (aria-invalid)
dropdown.reportValidity();

// Convenience wrapper
dropdown.isValid();
```