import compile_js from './compile_js';

export default function compiler (options = {}) {
	return {
	  name: 'cosmos',
  
	  transform(content, id) {
			return content;
		  	if (id.includes('.js')) {
				//return compile_js(content);
			}
	  }
	};
}