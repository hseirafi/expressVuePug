<template lang="pug">
	.container
		h2.title {{ "Incrementing counter with sever listening through socket io " | i18n }}
		h3 {{ count }}
		button.button.success(@click="inc")
			span.icon
				i.fa.fa-arrow-up
			span {{ "Increment" | i18n }}
		br
		br
		button.button.warning(@click="dec")
			span
				i.fa.fa-arrow-up
			span {{ "Decrement" | i18n }}
		parallax( :fixed="true")
			img(src="https://apertureless.github.io/vue-parallax/static/img/pexels-photo-196416.jpeg"  alt="very cool bg")

</template>

<script>
	import Parallax from 'vue-parallaxy';
	import { mapActions, mapGetters } from "vuex";







	import Service from "../../core/service";

	export default {
		/**
		 * Computed getters
		 */
		components:{
		    Parallax
		},
		 computed: mapGetters("routeone", [
			 "count"
		 ]),

		/**
		 * Page methods
		 */
		methods: {
			/**
			 * Actions from store
			 */
			...mapActions("routeone", [
				"getValue",
				"increment",
				"decrement",
				"changedValue"
			]),

			/**
			 * Increment routeone
			 */
			inc() {
				this.increment() ;
			},

			/**
			 * Decrement routeone
			 */
			dec() {
				this.decrement();
			}
		},

		/**
		 * Socket handlers. Every property is an event handler
		 */
		socket: {

			prefix: "/routeone/",

			//namespace: "/routeone",

			events: {
				/**
				 * Counter value is changed
				 * @param  {Number} msg Value of routeone
				 */
				changed(res) {
					console.log("Counter changed to " + res.data + (res.user ? " by " + res.user.fullName : ""));
					this.changedValue(res.data);
				}
			}
		},

		created() {
			this.$service = new Service("routeone", this);

			// Get the latest value of routeone
			this.getValue();
		}
	};

</script>

<style lang="sass" language="sass" scoped>
	h2.title{
		margin:auto;
	}
</style>
