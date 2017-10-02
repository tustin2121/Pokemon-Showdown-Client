// patch.js
// Patching various classes so they are compatable with the 3D battles.

/* global Battle, $, THREE */
const ZERO = new THREE.Vector3();

// from client.js
if (window.App) {
	App.prototype.updateTitle = function (room) {
		document.title = room.title ? room.title + " - 3D TPP League" : "3D TPP League";
	};
}

// from battle.js
if (window.Battle) {
	Battle.prototype.pos = function (loc, obj) {
		// TODO
	};
	Battle.prototype.posT = function (loc, obj, transition, oldloc) {
		// TODO
	};
	Battle.prototype.backgroundEffect = function (bg, duration, opacity, delay) {
		// TODO
	};
	Battle.prototype.showEffect = function(img, start, end, transition, after) {
		// TODO
	};
	Battle.prototype.updateWeather = function (weather, instant) {
		// TODO
	};
	
	Battle.prototype.updateGen = function () {
		// TODO battle backdrop
	};
	Battle.prototype.reset = function (dontResetSound) {
		// battle state
		this.turn = 0;
		this.ended = false;
		this.weather = '';
		this.weatherTimeLeft = 0;
		this.weatherMinTimeLeft = 0;
		this.pseudoWeather = [];
		this.lastMove = '';

		// DOM state
		this.frameElem.empty();
		this.elem = $('<div class="innerbattle"></div>').appendTo(this.frameElem);
		if (this.optionsElem) {
			this.logElem.empty();
			this.logPreemptElem.empty();
		} else {
			this.logFrameElem.html('<div class="battle-options"></div>');
			this.optionsElem = this.logFrameElem.children().last();
			this.logFrameElem.append('<div class="inner" role="log"></div>');
			this.logElem = this.logFrameElem.children().last();
			this.logFrameElem.append('<div class="inner-preempt"></div>');
			this.logPreemptElem = this.logFrameElem.children().last();
			this.logFrameElem.append('<div class="inner-after"></div>');
		}
		
		this.bgElem = $('<div class="backdrop">').appendTo(this.elem);
		this.weatherElem = $('<div class="weather">').appendTo(this.elem);
		this.bgEffectElem = $('<div>').appendTo(this.elem);
		
		if (!this.renderer) {
			this.renderer = new THREE.WebGLRenderer();
			this.scene = new THREE.Scene();
			this.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
			this.camera.position.set( -5, 3, -10);
			this.camera.lookAt(ZERO);
		}
		this.renderer.setSize( this.elem.innerWidth(), this.elem.innerHeight() );
		this.camera.aspect = this.elem.innerWidth() / this.elem.innerHeight();
		this.camera.updateProjectionMatrix();
		this.elem.append( this.renderer.domElement );
		
		this.statElem = $('<div role="complementary" aria-label="Active Pokemon"></div>').appendTo(this.elem);
		this.fxElem = $('<div>').appendTo(this.elem);
		this.leftbarElem = $('<div class="leftbar" role="complementary" aria-label="Your Team"></div>').appendTo(this.elem);
		this.rightbarElem = $('<div class="rightbar" role="complementary" aria-label="Opponent\'s Team"></div>').appendTo(this.elem);
		this.turnElem = $('<div>').appendTo(this.elem);
		this.messagebarElem = $('<div class="messagebar message"></div>').appendTo(this.elem);
		this.delayElem = $('<div>').appendTo(this.elem);
		this.hiddenMessageElem = $('<div class="message" style="position:absolute;display:block;visibility:hidden"></div>').appendTo(this.elem);
		
		if (this.mySide) this.mySide.reset();
		if (this.yourSide) this.yourSide.reset();

		if (this.ignoreNicks) {
			var $log = $('.battle-log .inner');
			if ($log.length) $log.addClass('hidenicks');
		}

		// activity queue state
		this.animationDelay = 0;
		this.multiHitMove = null;
		this.activeMoveIsSpread = null;
		this.activityStep = 0;
		this.activityDelay = 0;
		this.activityAfter = null;
		this.activityAnimations = $();
		this.activityQueueActive = false;
		this.fastForwardOff();
		$.fx.off = false;
		this.minorQueue = [];
		this.resultWaiting = false;
		this.paused = true;
		if (this.playbackState !== 5) {
			this.playbackState = (this.activityQueue.length ? 1 : 0);
			if (!dontResetSound) this.soundStop();
		}
	};
	
	// Battle.prototype.resultAnim = function (pokemon, result, type) {}; //Keeping
	// Battle.prototype.abilityActivateAnim = function (pokemon, result) {}; //Keeping
	// Battle.prototype.damageAnim = function (pokemon, damage) {}; //Keeping
	// Battle.prototype.healAnim = function (pokemon, damage) {}; //Keeping
	Battle.prototype.teamPreview = function (start) {
		// TODO
	};
	
	var old_runMajor = Battle.prototype.runMajor;
	Battle.prototype.runMajor = function (args, kwargs, preempt) {
		switch (args[0]) {
			// TODO
			default: return old_runMajor.call(this, args, kwargs, preempt);
		}
	};
	
	// Possibly replace?
	// Battle.prototype.pause = function () {
	// 	// TODO
	// };
	// Battle.prototype.play = function (dontResetSound) {
	// 	// TODO
	// };
	// Battle.prototype.fastForwardTo = function (time) {
	// 	// TODO
	// };
}

