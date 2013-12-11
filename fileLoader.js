function LoadFile(fileName)
{
	var result = "";
	if (fileName)
	{
		var xhr = new XMLHttpRequest();
		xhr.open('GET', fileName, false);
		xhr.send();
		if (xhr.status === 200)
			result = xhr.responseText;
	}
	return result;
}

function LoadXML(fileName)
{
	var result;

	if (fileName)
	{
		var xhr = new XMLHttpRequest();
		xhr.open('GET', fileName, false);
		xhr.send();
		if (xhr.status === 200)
			result = xhr.responseXML;
	}
	return result;
}

function SaveFile(fileName, fileData)
{
	console.log("SaveFile: " + fileName + "\n" + fileData);
}

function SetCurrentDirectory(path)
{
}

function GetFullPath(relPath)
{
	return relPath;
}