/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  // "北京": {
  //   "2016-01-01": 10,
  //   "2016-01-02": 20,
  //   "2016-01-03": 30,
  //   "2016-01-04": 40,
  //   "2016-01-05": 50,
  //   "2016-01-06": 60,
  //   "2016-01-07": 30,
  //   "2016-01-08": 80,
  //   "2016-01-09": 100,
  //   "2016-01-10": 30,
  //   "2016-01-11": 40,
  //   "2016-01-12": 50,
  //   "2016-01-13": 120,
  //   "2016-01-14": 20,
  //   "2016-01-15": 30,
  //   "2016-01-16": 40,
  //   "2016-02-01": 10,
  //   "2016-02-02": 20,
  //   "2016-02-03": 30,
  //   "2016-02-04": 40,
  //   "2016-02-05": 50,
  //   "2016-02-06": 60,
  //   "2016-02-07": 30,
  //   "2016-02-08": 80,
  //   "2016-02-09": 100,
  //   "2016-02-10": 30,
  //   "2016-02-11": 40,
  //   "2016-02-12": 50,
  //   "2016-02-13": 120,
  //   "2016-02-14": 20,
  //   "2016-02-15": 30,
  //   "2016-02-16": 40,
  // },
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart(data) {
  var color = ['#FFC125','#FFEC8B','#FFA500','#FF6A6A','#FF4040','#F08080','#EEE685','#EE0000'];
  var oChart= document.getElementsByClassName("aqi-chart-wrap")[0];
  var innerString = "";
  var width=Math.round(90/data.length*100)/100; //保留2位小数
  for(var i=0; i<data.length; i++){
    innerString += '<div style="width:'+width+'%"><div style="height:'+data[i][1]+'px; background:'+color[i%color.length]+'"></div></div>';
  }
 
  oChart.innerHTML= innerString;
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(radio) {
  // 确定是否选项发生了变化 
  if(radio.value === pageState.nowGraTime) return;
  // 设置对应数据
  pageState.nowGraTime = radio.value;
  renderChart(chartData[pageState.nowGraTime]);
  // 调用图表渲染函数
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化
  var city = document.getElementById("city-select").value;

  if(city === pageState.nowSelectCity) return;
  // 设置对应数据
  pageState.nowSelectCity = city;
  initAqiChartData();
  // 调用图表渲染函数
  renderChart(chartData[pageState.nowGraTime]);
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var oGraTime = document.getElementById("form-gra-time");
  oGraTime.addEventListener('click', function (event) {
    graTimeChange(event.target);
  });
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var oCity = document.getElementById("city-select");
  pageState.nowSelectCity = oCity.value;
  initAqiChartData();
  renderChart(chartData[pageState.nowGraTime]);
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  oCity.addEventListener("change", function(){
    citySelectChange();
  });
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  if(pageState.nowSelectCity===-1) return;
  chartData = {};
  var dataCity = aqiSourceData[pageState.nowSelectCity];
  var dataSeries = [];
  //因为对象里的属性存储是无序的，将对象数据，改成数组
  for(var key in dataCity){
    if(dataCity.hasOwnProperty(key)){
      dataSeries.push([key, dataCity[key]]);
    }
  }

  dataSeries.sort();
  /*生成按天的数据*/
  chartData.day = dataSeries;
  
  /*生成按周的数据*/
  var week = 0;
  var sum = 0;//记录当前周的总值
  var days = 0; //记录当前周的天数
  var weekSeries = []; // 记录计算的周数据
  var monthSeries = []; //记录计算的月数据
  var month = {}; //按月存储数据
  for(var i=0; i<dataSeries.length; i++){
    sum += dataSeries[i][1];
    days++;
    var date = new Date(dataSeries[i][0]);
    if(date.getDay() ===0 ){ //如果是周末，则周数加1
      week++;
      weekSeries.push(['第'+week+'周', sum/days]);
      sum = 0;
      days = 0;  
    }

    //将原始值，按月存储
    if(!month[date.getMonth()+1]){  
      month[date.getMonth()+1] = [];
    }else{
      month[date.getMonth()+1].push(dataSeries[i][1]);
    }
  }
  chartData.week = weekSeries;

  /*生成按月的数据*/
  var monthSeries = [];
  for(var i in month){
    if(month.hasOwnProperty(i)){
      var month_sum = month[i].reduce(function (a, b) {
        return a+b;
      })
      monthSeries.push([i+'月份', month_sum/month[i].length]);
    }
  }
  
  chartData.month = monthSeries.sort();
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

init();