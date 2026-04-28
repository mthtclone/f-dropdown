class FDropdown extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.columns = [];
    this.value = "";

    this.active = { col: 0, row: 0 };

    this.themeMap = {
      bg: "--f-dropdown-bg",
      color: "--f-dropdown-color",
      menuBg: "--f-dropdown-menu-bg",
      hover: "--f-dropdown-hover",
      border: "--f-dropdown-border",
      radius: "--f-dropdown-radius",
      activeBg: "--f-dropdown-active-bg",
      activeOutline: "--f-dropdown-active-outline",
      itemColor: "--f-dropdown-item-color",
    };

    this.presets = {
      default: {
        bg: "white",
        color: "#333",
        menuBg: "white"
      },
      dark: {
        bg: "#111",
        color: "#fff",
        menuBg: "#1e1e1e",
        hover: "#333"
      },
      danger: {
        bg: "#dc2626",
        color: "#fff",
        hover: "#b91c1c"
      }
    };

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          position: relative;
          font-family: sans-serif;
        }

        .menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          width: max-content;
        }

        :host([open]) .menu {
          display: block;
        }

        .column {
          min-width: 180px;
          background: var(--f-dropdown-menu-bg, white);
          border: 1px solid var(--f-dropdown-menu-border, #ddd);
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
          padding: 6px;
          z-index: 999;

          position: absolute;
          top: 0;
          left: 0;

          transition: transform 0.2s ease;
        }

        .item, .group {
          padding: 6px;
          cursor: pointer;
          color: var(--f-dropdown-item-color, var(--f-dropdown-color, #333));
        }

        .item:hover,
        .group:hover {
          background: var(--f-dropdown-hover, #f2f2f2);
        }

        .active {
          background: var(--f-dropdown-active-bg, #e6f0ff);
          outline: 2px solid var(--f-dropdown-active-outline, #4c8dff);
        }

        .trigger {
          all: unset;
          box-sizing: border-box;

          display: inline-flex;
          align-items: center;
          justify-content: space-between;

          gap: 10px;

          padding: 10px 12px;
          min-width: 200px;

          border: 1px solid var(--f-dropdown-border, #d0d5dd);
          border-radius: var(--f-dropdown-radius, 10px);

          background: var(--f-dropdown-bg, white);
          color: var(--f-dropdown-color, #333);
          cursor: pointer;

          font-size: 14px;

          box-shadow: 0 1px 2px rgba(0,0,0,0.05);

          transition: all 0.15s ease;
        }

        .trigger:hover {
          border-color: #9aa4b2;
        }

        .trigger:focus {
          outline: 2px solid #2563eb;
          outline-offset: 2px;
        }

        .chevron {
          margin-left: auto;
          opacity: 0.6;
          font-size: 12px;
        }
      </style>

      <button class="trigger" type="button">
        <span class="trigger-text"></span>
        <span class="chevron">▾</span>
      </button>

      <div class="menu"></div>
    `;
  }

  connectedCallback() {
    this.trigger = this.shadowRoot.querySelector(".trigger");
    this.menu = this.shadowRoot.querySelector(".menu");
    this.triggerTextEl = this.shadowRoot.querySelector(".trigger-text");
  
    const textNode = Array.from(this.childNodes)
      .find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
  
    this.placeholder = textNode?.textContent.trim() || "Select";
  
    this.triggerTextEl.textContent = this.placeholder;
  
    this.trigger.addEventListener("click", () => this.toggle());
  
    this.addEventListener("keydown", this.onKeyDown);
    this.setAttribute("tabindex", "0");
  
    this.buildTree();
  }

  get value() {
    return this._value || "";
  }
  
  set value(val) {
    this._value = val || "";
  }

  checkValidity() {
    return !!this.value?.toString().trim();
  }
  
  reportValidity() {
    const valid = this.checkValidity();
  
    if (!valid) {
      this.setAttribute("aria-invalid", "true");
    } else {
      this.removeAttribute("aria-invalid");
    }
  
    return valid;
  }

  isRequired() {
    return this.hasAttribute("required");
  }

  isValid() {
    return this.reportValidity();
  }

  setTheme(values = {}) {
    Object.entries(values).forEach(([key, value]) => {
      const cssVar = this.themeMap[key];
      if (!cssVar) return;
      this.style.setProperty(cssVar, value);
    });
  }

  useTheme(input) {
    const api = {
      set: (key, value) => {
        const cssVar = this.themeMap[key];
        if (!cssVar) return;
        this.style.setProperty(cssVar, value);
      },
      setAll: (obj) => this.setTheme(obj)
    };

    if (typeof input === "function") {
      input(api);
    } else if (typeof input === "object") {
      this.setTheme(input);
    }

    return api;
  }

  applyPreset(name) {
    const preset = this.presets[name];
    if (!preset) return;
    this.setTheme(preset);
  }

  onKeyDown = (e) => {
    if (!this.hasAttribute("open")) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.open();
      }
      return;
    }

    const col = this.columns[this.active.col];
    if (!col) return;

    const items = col.nodes;

    switch (e.key) {
      case "Escape":
        this.close();
        break;

      case "ArrowDown":
        e.preventDefault();
        this.active.row = (this.active.row + 1) % items.length;
        this.updateActive();
        break;

      case "ArrowUp":
        e.preventDefault();
        this.active.row =
          (this.active.row - 1 + items.length) % items.length;
        this.updateActive();
        break;

      case "ArrowRight": {
        const item = items[this.active.row];
        if (item?.type === "group") {
          this.openGroup(item.node, this.active.col);
          this.active.col++;
          this.active.row = 0;
          this.updateActive();
        }
        break;
      }

      case "ArrowLeft":
        if (this.active.col > 0) {
          this.columns.pop();
          this.active.col--;
          this.active.row = 0;
          this.renderColumns();
          this.updateActive();
        }
        break;

      case "Enter": {
        const item = items[this.active.row];
        if (!item) return;

        if (item.type === "group") {
          this.openGroup(item.node, this.active.col);
          this.active.col++;
          this.active.row = 0;
        }

        if (item.type === "leaf") {
          this.selectValue(item.value, item.label);
        }

        this.updateActive();
        break;
      }
    }
  };

  updateActive() {
    const cols = this.menu.querySelectorAll(".column");

    cols.forEach((colEl, colIndex) => {
      const items = colEl.querySelectorAll(".item, .group");

      items.forEach((el, rowIndex) => {
        el.classList.toggle(
          "active",
          colIndex === this.active.col &&
          rowIndex === this.active.row
        );
      });
    });
  }

  buildTree() {
    this.tree = Array.from(this.children).filter(
      el => el.tagName === "F-GROUP" || el.tagName === "F-OPTION"
    );
  }

  toggle() {
    this.hasAttribute("open") ? this.close() : this.open();
  }

  open() {
    this.setAttribute("open", "");
    this.renderRoot();
    this.active = { col: 0, row: 0 };
  }

  close() {
    this.removeAttribute("open");
    this.menu.innerHTML = "";
    this.columns = [];
  }

  renderRoot() {
    this.menu.innerHTML = "";
    this.columns = [];

    this.columns.push({
      nodes: this.buildNodes(this.tree),
      level: 0
    });

    this.renderColumns();
  }

  buildNodes(nodeList) {
    const result = [];

    nodeList.forEach(node => {
      if (node.tagName === "F-GROUP") {
        result.push({
          type: "group",
          label: node.getAttribute("label"),
          node
        });
      }

      if (node.tagName === "F-OPTION") {
        result.push({
          type: "leaf",
          label: node.textContent.trim(),
          value: node.getAttribute("value"),
          node
        });
      }
    });

    return result;
  }

  renderColumns() {
    this.menu.innerHTML = "";

    const offsetX = 170;
    const offsetY = 14;

    this.columns.forEach((col, index) => {
      const column = document.createElement("div");
      column.className = "column";

      col.nodes.forEach(item => {
        const el = document.createElement("div");

        el.className = item.type === "group" ? "group" : "item";
        el.textContent = item.label;

        el.addEventListener("click", (e) => {
          e.stopPropagation();

          if (item.type === "group") {
            this.openGroup(item.node, index);
            this.active.col = index + 1;
            this.active.row = 0;
          }

          if (item.type === "leaf") {
            this.selectValue(item.value, item.label);
          }

          this.updateActive();
        });

        column.appendChild(el);
      });

      column.style.transform = `
        translate(${index * offsetX}px, ${index * offsetY}px)
      `;

      column.style.zIndex = 100 + index;

      this.menu.appendChild(column);
    });

    this.updateActive();
  }

  openGroup(node, level) {
    const children = Array.from(node.children).filter(
      el => el.tagName === "F-GROUP" || el.tagName === "F-OPTION"
    );

    const newNodes = this.buildNodes(children);

    this.columns = this.columns.slice(0, level + 1);

    this.columns.push({
      nodes: newNodes,
      level: level + 1
    });

    this.renderColumns();
  }

  selectValue(value, label) {
    this.value = value;
  
    let input = this.querySelector("input[type='hidden']");
  
    if (!input) {
      input = document.createElement("input");
      input.type = "hidden";
      input.name = this.getAttribute("name");
      this.appendChild(input);
    }
  
    input.value = value;
  
    this._value = value;
  
    this.triggerTextEl.textContent = label;
  
    this.dispatchEvent(
      new CustomEvent("f-select", {
        detail: { value, label },
        bubbles: true
      })
    );
  
    this.removeAttribute("aria-invalid");
  
    this.close();
  }
}

if (!customElements.get("f-dropdown")) {
  customElements.define("f-dropdown", FDropdown);
}