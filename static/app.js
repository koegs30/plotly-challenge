// collect data and build bar and bubble charts
function buildPlots(id) {
    // retrieve data
    d3.json("./samples.json").then (function(data) {
        console.log(data);
        // create var for samples array and filter by id
        var samples = data.samples.filter(s => s.id === id)[0]
        // slice top 10 OTUs and store in variables
        var sample_values= samples.sample_values.slice(0,10);
        var otu_ids = samples.otu_ids.slice(0,10);
        var otu_labels = samples.otu_labels.slice(0,10);

        // build bar chart
        var trace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            marker: {
                color: 'navy blue'},
            type:"bar",
            orientation: "h",
        };
        var data = [trace];

        // create layout variable to set plots layout
        var layout = {
            title: "Top 10 OTUs",
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Sample Value"},
            margin: {
                l: 50,
                r: 50,
                t: 50,
                b: 30
            }
        };
        // plot the bar plot
        Plotly.newPlot("bar", data, layout);

        // create bubble chart
        var trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
              color: otu_ids,
              size: sample_values
            }
          };
          
          var data = [trace1];
          
          var layout = {
            title: `Top 10 OTUs`,
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Sample Value"},
            height: 600,
            width: 800
          };
          // plot the bubble chart
          Plotly.newPlot("bubble", data, layout);
    });      
};

// create function to get metadata
function getData(id) {
    d3.json("./samples.json").then (function(data) {
        var metadata = data.metadata;
        // filter metadata by id (convert to string as id an integer in metadata)
        var demoInfo = metadata.filter(m => m.id.toString() === id)[0];
        // assign variable to id in html
        var demoHTML = d3.select("#sample-metadata");
        // clear data
        demoHTML.html("");
        // get and assign metadata for id selected to html
        Object.entries(demoInfo).forEach((key) => {
            demoHTML.append("h5")
            .text(`${key[0]}: ${key[1]}`)
        });

});
};

// function for dropdown click/"onchange"
function optionChanged(id) {
    buildPlots(id);
    getData(id);
}

// function for when page first loads
function init() {
    // assign dropdown to variable
    var dropdownMenu = d3.select("#selDataset");
    // get data
    d3.json("./samples.json").then (function(data) {

        // asign values to dropwdown
        data.names.forEach(function(name) {
            dropdownMenu.append("option").text(name).property("value");
        });
        // build plot and populate demo data from first id
        buildPlots(data.names[0]);
        getData(data.names[0]);    
    });
};

init();
