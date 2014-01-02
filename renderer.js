var gl;
var TheScene;
var TheCanvas;
var EditorName = null;

var lastFrameTime = 0;

function runFrame()
{
	window.requestAnimFrame(runFrame, TheCanvas);

	var now = new Date().getTime();
	var deltaTime = (now - lastFrameTime);
	lastFrameTime = now;
	//document.getElementById('FPSCounter').innerHTML = deltaTime;

	if (TheScene)
	{
		TheScene.update(deltaTime);
		TheScene.draw(gl);
	}
}

var selected = null;
function canvasClick(e)
{
	var x;
	var y;
	if (e.pageX || e.pageY)
	{
		x = e.pageX;
		y = e.pageY;
	}
	else
	{
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	x -= TheCanvas.offsetLeft;
	y -= TheCanvas.offsetTop;

	if (!selected)
	{
		var hit = TheScene.pickObjects(x, y);
		if (hit != "none")
		{
			var objs = hit.split(",");
			TheScene.selectObject(objs[0], "renderObject");
			selected = objs[0];
		}
	}
	else
	{
		TheScene.getDragAxes(x, y);
	}
}

function webGLCanvasSetup()
{
	window.requestAnimFrame = (function (callback) { return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) { window.setTimeout(callback, 1000 / 60); }; })();
	
	TheCanvas = document.getElementById("GLCanvas");

	try
	{
		gl = TheCanvas.getContext("experimental-webgl");
		gl.canvasWidth = TheCanvas.width;
		gl.canvasHeight = TheCanvas.height;
		gl.wireframe = false;

		gl.depthTextureExt = gl.getExtension("WEBGL_depth_texture");
	} catch (e)
	{
	}
	if (!gl)
	{
		alert("Could not initialise WebGL, sorry :-(");
	}

	TheCanvas.addEventListener("click", canvasClick, false);

	//ripColladaFile("./Soldier/cube.dae");
		
	webGLStart();
	setupScene("./dragon/scene.xml", null);
}

function setupScene(SceneFile, editor)
{
	EditorName = editor;

	if (SceneFile)
	{
		var idx = SceneFile.lastIndexOf("\\");
		if (idx < 0)
			idx = SceneFile.lastIndexOf("/");
		SetCurrentDirectory(SceneFile.substring(0, idx));
	}

	TheScene = new Scene(SceneFile, gl);
	TheScene.resize(gl.canvasWidth, gl.canvasHeight);

	var sceneJson = TheScene.toString();
	return sceneJson;
}

function webGLStart()
{
	gl.viewProj = mat4.create();
	gl.lightUpdateToken = 0;

	gl.enable(gl.DEPTH_TEST);

	InitImmediate(gl);

	lastFrameTime = new Date().getTime();
	runFrame();
}

function saveScene(path)
{
	if (TheScene)
		TheScene.save(path);
}
