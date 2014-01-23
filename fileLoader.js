function VideoReady()
{
	console.log(this.src + " - play");
	this.play();
	this.playing = true;
}

function VideoDone()
{
	console.log("video done");
	this.play();
}

function LoadImage(src, callback, type)
{
	var img;
	if (type == "image")
		img = new Image();
	else
	{
		img = document.createElement('video');
		img.preload = "auto";
		img.crossorigin = "anonymous";

		img.addEventListener("canplaythrough", VideoReady, true);
		img.addEventListener("ended", VideoDone, true);
	}
	img.onload = callback;
	img.src = src;
	return img;
}

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

function GetRelativePath(fullPath)
{
	return fullPath;
}

function urldecode(url)
{
	return decodeURIComponent(url.replace(/\+/g, ' '));
}

function getYoutubeURL(vidID)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', "youtube.php?v=" + vidID, false);
	xhr.send();
	if (xhr.status === 200)
	{
		var result = xhr.responseText;
		var params = result.split("&");
		for (var i = 0; i < params.length; i++)
		{
			var keyvals = params[i].split("=");
			if (keyvals[0] == "url_encoded_fmt_stream_map")
			{
				var decoded = urldecode(keyvals[1])

				var entries = decoded.split(",");

				var p = entries[0].split("&");
				var url = "";
				var sig = "";
				for (var k = 0; k < p.length; k++)
				{
					var pair = p[k].split("=");
					var val = pair[1];
					if (pair[0] == "url")
					{
						val = urldecode(pair[1]);
						url = val;
					}
					if (pair[0] == "sig")
					{
						sig = val;
					}
				}

				return url + "&signature=" + sig;
			}
		}
	}

	return null;
}