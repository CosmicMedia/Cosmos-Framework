import Conditional from './conditional';
import Element from './element';
import For from './for';

export default class Component {
	cosmosFramework;
	//$ = API method/variable
	//_ = Internal method/variable

	//Element management
	_parentElement; //Parent element to this
	_childrenElements = new Set(); //Child elements

	//Component management
	$parent; //Parent component
	$children = new Set(); //Child components
	$props;

	constructor (options = {}) {
		//Todo this.mount if is root element
		if (options.mount !== undefined && !(typeof window === 'undefined')) {
			options.mount.innerHTML = "";
			this.mount(options.mount);
		}
		if (options.props) this.$props = options.props;
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
		this._parentElement = root;
		this.$parent = get_current_component();

		if (get_current_component()) get_current_component().$children.add(this);
		set_current_component(this);
		await this.instance();
		//Adds component
		this.add_child(await this.render());
		if (this.beforeMounted) await this.beforeMounted();

		for (let child of this._childrenElements) {
			set_current_component(this);
			if (before) await child.mount(root, before)
			else await child.mount(root);
		}
		if (this.mounted) await this.mounted();
	}

	async destroy () {
		if (this.beforeUnmount) await this.beforeUnmount();
		if (this._parentElement && this._parentElement.remove_child) this._parentElement.remove_child(this);

		for (let child of this._childrenElements) await child.destroy();
		if (this.unmounted) await this.unmounted();
	}

	createElement (type, attrs = {}, ...children) {
		children = children.filter((child) => child !== false)
		if (attrs == null) attrs = {};

		if (typeof type == "string") {
			//Creates element
			let element = new Element(type, [], attrs);

			//Adds children to element
			for (const [key, value] of Object.entries(children)) { 
				if (typeof value == "object" && value.subscribe == undefined) {
					element.add_child(value);
				} else {
					element.add_child(new Element("#text", [value], attrs));
				}
			}
			

			return element;
		} else {

			//Initializes component
			return new type({
				props: attrs
			});
		}
	}

	//Todo reimplement with new code formatting
	condition(vars, cb) {
		return new Conditional(vars, cb);
	}

	foreach (array, cb) {
		return new For(array, cb);
	}
}

let current_component;

export function set_current_component (component) {
	current_component = component;
}

export function get_current_component () {
	return current_component;
}

export function beforeMount (fn) {
	get_current_component().beforeMounted = fn;
}

export function onMount (fn) {
	get_current_component().mounted = fn;
}

export function beforeUnmount (fn) {
	get_current_component().beforeUnmount = fn;
}

export function onDestroy (fn) {
	get_current_component().unmounted = fn;
}

export function onRender (fn) {
	get_current_component().render = fn;
}