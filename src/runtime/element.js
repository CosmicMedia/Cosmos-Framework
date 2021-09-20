import { get_current_component } from "..";
export class Element {

	//$ = API method/variable
	//_ = Internal method/variable

	//Element management
	_parentElement; //Parent element to this
	_childrenElements = new Set(); //Child elements

	//Component management
	$parent; //Parent component
	$children = new Set(); //Child components

	_element;
	_attrs;
	_updateListeners = new Set();

	_eventListeners = [];

	constructor(element, children, attrs = {}, parent = undefined) {
		//create element
		if (element == "#text") {
			if (children[0].subscribe !== undefined) {
				this._element = document.createTextNode(children[0].get());

				this._updateListeners.add(children[0].subscribe((new_val, old_val) => {
					this._element.textContent = new_val;
				}))
			} else {
				this._element = document.createTextNode(children[0]);
			}
		} else {
			this._element = document.createElement(element);

			for (const [key, child] of Object.entries(children)) {
				this.add_child(child);
			}

			this.set_attributes(attrs);
		}
	}

	set_attributes (attrs) {
		for (let [key, value] of Object.entries(attrs)) {
			if (key.startsWith("on") && typeof value == "function") {
				this._element.addEventListener(key.replace('on', '').toLowerCase(), value)
				this._eventListeners.push({fn: value, e: key.replace('on', '').toLowerCase()});
			} else {
				if (value.subscribe !== undefined) {
					this._element.setAttribute(key, value.get());
					this._updateListeners.add(value.subscribe(((new_val, old_val) => {
						this._element.setAttribute(key, new_val);
					})).bind(this))
				} else {
					this._element.setAttribute(key, value);
				}
			}
		}
	}

	set_parent(parent) {
		this._parentElement = parent;
	}

	add_child(child) {
		child.set_parent(this);
		this._childrenElements.add(child);
	}

	remove_child(child) {
		this._childrenElements.delete(child);
	}

	async mount (root, before = false) {
		//console.log(root);
		if (before) root.parentNode.insertBefore(this._element, root)
		else root.appendChild(this._element);

		//Appends mount's children
		for (let child of this._childrenElements) {
			await child.mount(this._element);
		}
	}

	async destroy () {
		for (let r of this._updateListeners) r();
		for (let r of this._eventListeners) this._element.removeEventListener(r.e, r.fn);
		this._element.remove();
		if (this._parentElement) this._parentElement.remove_child(this);

		for (let child of this._childrenElements) {
			await child.destroy();
		}
	}
}