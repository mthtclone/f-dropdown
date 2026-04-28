# f-dropdown

A lightweight Web Component for nested dropdowns.

## Install

npm install @mthtclone/f-dropdown

## Usage

```
import "@mthtclone/f-dropdown";

<f-dropdown name="department">
  Select Department

  <f-group label="Engineering">
    <f-option value="cs">CS</f-option>
  </f-group>
</f-dropdown>
```

`f-dropdown` supports a hook-based theming API for dynamic styling, powered by CSS variables internally.

Use the built-in useTheme() API for programmatic styling.

```
const dropdown = document.querySelector("f-dropdown");

dropdown.useTheme((theme) => {
  theme.setAll({
    bg: "black",
    color: "white",
    menuBg: "#111",
    hover: "#222",
    activeBg: "#333",
    activeOutline: "#666"
  });
});
</style>
```

Individual values can also be set like this.
```
dropdown.useTheme((theme) => {
  theme.set("bg", "black");
  theme.set("color", "white");
});
```

The component comes with presets but this is only experimental for now.

```
dropdown.applyPreset("dark");
dropdown.applyPreset("danger");
```

You can still style the component using CSS variable directly.

```
<style>
  f-dropdown.custom {
    --f-dropdown-bg: black;
    --f-dropdown-color: white;
    --f-dropdown-hover: #222;
  }
</style>

<f-dropdown class="custom" name="programme">
  Select programme
</f-dropdown>
```

### Theme Tokens
| Token                  	| Attributes         	| Default  	|
|-----------------------------	|--------------------	|----------	|
| bg             	| Trigger background 	| white    	|
| color          	| Trigger text color 	| #333     	|
| border         	| Trigger border     	| #d0d5dd  	|
| radius         	| Border radius      	| 10px     	|
| menuBg       	  | Menu background    	| white    	|
| hover          	| Hover state        	| #f2f2f2  	|
| activeBg      	| Active item        	| #e6f0ff  	|
| activeOutline 	| Active outline     	| #4c8dff  	|


### CSS Variables
| Variables                   	| Attributes         	| Default  	|
|-----------------------------	|--------------------	|----------	|
| --f-dropdown-bg             	| Trigger background 	| white    	|
| --f-dropdown-color          	| Trigger text color 	| #333     	|
| --f-dropdown-border         	| Trigger border     	| #d0d5dd  	|
| --f-dropdown-radius         	| Border radius      	| 10px     	|
| --f-dropdown-menu-bg        	| Menu background    	| white    	|
| --f-dropdown-menu-border    	| Menu border        	| #ddd     	|
| --f-dropdown-hover          	| Hover state        	| #f2f2f2  	|
| --f-dropdown-active-bg      	| Active item        	| #e6f0ff  	|
| --f-dropdown-active-outline 	| Active outline     	| #4c8dff  	|

## Form Validation
The `<f-dropdown>` component now includes built-in form compatibility and validation utilities, making it usable both as a flexible UI component and a form-aware field when needed.

Each dropdown maintains its own internal value state. You can read or set the selected value directly.

```js
const dropdown = document.querySelector('f-dropdown');

console.log(dropdown.value); // get current value
dropdown.value = "BCS";      // set value programmatically
```
When a selection is made, the component automatically updates its internal state and keeps a hidden input in sync for form submission.

## Validation API
The component provides lightweight validation methods that can be used externally (e.g., in form flows or wizards).

```js
dropdown.checkValidity();   // returns true/false (no UI side effects)
dropdown.reportValidity();  // returns true/false + applies aria-invalid state
dropdown.isValid();         // convenience wrapper (same behavior as reportValidity)
```

Validation is opt-in and only enforced when the required attribute is present.
```html
<f-dropdown name="programme" required>
```
If required is not set, the dropdown is always considered valid.

To check whether a dropdown is required:
```js
dropdown.isRequired(); // returns true if "required" attribute exists
```
This allows flexiable usage where the same component can be used as either a required form field or a non-required UI selector.

> [!NOTE]  
> - The component is NOT automatically included in native form validation.
> - You must explicitly call checkValidity() or reportValidity() in your form logic.
> - On selection, a hidden input is automatically created/updated to ensure compatibility with standard form submission (FormData)

## Features

- Nested dropdown support
- Keyboard navigation
- Form compatible
- No framework required
- CSS styling with hooks

