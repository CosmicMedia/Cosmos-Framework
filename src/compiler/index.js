import { generate } from "astring";
import { parse } from "acorn";
import sourceMap from "source-map";

export default function compiler (options = {}) {
	return {
	  name: 'cosmos',
  
	  transform(content, id) {
		  console.log(id);
		  if (false) {
			var ast = parse(content, {sourceType: 'module'})

			//Output with map
			var astLocations = parse(generate(ast), {sourceType: 'module', locations: true});
			var map = new sourceMap.SourceMapGenerator({file: "test.js"});
			var formattedCode = generate(astLocations, {sourceMap: map})
			return { code: formattedCode, map: map.toString() };
		  } else {
			  return { code: content, map: this.getCombinedSourcemap() };
		  }
	  }
	};
}