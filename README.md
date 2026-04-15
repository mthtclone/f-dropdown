# f-dropdown

A lightweight Web Component for nested dropdowns.

## Install

npm install f-dropdown

## Usage

```
import "f-dropdown";

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

## Features

- Nested dropdown support
- Keyboard navigation
- Form compatible
- No framework required
- CSS styling with hooks

