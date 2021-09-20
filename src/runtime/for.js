import isEqual from 'lodash.isequal';
import { get_current_component, set_current_component } from "./index";

//TODO work on reactivity
export class For {

	//$ = API method/variable
	//_ = Internal method/variable
	$parent;

	//Element management
	_parentElement; //Parent element to this

	//Conditional exclusive ;)
	_anchor; //Anchor point for loop
	_array; //Array value
	_cb;

	_children = [];

	constructor (array, cb) {
		//Create anchor point
		this._anchor = document.createTextNode('');
		this._cb = cb;
		this._array = array;
	}

	set_parent(parent) {
		this._parentElement = parent;
	}

	remove_child () {}

	async update () {
		
	}

	async mount (root, before = false) {
		//Mount anchor point
		root.appendChild(this._anchor);
		this.$parent = get_current_component();

		//Initialize reactive vars.
		//console.log(this._array);
		//TODO do this but not stupid
		for (let i in this._array.value) {
			let output = await this._cb(this._array.value[i]);
			if (output !== undefined || output !== null) this._children.push(output);
		}

		for (let i in this._children) {
			set_current_component(this.$parent);
			await this._children[i].mount(this._anchor, true);
		}
	}

	async destroy () {
		this._anchor.remove();
		for (let element of this._children) element.destroy();
		if (this._parentElement) this._parentElement.remove_child(this);
	}

}