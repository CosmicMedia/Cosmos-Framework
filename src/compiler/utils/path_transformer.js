import path from 'path';

export function resolvePath(id, src) {
	if(id.split('/')[0] == id){
		return path.resolve(splicePathWindows(id.split('\\'), src));
	} else {
		return path.resolve(splicePath(id.split('/'), src));
	}
}

export function splicePathWindows(path, src){
	path.splice(path.length-1, 1);
	return (path.join('\\') + "\\" + src)
}

export function splicePath(path, src){
	path.splice(path.length-1, 1);
	return (path,join('/') + "/" + src);
}