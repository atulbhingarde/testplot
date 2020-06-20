var apiKey = "YndWi3WEDL-sXiAVZSWT";

/**
 * Helper function to select stock data
 * Returns an array of values
 * @param {array} rows
 * @param {integer} index
 * index 0 - Date
 * index 1 - Open
 * index 2 - High
 * index 3 - Low
 * index 4 - Close
 * index 5 - Volume
 */
 var StartDate="2016-10-01";
 var EndDate="2017-10-01";
 var Symbol="AAPL";

 var inputField1 = d3.select("#datepicker1");
 var inputField2 = d3.select("#datepicker2");
 var inputField3 = d3.select("#symbol");
 Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}
function unpack(rows, index) {
  return rows.map(function(row) {
    return row[index];
  });
}
var Button = d3.select("#filter-btn");
function getMonthlyData(Symbol, StartDate, EndDate) {

  var queryUrl = `https://www.quandl.com/api/v3/datasets/WIKI/${Symbol}.json?start_date=${StartDate}&end_date=${EndDate}&collapse=monthly&api_key=${apiKey}`;
  console.log(queryUrl);

  d3.json(queryUrl).then(function(data) {
    var dates = unpack(data.dataset.data, 0);
    var openPrices = unpack(data.dataset.data, 1);
    var highPrices = unpack(data.dataset.data, 2);
    var lowPrices = unpack(data.dataset.data, 3);
    var closingPrices = unpack(data.dataset.data, 4);
    var volume = unpack(data.dataset.data, 5);
    buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume);
  });
}

function buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume) {
  var table = d3.select("#summary-table");
  var tbody = table.select("tbody");
  var trow;
  for (var i = 0; i < 12; i++) {
    trow = tbody.append("tr");
    trow.append("td").text(dates[i]);
    trow.append("td").text(openPrices[i]);
    trow.append("td").text(highPrices[i]);
    trow.append("td").text(lowPrices[i]);
    trow.append("td").text(closingPrices[i]);
    trow.append("td").text(volume[i]);
  }
}

function buildPlot(Symbol, StartDate, EndDate) {
  var url = `https://www.quandl.com/api/v3/datasets/WIKI/${Symbol}.json?start_date=${StartDate}&end_date=${EndDate}&api_key=${apiKey}`;
  console.log(url);
  d3.json(url).then(function(data) {

    // Grab values from the response json object to build the plots
    var name = data.dataset.name;
    var stock = data.dataset.dataset_code;
    var startDate = data.dataset.start_date;
    var endDate = data.dataset.end_date;
    var dates = unpack(data.dataset.data, 0);
    var openingPrices = unpack(data.dataset.data, 1);
    var highPrices = unpack(data.dataset.data, 2);
    var lowPrices = unpack(data.dataset.data, 3);
    var closingPrices = unpack(data.dataset.data, 4);

    getMonthlyData(Symbol, StartDate, EndDate);

    var trace1 = {
      type: "scatter",
      mode: "lines",
      name: name,
      x: dates,
      y: closingPrices,
      line: {
        color: "#17BECF"
      }
    };

    // Candlestick Trace
    var trace2 = {
      type: "candlestick",
      x: dates,
      high: highPrices,
      low: lowPrices,
      open: openingPrices,
      close: closingPrices
    };

    var data = [trace1, trace2];

    var layout = {
      title: `${stock} closing prices`,
      xaxis: {
        range: [startDate, endDate],
        type: "date"
      },
      yaxis: {
        autorange: true,
        type: "linear"
      },
      showlegend: false
    };

    Plotly.newPlot("plot", data, layout);

  });
}
Button.on("click", () => {
  
  function formatdate(userDate){
    var omar= new Date(userDate);
    y  = omar.getFullYear().pad().toString();
    m = omar.getMonth().pad(2).toString();
    d = omar.getDate().pad(2).toString();
    omar=y+"-"+m+"-"+d;
    return omar;
  }
  // tbody.html("");
  // populate(data);
  // console.log("Table reset");
  // console.log(inputField1);
  var MySymbol=$("#symbol");
  var inputField1 = $("#datepicker1").datepicker('getDate');
  $.datepicker.formatDate('dd/mm/yy', inputField1);
  var inputField2 = $("#datepicker2").datepicker('getDate');
  $.datepicker.formatDate('dd/mm/yy', inputField2);
  // D1=inputField1
  var formatTime = d3.timeFormat("%Y-%m-%d");
  var Symbol = inputField3.property("value").toString().toUpperCase().trim();
  jj=Date.parse(inputField1);
  // console.log((inputField1));
  StartDate=formatTime(inputField1);
  EndDate=formatTime(inputField2);
  // console.log(inputCity);
  // console.log(jj.getDate()+"-"+jj.getMonth()+"-"+jj.getFullYear());
  // console.log(inputField1);
  //console.log(inputField2);
  // console.log(jj);
  buildPlot(Symbol, StartDate, EndDate);
});
buildPlot();
