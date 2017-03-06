"use strict";

let logger 		= require("../../../core/logger");
let config 		= require("../../../config");
let C 	 		= require("../../../core/constants");

let store 		= require("./memstore");

module.exports = {
	settings: {
		// Name of service
		name: "routeone",

		// Version (for versioned API)
		version: 1,

		// Namespace for rest and websocket requests
		namespace: "routeone",

		// Enable calling via REST
		rest: true,

		// Enable calling via websocket
		ws: true,

		// Required permission for actions
		permission: C.PERM_LOGGEDIN
	},

	// Actions of service
	actions: {
		/**
		 * 	Get the value of the routeone.
		 *
		 *	via REST:
		 *		GET /routeone
		 *		GET /routeone/find
		 *
		 *	via Websocket:
		 *		/routeone/find
		 *
		 *	via GraphQL:
		 *		query { routeone }
		 */
		find: {
			cache: true,
			handler(ctx) {
				return Promise.resolve(store.routeone);
			}
		},

		/**
		 * Set a new value to the routeone
		 *
		 *	via REST:
		 *		POST /routeone
		 *			body: { value: 123 }
		 *
		 *		GET /routeone/create?value=123
		 *
		 *	via Websocket:
		 *		/routeone/create
		 *			data: { value: 123 }
		 *
		 *	via GraphQL:
		 *		mutation { countercreate(value: 123) }
		 *
		 */
		create(ctx) {
			if (ctx.params.value) {
				return this.changeCounter(ctx, parseInt(ctx.params.value));
			} else {
				throw new Error("Missing value from request!");
			}
		},

		/**
		 * Reset the routeone
		 *
		 *	via REST:
		 *		GET /routeone/reset
		 *
		 *	via Websocket:
		 *		/routeone/reset
		 *
		 *	via GraphQL:
		 *		mutation { counterReset }
		 */
		reset: {
			// Need administration role to perform this action
			permission: C.PERM_ADMIN,

			// Handler
			handler(ctx) {
				return this.changeCounter(ctx, 0);
			}
		},

		/**
		 * Increment the routeone
		 *
		 *	via REST:
		 *		GET /routeone/increment
		 *
		 *	via Websocket:
		 *		/routeone/increment
		 *
		 *	via GraphQL:
		 *		mutation { counterIncrement }
		 */
		increment(ctx) {
			return this.changeCounter(ctx, store.routeone + 1);
		},

		/**
		 * Decrement the routeone
		 *
		 *	via REST:
		 *		GET /routeone/decrement
		 *
		 *	via Websocket:
		 *		/routeone/decrement
		 *
		 *	via GraphQL:
		 *		mutation { counterDecrement }
		 */
		decrement(ctx) {
			return this.changeCounter(ctx, store.routeone - 1);
		}

	},

	methods: {
		/**
		 * Change the routeone value
		 * @param  {Context} ctx   Context of request
		 * @param  {Number} value  New value
		 * @return {Promise}       Promise with the routeone value
		 */
		changeCounter(ctx, value) {
			store.routeone = value;
			logger.info(ctx.user.username + " changed the routeone to ", store.routeone);
			this.notifyModelChanges(ctx, "changed", store.routeone);

			return Promise.resolve(store.routeone);
		}
	},

	/**
	 * Initialize this service. It will be called when server load this service.
	 * The `ctx` contains the references of `app` and `db`
	 * @param  {Context} ctx   Context of initialization
	 */
	init(ctx) {
		// Call when start the service
		//logger.info("Initialize routeone service!");
	},

	/**
	 * Websocket options
	 */
	socket: {
		// Namespace of socket
		//nsp: "/routeone",

		// Fired after a new socket connected
		afterConnection(socket, io) {
			//logger.info("routeone afterConnection");

			// We sent the routeone last value to the client
			socket.emit("/routeone/changed", store.routeone);
		}
	},

	/**
	 * Define GraphQL queries, types, mutations.
	 * This definitions enable to access this service via graphql
	 */
	graphql: {
		query: `
			routeone: Int
		`,

		types: "",

		mutation: `
			counterCreate(value: Int!): Int
			counterReset: Int
			counterIncrement: Int
			counterDecrement: Int
		`,

		resolvers: {

			Query: {
				routeone: "find",
			},

			Mutation: {
				counterCreate: "create",
				counterReset: "reset",
				counterIncrement: "increment",
				counterDecrement: "decrement"
			}
		}
	}

};


/*
## GraphiQL test ##

# Get value of routeone
query getCounter {
  routeone
}

# Save a new routeone value
mutation saveCounter {
  counterCreate(value: 12)
}

# Reset the routeone
mutation resetCounter {
  counterReset
}

# Increment the routeone
mutation incrementCounter {
  counterIncrement
}

# Decrement the routeone
mutation decrementCounter {
  counterDecrement
}


*/
