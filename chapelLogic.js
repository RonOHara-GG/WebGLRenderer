function ChapelCameraUpdate(deltaTimeMS)
{
	var rotation = (Math.PI / 3) * (deltaTimeMS / 1000);
	var mat = mat4.create();
	mat4.identity(mat);
	mat4.rotateY(mat, mat, rotation);

	var view = vec3.create();
	vec3.sub(view, this.target, this.pos);

	vec3.transformMat4(view, view, mat);

	vec3.add(this.target, this.pos, view);
}