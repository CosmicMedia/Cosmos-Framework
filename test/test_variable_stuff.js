function variable (val) {
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

		static objectreference (members) {


			return {
				get: () => {

				},

				set: () => {

				}
			}
		}
	};
}

let test = variable({
	test2: {
		test3: "test"
	}
})

test.objectreference(['test2', 'test3']).get();