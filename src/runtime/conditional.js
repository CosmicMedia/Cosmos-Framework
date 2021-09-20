import isEqual from 'lodash.isequal';
import { get_current_component, set_current_component } from "./index";

export class Conditional {

	//$ = API method/variable
	//_ = Internal method/variable

	//Element management
	_parentElement; //Parent element to this
	_childrenElements = new Set(); //Child elements

	//Component management
	$parent; //Parent component
	$children = new Set(); //Child components

	//Conditional exclusive ;)
	_anchor; //Anchor point for conditional
	_conditional; //Conditional callback
	_activeElement; //Current active element(s)
	_vars = []; //Vars to pass to conditional
	_reactiveVars = []; //Reactive vars passed to constructor
	_updateListeners = []; //Update listeners from reactive vars

	constructor (vars, cb) {
		//Create anchor point
		this._anchor = document.createTextNode('');
		this._conditional = cb;
		this._reactiveVars = vars;
	}

	async update () {
		//Run conditional callback
		let output = await this._conditional(this._vars);
		if (output !== null && output !== undefined && this._activeElement == undefined) {
			if (this.$parent.$children) this.$parent.$children.add(output);
			set_current_component(this.$parent);
			await output.mount(this._anchor, true);
			await output.set_parent(this);
			this._activeElement = output;
			output = undefined;
		} else if (output == null && output == undefined && this._activeElement !== undefined) {
			if (this.$parent.$children) this.$parent.$children.delete(this._activeElement);
			this._activeElement.destroy();
			this._activeElement = undefined;
		}
	}

	set_parent(parent) {
		this._parentElement = parent;
	}

	remove_child () {}

	async mount (root, before = false) {
		//Mount anchor point
		root.appendChild(this._anchor);

		this.$parent = get_current_component();

		//Initialize reactive vars.
		for (let i in this._reactiveVars) {
			//Get intial values
			this._vars[i] = this._reactiveVars[i].get();

			//Stores update listeners so they can be disposed of on destroy.
			this._updateListeners.push(
				this._reactiveVars[i].subscribe(((new_val, old_val) => {
					this._vars[i] = new_val;
					this.update();
				}).bind(this))
			);
		}

		//Run update
		await this.update();
	}

	async destroy () {
		for (let i in this._updateListeners) this._updateListeners[i]();
		this._anchor.remove();
		if (this._activeElement) this._activeElement.destroy();
		if (this._parentElement) this._parentElement.remove_child(this);
	}

}