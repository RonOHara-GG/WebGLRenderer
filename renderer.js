var gl;
var TheScene;
var TheCanvas;

function initGL(canvas)
{
	try
	{
		gl = canvas.getContext("experimental-webgl");
		gl.canvasWidth = canvas.width;
		gl.canvasHeight = canvas.height;
		
		gl.depthTextureExt = gl.getExtension("WEBKIT_WEBGL_depth_texture");
	} catch (e)
	{
	}
	if (!gl)
	{
		alert("Could not initialise WebGL, sorry :-(");
	}
}

var lastFrameTime = 0;

function runFrame()
{
	window.requestAnimFrame(runFrame, TheCanvas);
	
	var now = new Date().getTime();
	var deltaTime = (now - lastFrameTime);
	lastFrameTime = now;
	document.getElementById('FPSCounter').innerHTML = deltaTime;

	TheScene.update(deltaTime);
	TheScene.draw(gl);
}

function webGLStart()
{
	window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
      })();

	TheCanvas = document.getElementById("GLCanvas");
	initGL(TheCanvas);

	gl.viewProj = mat4.create();
	gl.lightUpdateToken = 0;
	var sceneXML = LoadXML("./scene.xml");
	TheScene = new Scene(sceneXML, gl);
	TheScene.resize(TheCanvas.width, TheCanvas.height);

	gl.enable(gl.DEPTH_TEST);

	lastFrameTime = new Date().getTime();
	runFrame();
}