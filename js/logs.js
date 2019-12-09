
function makeNewLog(txt, type) {
	if(!type) {
		type = 'normal';
	}
	var logDOM = '<li class="log ' + type + '">' + txt + '</li>';
	return logDOM;
}


function createLog(data) {
	logs.append(makeNewLog(data.txt, data.type));
	logs.scrollTop(logs[0].scrollHeight);
}
