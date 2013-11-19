function LoadFile(fileName)
{
	var result = "";
	var xhr = new XMLHttpRequest();
	xhr.open('GET', fileName, false);
	xhr.send();
	if (xhr.status === 200)
		result = xhr.responseText;
	return result;
}

function LoadXML(fileName)
{
	var result;

	var xhr = new XMLHttpRequest();
	xhr.open('GET', fileName, false);
	xhr.send();
	if (xhr.status === 200)
		result = xhr.responseXML;
	return result;
}

function SaveFile(fileName, fileData)
{
	console.log("SaveFile: " + fileName + "\n" + fileData);
}