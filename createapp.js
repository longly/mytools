"use strict";

var fs = require("fs");
var process = require("process");

var appname = console.readLine("请输入app名称:").toLowerCase();
var rootapp = console.readLine("请输入rootapp名称:").toLowerCase();

var appPath = "apps/" + appname + "/",
	testPath = "apps/" + appname + "/test/",
	libPath = "apps/" + appname + "/lib/";

if (!appname || fs.exists(appPath)) {
	console.error("appname:%s 存在", appname);
	process.exit(-1);
}

var tmpl = fs.readFile("tools/app.tmpl");
tmpl = tmpl.replace(/@@appname/g, appname);
tmpl = tmpl.replace(/@@rootapp/g, rootapp);
tmpl = tmpl.split("-----------------------------------------------------------");
fs.mkdir(appPath);
fs.mkdir(testPath);
fs.mkdir(libPath);

var indexData = tmpl[0],
	packData = tmpl[1],
	testData = tmpl[2],
	libData = tmpl[3];

fs.writeFile(appPath + "index.js", indexData);
fs.writeFile(appPath + "package.json", packData);
fs.writeFile(testPath + "index.js", testData);
fs.writeFile(libPath + "class.js", libData);
console.notice("create成功!");