// Completely replace Sprite (from battle.js)
window.Sprite = (function () {
	function Sprite(spriteData, x, y, z, battle, siden) {
		this.battle = battle;
		this.siden = siden;
		this.forme = '';
		this.cryurl = '';
		// TODO
		this.x = x;
		this.y = y;
		this.z = z;
		
		this.isBackSprite = !siden;
		this.duringMove = false;
		this.isMissedPokemon = false;
	}
	
	Sprite.prototype.behindx = function (offset) {
		return this.x + (this.isBackSprite ? -1 : 1) * offset;
	};
	Sprite.prototype.behindy = function (offset) {
		return this.y + (this.isBackSprite ? 1 : -1) * offset;
	};
	Sprite.prototype.leftof = function (offset) {
		return this.x + (this.isBackSprite ? -1 : 1) * offset;
	};
	Sprite.prototype.behind = function (offset) {
		return this.z + (this.isBackSprite ? -1 : 1) * offset;
	};
	Sprite.prototype.animTransform = function (species, isCustomAnim) {
		//TODO
	};
	Sprite.prototype.destroy = function () {
		// TODO
		delete this.battle;
	};
	Sprite.prototype.removeTransform = function (species) {
		// TODO
	};
	/** Animate Substitute */
	Sprite.prototype.animSub = function (instant) {
		// TODO
	};
	Sprite.prototype.animSubFade = function () {
		// TODO
	};
	Sprite.prototype.beforeMove = function () {
		// TODO
	};
	Sprite.prototype.afterMove = function () {
		// TODO
	};
	Sprite.prototype.removeSub = function () {
		// TODO
	};
	Sprite.prototype.animReset = function () {
		// TODO
	};
	/** Animate sending out into battle */
	Sprite.prototype.animSummon = function (slot, instant) {
		// TODO
	};
	/** Animate being dragged into battle */
	Sprite.prototype.animDragIn = function (slot) {
		// TODO
	};
	/** Animate being dragged out of battle */
	Sprite.prototype.animDragOut = function () {
		// TODO
	};
	/** Animate being recalled from battle */
	Sprite.prototype.animUnsummon = function (instant) {
		// TODO
	};
	Sprite.prototype.animFaint = function () {
		// TODO
	};
	Sprite.prototype.delay = function (time) {
		// TODO
		return this;
	};
	Sprite.prototype.selfAnim = function (end, transition) {
		// TODO
	};
	Sprite.prototype.anim = function (end, transition) {
		// TODO
	}; 
	return Sprite;
})();
