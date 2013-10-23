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
	} catch (e)
	{
	}
	if (!gl)
	{
		alert("Could not initialise WebGL, sorry :-(");
	}
}

function drawScene()
{
	window.requestAnimFrame(drawScene, TheCanvas);

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
	var sceneXML = LoadXML("./scene.xml");
	TheScene = new Scene(sceneXML, gl);
	TheScene.resize(TheCanvas.width, TheCanvas.height);

	gl.enable(gl.DEPTH_TEST);

	drawScene();
}