import { makeid } from "./utils";
import isEqual from 'lodash.isequal';

export function variable (val) {
	let subscribers = new Set();
	let current_val = val;
	let old_val = undefined;

	function set (new_val) {
		if (!isEqual(new_val, current_val)) {
			for (const subscriber of subscribers) {
				subscriber(new_val, current_val);
			}
	
			old_val = current_val;
			current_val = new_val;
		}
	}
	
	function subscribe (run) {
		subscribers.add(run);

		return () => {
			subscribers.delete(run);
		}
	}

	function get () {
		return current_val;
	}

	function get_last () {
		return old_val;
	}

	return {id: makeid(5), set, subscribe, get, get_last};
}

export function anchor () {
	return document.createTextNode('');
}