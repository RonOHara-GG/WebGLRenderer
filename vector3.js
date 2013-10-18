function Vector3(dataStr)
{
	var dataArray = dataStr.csvToArray();
	this.x = parseFloat(dataArray[0][0]);
	this.y = parseFloat(dataArray[0][1]);
	this.z = parseFloat(dataArray[0][2]);
}