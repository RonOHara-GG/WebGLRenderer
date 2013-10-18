function Quat(dataCSV)
{
	var dataArray = dataCSV.csvToArray();
	this.x = parseFloat(dataArray[0][1]);
	this.y = parseFloat(dataArray[0][2]);
	this.z = parseFloat(dataArray[0][3]);
	this.q = parseFloat(dataArray[0][4]);
}