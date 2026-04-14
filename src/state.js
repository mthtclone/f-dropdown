export class DropdownState {
    constructor() {
      this.path = [];
      this.value = null;
      this.selectedLabel = "";
    }
  
    reset() {
      this.path = [];
      this.value = null;
    }
  
    setValue(value) {
      this.value = value;
    }
  
    pushPath(label) {
      this.path.push(label);
    }
  
    popPath() {
      this.path.pop();
    }
  
    get depth() {
      return this.path.length;
    }
}