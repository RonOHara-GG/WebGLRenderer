var glLineShader = null;

function InitImmediate(gl)
{
	glLineShader = new Shader(null, "glLineShader", null);
	glLineShader.initShaderProgram(gl, glLineShaderVS, glLineShaderFS);
	glLineShader.initShaderParams();
}

function DrawLines(gl, points, worldMtx)
{
	// Setup shader
	glLineShader.bind();

	// Setup vertex buffer
	var vb = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vb);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(gl.shaderPositionLocation);
	gl.vertexAttribPointer(gl.shaderPositionLocation, 3, gl.FLOAT, false, 12, 0);

	// Draw
	gl.drawArrays(gl.LINES, 0, points.length);
}