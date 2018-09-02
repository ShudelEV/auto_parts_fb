<template>
	<div class="vue-stars"
		:class="{readonly:readonly,notouch:notouch}"
		ref="ratingEl"
		:style="mapCssProps"
		>
		<input type="radio" :id="name+'0'" :checked="value===0" :name="name" value="0">
		<template v-for="x in max">
			<label :for="name+x" :key="'l'+x"
                   @mouseover.prevent.stop="readonly ? '' : setColor(x)"
                   @mouseout.prevent.stop="readonly ? '' : setColor(0)">
				<span class="active" style="font-size: 175%"><slot name="activeLabel">{{ getActiveLabel(x) }}</slot></span>
				<span class="inactive" style="font-size: 175%"><slot name="inactiveLabel">{{ getInactiveLabel(x) }}</slot></span>
			</label><input
				:key="'i'+x"
				type="radio"
				@change="updateInput($event.target.value)"
				:checked="value===x"
				:id="name+x"
				:name="name"
				:disabled="readonly"
				:value="x">
		</template>
	</div>
</template>
<script>
export default {
	name: "VueStars",
	props: {
		max: { type: Number, required: false, default: 5 },
		value: { type: Number, required: false, default: 0 },
		name: { type: String, required: false, default: "rating" },
		char: { type: String, required: false, default: "★" },
		inactiveChar: { type: String, required: false, default: null },
		readonly: { type: Boolean, required: false, default: false },
//		activeColor: { type: String, required: false, default: "#FD0" },
//		inactiveColor: { type: String, required: false, default: "#999" },
//		shadowColor: { type: String, required: false, default: "#FF0" },
//		hoverColor: { type: String, required: false, default: "#DD0" },
	},
    data () {
        return {
            shadowColor: "#FF0",
            activeColor: "#FD0",
            hoverColor: "#DD0",
            inactiveColor: "#999"
        }
    },
    mounted () {
        if (this.value) { this.setColor(this.value) }
    },
    watch: {
        value: function (val) {
            this.setColor(val)
        }
    },
	computed: {
		ratingChars() {
			return Array.from(this.char)
		},
		inactiveRatingChars() {
			/* Default to ratingChars if no inactive characters have been provided */
			return this.inactiveChar
				? Array.from(this.inactiveChar)
				: this.ratingChars
		},
		notouch() {
			/* For iPhone specifically but really any touch device, there is no true hover state, disabled any pseudo-hover activity. */
			return !("ontouchstart" in document.documentElement)
		},
		mapCssProps() {
			return {
				"--active-color": this.activeColor,
				"--inactive-color": this.inactiveColor,
				"--shadow-color": this.shadowColor,
				"--hover-color": this.hoverColor,
			}
		},
	},
	methods: {
        setColor(x) {
            switch (x) {
                case 1:
                    this.shadowColor = "#ff334f";
                    this.activeColor = "#ff0023";
                    this.hoverColor = "#ff334f";
                    break;
                case 2:
                case 3:
                    this.shadowColor = "#f0ea43";
                    this.activeColor = "#ece514";
                    this.hoverColor = "#f0ea43";
                    break;
                case 4:
                case 5:
                    this.shadowColor = "#38ff19";
                    this.activeColor = "#1fe500";
                    this.hoverColor = "#38ff19";
                    break;
                default:
                    let val = this.$refs.ratingEl.querySelector("input:checked").value;
                    val = parseInt(val,10);
                    if (val > 0 && val <= 5) {
                        this.setColor(val);
                    }
                    break;
            }
        },
		updateInput(v) {
			this.$emit("input", parseInt(v, 10))
		},
		getActiveLabel(x) {
			const s = this.ratingChars
			return s[Math.min(s.length - 1, x - 1)]
		},
		getInactiveLabel(x) {
			const s = this.inactiveRatingChars
			return s[Math.min(s.length - 1, x - 1)]
		},
	},
}
</script>
<style>
.vue-stars {
	display: inline-flex;
	flex-flow: row nowrap;
	align-items: flex-start center;
	line-height: 1em;
}
.vue-stars label {
	display: block;
	padding: 0.125em;
	width: 1.2em;
	text-align: center;
	color: #fd0;
	text-shadow: 0 0 0.3em #ff0;
}
.vue-stars input,
.vue-stars label .inactive,
.vue-stars input:checked ~ label .active,
.vue-stars.notouch:not(.readonly):hover label .inactive,
.vue-stars.notouch:not(.readonly) label:hover ~ label .active {
	display: none;
}
.vue-stars input:checked ~ label .inactive,
.vue-stars.notouch:not(.readonly):hover label .active,
.vue-stars.notouch:not(.readonly) label:hover ~ label .inactive {
	display: inline;
}
.vue-stars.notouch:not(.readonly):hover label {
	color: #dd0;
	text-shadow: 0 0 0.3em #ff0;
}
input:checked ~ label,
.vue-stars.notouch:not(.readonly) label:hover ~ label {
	color: #999;
	text-shadow: none;
}
@supports (color: var(--prop)) {
	.vue-stars label {
		color: var(--active-color);
		text-shadow: 0 0 0.3em var(--shadow-color);
	}
	.vue-stars.notouch:not(.readonly):hover label {
		color: var(--hover-color);
		text-shadow: 0 0 0.3em var(--shadow-color);
	}
	.vue-stars input:checked ~ label,
	.vue-stars.notouch:not(.readonly) label:hover ~ label {
		color: var(--inactive-color);
	}
}
</style>
