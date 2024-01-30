// Create URL variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// fetch the JSON data and log it
d3.json(url).then(function(data){
    console.log(data);
}); 

// Start up Dashboard
function init(){

    // Use D3 to select the dropdown menu
    let dropdown = d3.select("#selDataset");

    // Access sample data using D3
    d3.json(url).then((data) => {

    // Gather the sample ids from the names list in data and populate the dropdown
    let sample_ids = data.names;
    console.log(sample_ids);
        for (id of sample_ids){
            dropdown.append("option").attr("value", id).text(id);
        };
    // Store the first sample for display initialization
    let first_entry = sample_ids[0];
    console.log(first_entry);
    
    // Call the graph generating functions with the first entry (id 940)
    makeBar(first_entry);
    makeBubble(first_entry);
    makeDemographics(first_entry);
    }); 
};

// Function Chart values
function makeBar(sample){

    // Fetch JSON data
    d3.json(url).then((data) => {

         // Collect all samples
        let sample_data = data.samples;

        // Filter for each option
        let results = sample_data.filter(id => id.id == sample);

        // Gather all data for all charts
        let first_result = results[0];
        console.log(first_result);
        let sample_values = first_result.sample_values.slice(0,10);
        let otu_ids = first_result.otu_ids.slice(0,10);
        let otu_labels = first_result.otu_labels.slice(0,10);
        console.log(sample_values);
        console.log(otu_ids);
        console.log(otu_labels);

        // Create bar chart
        let bar_trace = {
            x: sample_values.reverse(),
            y: otu_ids.map(item => `OTU ${item}`).reverse(),
            text: otu_labels.reverse(),
            type: 'bar',
            orientation: 'h'
        };

        let layout = {title: "Top Ten OTUs"};
        Plotly.newPlot("bar", [bar_trace], layout);
    });
};

function makeBubble(sample){
    
     // Fetch JSON data
    d3.json(url).then((data) => {
        let sample_data = data.samples;
        let results = sample_data.filter(id => id.id == sample);

        // Collect all results
        let first_result = results[0];
        console.log(first_result);

        // Store the results to display in the bubble chart
        let sample_values = first_result.sample_values;
        let otu_ids = first_result.otu_ids;
        let otu_labels = first_result.otu_labels;
        console.log(sample_values);
        console.log(otu_ids);
        console.log(otu_labels);

        // Create bubble chart
        let bubble_trace = {
            x: otu_ids.reverse(),
            y: sample_values.reverse(),
            text: otu_labels.reverse(),
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'Earth',
                size: sample_values
            }
        };

        let layout = {
            title: "Bacteria Count for each Sample ID",
            xaxis: {title: 'OTU ID'},
            yaxis: {title: 'Number of Bacteria'}
        };
        Plotly.newPlot("bubble", [bubble_trace], layout); //'bubble' is the html tag in index.html
    });
};

// Create demographic metadata info
function makeDemographics(sample){

    // Fetch JSON data
    d3.json(url).then((data) => {

    // Access metadata with D3
    let demographic_info = data.metadata;

     // Filter for each option
    let results = demographic_info.filter(id => id.id == sample);
    let first_result = results[0];
    console.log(first_result);

    // Clear each option
    d3.select('#sample-metadata').text('');

    Object.entries(first_result).forEach(([key,value]) => {
        console.log(key,value);

        // Select the demographic info html section with D3 and append new key-value pair
        d3.select('#sample-metadata').append('h3').text(`${key}, ${value}`);
    });
    
    });
};

// Define the function when the dropdown detects a change (function name as defined in index.html)
function optionChanged(value){
    
    // Console log the value for debug
    console.log(value);
    makeBar(value);
    makeBubble(value);
    makeDemographics(value);
};

init();