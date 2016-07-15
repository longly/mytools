"use strict";

var vm = require("vm");
var process = require("process");
var getConfig = require("entry/getConfig");
var util = require("util");
var coroutine = require('coroutine');
var DATEFORMAT = require("utils/dateformat");

if (!Proxy.create)
	Proxy.create = function(handler) {
		return new Proxy({}, handler);
	};

var param = process.argv,
	mode = param[2];

if (param.length !== 3 || ["dev", "prod"].indexOf(mode) === -1) {
	console.error("参数错误:fibjs tools/tasks.js dev/prod");
	process.exit(-1);
}

var runtime = getConfig("baoz", mode).runtime;
var sb = new vm.SandBox(require("entry/config/depend.js"));
sb.add("application", runtime);
//run
var apps = sb.require("apps");
var apploader = apps.apploader;
var appManage = apploader[0].root.object.getAppManage();
var appIdsManage = apploader[0].root.object.getAppIdsManage();

function Time() {
	return DATEFORMAT.format(new Date(), "yyyy-MM-dd hh:mm:ss");
}

var JOBS = {
	autoBackOrder: function() {
		// if (new Date().getMinutes() % 5) return;

		var t = new Date().getTime();
		var rs = appIdsManage.get(appManage.name2id("merchant"), 1);

		var fn = apploader[0].merchant.JOB;
		rs.forEach(function(o) {
			fn({
				jobname: "autoBackOrder",
				id: o.id
			})
		});
		console.notice("[%s]执行自动系统退单,耗时:%sms", Time(), new Date().getTime() - t);
	},
	autoRemind: function() {
		// if (new Date().getHours() !== 8) return;

		var t = new Date().getTime();
		var rs = appIdsManage.get(appManage.name2id("merchant"), 1);

		var fn = apploader[0].merchant.JOB;
		rs.forEach(function(o) {
			fn({
				jobname: "autoRemind",
				id: o.id
			})
		});
		console.notice("[%s]执行自动提醒,耗时:%sms", Time(), new Date().getTime() - t);
	}
};
// sb.require('utils/watchdog').run(mode === "dev" ? 0 : 1);

while (true) {
	for (var k in JOBS) {
		try {
			JOBS[k]();
		} catch (e) {
			console.error(e.toString(), e.stack);
		}

	}

	console.log("[%s]等待10分钟....滴答滴答!", Time());
	coroutine.sleep(10 * 60 * 1000);
}