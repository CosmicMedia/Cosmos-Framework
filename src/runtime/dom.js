import { makeid } from "./utils";
import isEqual from 'lodash.isequal';

export function variable (val) {
	//{id: makeid(5), value: current_val, set, subscribe, get, get_last}
	let subscribers = new Set();

	let current_value = val;
	let old_value = undefined;
	return class {
		static id = makeid(5);

		//Used for user manipulation
		static value = val;

		static set (new_val) {
			if (!isEqual(new_val, current_value)) {
				for (const subscriber of subscribers) {
					subscriber(new_val, current_value);
				}
		
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