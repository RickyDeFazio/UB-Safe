function loadMap(){
  Plotly.setPlotConfig({
    mapboxAccessToken: 'pk.eyJ1Ijoicmlja3lkZWYiLCJhIjoiY2pudHI1YXQ1MDI3azNyb2k5dWtkdzBoeCJ9.muRFIgHmij4pdtyaL1oHFg'
  });
  let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
      if (this.readyState === 4 && this.status === 200){
        let mapParams = getMapParams(this.response);
        Plotly.plot('map', mapParams.data, mapParams.layout);
      }
    };
    xhttp.open("GET", "/crime");
    xhttp.send();
}

function loadChart(){
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(){
    if (this.readyState === 4 && this.status === 200){
		  var chartParams = getChartParams(this.response);
			Plotly.plot('chart', chartParams.data, chartParams.layout);
    }
  };
  xhttp.open("GET", "/crime");
  xhttp.send();
}

// Crime Map
function setupMapData(arr){
  let map_data = [];
  let map_object = {
    "type": "scattermapbox",
    "mode": "markers",
    "marker": {"size": 6, "color": "crimson"},
    "lat": [],
    "lon": [],
    "text": []
  };
  for (let i=0; i<arr.length; i++){
    map_object["lat"].push(arr[i][0]);
    map_object["lon"].push(arr[i][1]) ;
    map_object["text"].push(arr[i][2]);
  }
  map_data.push(map_object);
  return map_data;
}

function findCenter(arr){
  let center = [];
  let data = setupMapData(arr);
  let lat_min = Math.min(...data[0].lat);
  let lat_max = Math.max(...data[0].lat);
  let lat_avg = ((lat_min + lat_max) / 2);
  let lon_min = Math.min(...data[0].lon);
  let lon_max = Math.max(...data[0].lon);
  let lon_avg = ((lon_min + lon_max) / 2);
  center.push(lat_avg, lon_avg);
  return center;
}

function setupMapLayout(arr){
  let settings = {
    style: "satellite-streets",
    zoom: 9,
    center: {"lat": findCenter(arr)[0], "lon": findCenter(arr)[1]},
  };
  let layout = {"mapbox": settings};
  return layout;
}

function getMapParams(data){
  let obj = JSON.parse(data);
  let map = {
    "data": setupMapData(obj),
    "layout": setupMapLayout(obj)
  };
  return map;
}

// Pie Chart
function setupChartData(arr){
  let chart_data = [];
	let data_object = {
		labels: [],
		values: [],
		type: "pie"
	};
  for (let i=0; i<arr.length; i++){
		if (data_object["labels"].includes(arr[i][2])){
			index = data_object["labels"].indexOf(arr[i][2]);
			data_object["values"][index]++;
	  }
		else{
			data_object["labels"].push(arr[i][2]);
			data_object["values"].push(1);
    }
  }
  chart_data.push(data_object);
  return chart_data;
}

function setupChartLayout(arr){
  let layout = {
    height: 500,
    width: 800,
  };
  return layout;
}

function getChartParams(data){
  let obj = JSON.parse(data);
  let chart = {
    "data": setupChartData(obj),
    "layout": setupChartLayout(obj)
  };
  return chart;
}