var xlsx = require('node-xlsx');
var fs = require("fs");
var _ = require('lodash');
var request = require("request");
var async = require("async");



var theData;

var setData = {
    init: function(data) {


        //writeFile();

    }
}


function writeFile() {

    var theJson = JSON.stringify(theData);

    fs.writeFile("../data/output.json", theJson, function(err) {
        if (err) return console.log(err);
        console.log('Data Success.');
    });



}




async.series(
    [

        function(callback) {

            var data = xlsx.parse('WSJ_NRRI data_July 25_final_excel'); //parses a file
            callback(null, data);

        }
    ],
    function(err, results) {

        //console.log(results);

        var data = results[0][0].name;

        setData.init(data);

    }
)




function toObjectArray(origArray) {

    var newArray = [];
    for (var index = 1; index < origArray.length; index++) {
        newArray.push(_.object(origArray[0], origArray[index]));
    }

    return newArray;


}

