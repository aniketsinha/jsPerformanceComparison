"use strict";

var NUMBER_OF_TESTS = 5000;
var NUMBER_OF_OBJECTS = 200;
var efficientReduceCount = 0;
var efficientLoopCount = 0;
var tieCount = 0;
var totalTestsCount = 0;

/**
 * perform single test
 */
function singleTest() {
	var objCount = document.getElementById("objectCount").value || NUMBER_OF_OBJECTS;
	var testCount = document.getElementById("testCount").value || NUMBER_OF_TESTS;
    var allObjects = getNObjects(objCount);
	var timeResult = startTest(allObjects)
	manageCounters(timeResult);
	displayResult(timeResult);
}

function startTest(arr) {
	totalTestsCount ++;
	// console.time('reduce');
	var rtStart = performance.now();
	var totalCostInCH = arr.reduce(reduceFn,0);
	var rtEnd = performance.now();
	// console.timeEnd('reduce');
	var reduceTime = rtEnd - rtStart;
	// console.time('loop');
	var ltStart = performance.now();
	var CHcost = getSumUsingLoop(arr);
	var ltEnd = performance.now();
	// console.timeEnd('loop');
	var loopTime = ltEnd - ltStart;
	return {
		"reduce_time": reduceTime,
		"loop_time": loopTime 
	}
}

/**
 * displays given text in particular element based on id
 */
function displayResult(timeObj) {
	var loopTime = timeObj.loop_time;
	var reduceTime = timeObj.reduce_time;
	displayText('reducetime', reduceTime);
	displayText('looptime',loopTime);
	if(efficientReduceCount>efficientLoopCount) {
		displayText('verdict', 'Reduce is efficient!');
	}
	else if(efficientReduceCount<efficientLoopCount){
		displayText('verdict', 'Loop is efficient!');
	}
	else {
		displayText('verdict', 'Both took same time!');
	}
	displayText('effreduce',efficientReduceCount);
	displayText('effloop',efficientLoopCount);
	displayText('tiecount',tieCount);
	displayText('totaltests',totalTestsCount);
}

function manageCounters(timeObj) {
	var loopTime = timeObj.loop_time;
	var reduceTime = timeObj.reduce_time;
	if(loopTime>reduceTime) {
		efficientReduceCount++;
	}
	else if(loopTime<reduceTime){
		efficientLoopCount++;
	}
	else {
		tieCount++;
	}
}

function getNObjects(count) {
    var objectsCollection = [];
    for(var i=1;i<=count;i++) {
        var obj = new sampleObject("name"+i,i);
        objectsCollection.push(obj);
    }
    return objectsCollection;
}

function sampleObject(name, id) {
    this.name = name;
    this.id = id;
	this.cost = (id%2)?101:201;
	this.location = (id%2)?"CH":"BA";
}

/**
 * function used by reduce
 */
function reduceFn(prevValue, currValue, index, array) {
 if(currValue.location === 'CH') {
	 return prevValue + currValue.cost;
 }
 return prevValue;
}

/**
 * loop used to calculate sum
 */
function getSumUsingLoop(arr) {
	var cost = 0;
	for(var i=0;i<arr.length;i++) {
		if(arr[i].location === 'CH') {
			cost += arr[i].cost;
		}
	}
	return cost; 
}
/**
 * function to display output on HTML element
 */
function displayText(elementId, elText) {
	document.getElementById(elementId).innerText = elText;
}
/**
 * run multiple tests given number of times
 */
function runAutomatedTests(times) {
	times = parseInt(times) || NUMBER_OF_TESTS;
	var objCount = document.getElementById("objectCount").value || NUMBER_OF_OBJECTS;
	var timeResult = {};
	var allObjects = getNObjects(objCount);
	for(var i=0; i<times;i++) {
		timeResult = startTest(allObjects);
		manageCounters(timeResult);
	}
	displayResult(timeResult);
}
runAutomatedTests(1);