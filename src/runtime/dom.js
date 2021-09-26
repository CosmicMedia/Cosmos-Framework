import { makeid } from "./utils";
import isEqual from 'lodash.isequal';

function stackTrace() {
    var err = new Error();
    return err.stack;
}

export function variable (val) {
	if (val.subscribe !== undefined) return val;

	let subscribers = new Set();

	let current_value = val;
	let old_value = undefined;
	return class {
		static id = makeid(5);

		//Used for user manipulation
		static value = val;

		static set (new_val, notify = true) {
			if (!isEqual(new_val, current_value)) {
				if (notify) for (const subscriber of subscribers) subscriber(new_val, current_value);
		
				this.value = new_val;
				old_value = current_value;
				current_value = new_val;
			}
		}

		static update () {
			this.set(this.value);
		}
		
		static get () {
			return current_value;
		}

		static get_last() {
			return old_value;
		}

		static subscribe (run) {
			subscribers.add(run);
	
			return () => {
				subscribers.delete(run);
			}
		}
	};
}

export function anchor () {
	return document.createTextNode('');
}

export function usable (_variable) {

	let internalVar; 
	
	if (_variable.subscribe !== undefined) internalVar = _variable.get();
	else internalVar = _variable;

	//Makes all inputs a reactive var by default.

	//Check if variable is an object
	if (typeof internalVar == "object") {
		//Map the variables within the object with an index
		Object.keys(internalVar).map((key, index) => {
			if (internalVar[key].subscribe == undefined) internalVar[key] = usable(internalVar[key]);
		});
		
	} else if (Array.isArray(internalVar)) {
		internalVar.map((key, index) => {
			if (internalVar[key].subscribe == undefined) internalVar[key] = usable(internalVar[key]);
		});
	}

	let output = {};
	if (_variable.subscribe !== undefined) {
		output = _variable; 
		output.set(internalVar, false);
	} 
	else {
		output.subscribe = () => {}
		output.value = internalVar.value;
		output.get = () => { return internalVar.value };
	}
	//Output should always be a variable();
	return output;
}