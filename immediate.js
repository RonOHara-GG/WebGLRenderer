var glLineShader = null;

var glLineShaderVS = "attribute vec3 aVertexPosition;\n" + 
	"uniform mat4 uMVPMatrix;\n" + 
	"void main(void){\n" +
	"gl_Position = (uMVPMatrix * vec4(aVertexPosition, 1.0));}"; 

var glLineShaderFS = "precision mediump float;\n" +
	"uniform vec3 uLineColor;\n" +
	"void main(void) {gl_FragColor = vec4(uLineColor, 1.0);}";

function InitImmediate(gl)
{
	glLineShader = new Shader(null, "glLineShader", null);
	glLineShader.initShaderProgram(gl, glLineShaderVS, glLineShaderFS);
	glLineShader.initShaderParams(gl);
	glLineShader.uLineColor = gl.getUniformLocation(glLineShader.shaderProgram, "uLineColor");
}

function DrawLines(gl, points, worldMtx, color)
{
	// Setup shader
	glLineShader.bind(gl);
	if (gl.uMVP)
	{
		var mvp = mat4.create();
		mat4.mul(mvp, gl.viewProj, worldMtx);
		gl.uniformMatrix4fv(gl.uMVP, false, mvp);
	}
	if (glLineShader.uLineColor)
	{
		gl.uniform3fv(glLineShader.uLineColor, color);
	}

	var pointFloats = [];
	for (var i = 0; i < points.length; i++)
	{
		pointFloats.push(points[i][0]);
		pointFloats.push(points[i][1]);
		pointFloats.push(points[i][2]);
	}

	// Setup vertex buffer
	var vb = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vb);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointFloats), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(gl.shaderPositionLocation);
	gl.vertexAttribPointer(gl.shaderPositionLocation, 3, gl.FLOAT, false, 0, 0);

	// Draw
	gl.drawArrays(gl.LINES, 0, points.length);

	// Cleanup
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.deleteBuffer(vb);
}

function DrawMoveControl(gl, extents, worldMtx)
{
	var mtx = mat4.create();
	mat4.identity(mtx);
	mtx[12] = worldMtx[12]; mtx[13] = worldMtx[13]; mtx[14] = worldMtx[14];

	//var arrowLen = (extents[0] * 2.5);
	var arrowLen = 1.5;
	var pointSize = arrowLen * 0.2;
	
	var op = vec3.create();
	var tip = vec3.fromValues(arrowLen, 0, 0);
	var boxPtX = vec3.fromValues(pointSize, 0, 0);
	var boxXZ = vec3.fromValues(pointSize, 0, pointSize);
	var boxXY = vec3.fromValues(pointSize, pointSize, 0);
	var boxYZ = vec3.fromValues(0, pointSize, pointSize);

	var boxPtY = vec3.fromValues(0, pointSize, 0);
	var boxPtZ = vec3.fromValues(0, 0, pointSize);

	//var cross = vec3.create();
	//cross[0] -= pointSize;

	var arrow = [];
	arrow.push(op);
	arrow.push(tip);
	arrow.push(boxPtX);
	arrow.push(boxXZ);
	arrow.push(boxPtX);
	arrow.push(boxXY);

	gl.depthFunc(gl.ALWAYS);

	DrawLines(gl, arrow, mtx, vec3.fromValues(1, 0, 0));

	tip = vec3.fromValues(0, arrowLen, 0);
	arrow[1] = tip;
	arrow[2] = arrow[4] = boxPtY;
	arrow[3] = boxXY;
	arrow[5] = boxYZ;
	DrawLines(gl, arrow, mtx, vec3.fromValues(0, 1, 0));

	tip = vec3.fromValues(0, 0, arrowLen);
	arrow[1] = tip;
	arrow[2] = arrow[4] = boxPtZ;
	arrow[3] = boxXZ;
	DrawLines(gl, arrow, mtx, vec3.fromValues(0, 0, 1));

	gl.depthFunc(gl.LESS);
}