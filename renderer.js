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

function webGLCanvasSetup()
{
	window.requestAnimFrame = (function (callback) { return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) { window.setTimeout(callback, 1000 / 60); }; })();
	
	TheCanvas = document.getElementById("GLCanvas");

	try
	{
		gl = TheCanvas.getContext("experimental-webgl");
		gl.canvasWidth = TheCanvas.width;
		gl.canvasHeight = TheCanvas.height;

		gl.depthTextureExt = gl.getExtension("WEBGL_depth_texture");
	} catch (e)
	{
	}
	if (!gl)
	{
		alert("Could not initialise WebGL, sorry :-(");
	}

	ripColladaFile("./Soldier/cube.dae");
	
	webGLStart();
	setupScene("./scene.xml", null);
}

function setupScene(SceneFile, editor)
{
	EditorName = editor;

	var idx = SceneFile.lastIndexOf("\\");
	if (idx < 0)
		idx = SceneFile.lastIndexOf("/");
	SetCurrentDirectory(SceneFile.substring(0, idx));

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

	lastFrameTime = new Date().getTime();
	runFrame();
}

function saveScene(path)
{
	if (TheScene)
		TheScene.save(path);
}
