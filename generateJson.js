var xlsx = require('node-xlsx');
var fs = require("fs");
var _ = require('lodash');
var request = require("request");
var async = require("async");



var theData = {}; //Empty global object to build our javascript object.

var setData = {
    init: function(data) {

        //Recast data as an object array with column headers as keys.
        data = toObjectArray(data); 

        //Iterate through the data, and create a custom structure for your data.
        //In this example, I'm just creating a dictionary lookup for cities to get their lat/long.
        _.each(data, function(item, i) { 
            theData[item.name] = {
                state : item.adm1name,
                lat : item.latitude,
                lon : item.longitude 
            }
        })

        writeFile();

    }
}


function writeFile() {

    //Stringify `theData` object
    var theJson = JSON.stringify(theData);

    //...and write it to an output.json file. (or whatever you want to call it)
    fs.writeFile("output.json", theJson, function(err) {
        if (err) return console.log(err);
        console.log('Data Success.');
    });



}




async.series(
    [

        function(callback) {

            var data = xlsx.parse('us2016_cities.xlsx'); //parses a file
            callback(null, data);

        } //, //TO CALL A SECOND FILE, ADD IT TO THE ASYNC ARRAY LIKE SO:
        // function(callback) {

        //     var data = xlsx.parse('us2016_cities.xlsx'); //parses a file
        //     callback(null, data);

        // }
    ],
    function(err, results) {

        // * Because we're using async, results is an array. so the first file is in `results[0]`, the second in `results[1]`, etc...
        // * Each results has two objects: `name` (the worksheet name) and `data`.

        var worksheetName = results[0][0].name; //worksheet name
        var worksheetData = results[0][0].data; //worksheet data

        setData.init(worksheetData);

    }
)




//Returns an array of objects with the column names as keys.
function toObjectArray(origArray) {

    var newArray = [];
    for (var index = 1; index < origArray.length; index++) {
        newArray.push(_.object(origArray[0], origArray[index]));
    }

    return newArray;

}

