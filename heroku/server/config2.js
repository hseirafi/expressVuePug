"use strict";

var path = require("path");
var pkg = require("./package.json");

module.exports = {
	hashSecret: "0S60XWdbQlUxvvGqjTDFnce6rqigeemmYBCkhrdDRx9",

	sessionSecret: "ckOYwO97fjL3xNVWwSCQ3JoidXfwt1miahFxzAXLIMo",

	app: {
		title: "VEM APP",
		version: "1.0.0",
		description: "This is my boilerplate web app",
		keywords: "boilerplate, starter, webapp",
		url: "http://localhost:3000/",
		googleAnalyticsID: 'UA-xxxxx-x',
		contactEmail: "hello@vem-app.com"
	},

	db: {
		options: {
			user: process.env.MONGO_USERNAME || "",
			pass: process.env.MONGO_PASSWORD || ""
		}
	},

	redis: {
		enabled: false,
		uri: process.env.REDIS_URI || "redis://localhost:6379",
		options: null
	},

	mailer: {},

	features: {
		disableSignUp: false,
		verificationRequired: true
	},

	authKeys: {

		google: {
			clientID: '932217963551-a829s5qnj3k62vr4f0q5vhd7o6ulc0f1.apps.googleusercontent.com',
			clientSecret: 'dt9hgkT87H54AHcqFL7zo0LK'
		},

		facebook: {
			clientID: null,
			clientSecret: null
		},

		github: {
			clientID: null,
			clientSecret: null
		},

		twitter: {
			clientID: null,
			clientSecret: null
		}
	},

	logging: {

		console: {},

		file: {
			enabled: false
		},

		graylog: {
			enabled: false
		},

		papertrail: {
			enabled: false,
			host: null,
			port: null,
			level: "debug",
			program: "vem"
		},

		logentries: {
			enabled: false,
			token: null
		},

		loggly: {
			enabled: false,
			token: null,
			subdomain: null
		},

		logsene: {
			enabled: false,
			token: null
		},

		logzio: {
			enabled: false,
			token: null
		}

	}

};