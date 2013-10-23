function UpdatePyramid(deltaTimeMS)
{
	var rotation = (Math.PI / 3) * (deltaTimeMS / 1000);
	quat.rotateZ(this.rot, this.rot, rotation);
	this.updateWorldMatrix();
}