/*!
 * wavesurfer.js 2.0.0-beta01 (Tue May 02 2017 19:46:40 GMT+0200 (CEST))
 * https://github.com/katspaugh/wavesurfer.js
 * @license CC-BY-3.0
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("regions", [], factory);
	else if(typeof exports === 'object')
		exports["regions"] = factory();
	else
		root["WaveSurfer"] = root["WaveSurfer"] || {}, root["WaveSurfer"]["regions"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "localhost:8080/dist/plugin/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ({

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * (Single) Region plugin class
 *
 * Must be turned into an observer before instantiating. This is done in
 * RegionsPlugin (main plugin class)
 *
 * @extends {Observer}
 */
var Region = function () {
    function Region(params, ws) {
        var _this = this;

        _classCallCheck(this, Region);

        this.wavesurfer = ws;
        this.wrapper = ws.drawer.wrapper;
        this.style = ws.util.style;

        this.id = params.id == null ? ws.util.getId() : params.id;
        this.start = Number(params.start) || 0;
        this.end = params.end == null ?
        // small marker-like region
        this.start + 4 / this.wrapper.scrollWidth * this.wavesurfer.getDuration() : Number(params.end);
        this.resize = params.resize === undefined ? true : Boolean(params.resize);
        this.drag = params.drag === undefined ? true : Boolean(params.drag);
        this.loop = Boolean(params.loop);
        this.color = params.color || 'rgba(0, 0, 0, 0.1)';
        this.data = params.data || {};
        this.attributes = params.attributes || {};

        this.maxLength = params.maxLength;
        this.minLength = params.minLength;

        this.bindInOut();
        this.render();
        this.wavesurfer.on('zoom', function () {
            return _this.updateRender();
        });
        this.wavesurfer.fireEvent('region-created', this);
    }

    /* Update region params. */


    _createClass(Region, [{
        key: 'update',
        value: function update(params) {
            if (null != params.start) {
                this.start = Number(params.start);
            }
            if (null != params.end) {
                this.end = Number(params.end);
            }
            if (null != params.loop) {
                this.loop = Boolean(params.loop);
            }
            if (null != params.color) {
                this.color = params.color;
            }
            if (null != params.data) {
                this.data = params.data;
            }
            if (null != params.resize) {
                this.resize = Boolean(params.resize);
            }
            if (null != params.drag) {
                this.drag = Boolean(params.drag);
            }
            if (null != params.maxLength) {
                this.maxLength = Number(params.maxLength);
            }
            if (null != params.minLength) {
                this.minLength = Number(params.minLength);
            }
            if (null != params.attributes) {
                this.attributes = params.attributes;
            }

            this.updateRender();
            this.fireEvent('update');
            this.wavesurfer.fireEvent('region-updated', this);
        }

        /* Remove a single region. */

    }, {
        key: 'remove',
        value: function remove() {
            var _this2 = this;

            if (this.element) {
                this.wrapper.removeChild(this.element);
                this.element = null;
                this.fireEvent('remove');
                this.wavesurfer.un('zoom', function (pxPerSec) {
                    return _this2.updateRender(pxPerSec);
                });
                this.wavesurfer.fireEvent('region-removed', this);
            }
        }

        /* Play the audio region. */

    }, {
        key: 'play',
        value: function play() {
            this.wavesurfer.play(this.start, this.end);
            this.fireEvent('play');
            this.wavesurfer.fireEvent('region-play', this);
        }

        /* Play the region in loop. */

    }, {
        key: 'playLoop',
        value: function playLoop() {
            var _this3 = this;

            this.play();
            this.once('out', function () {
                return _this3.playLoop();
            });
        }

        /* Render a region as a DOM element. */

    }, {
        key: 'render',
        value: function render() {
            var regionEl = document.createElement('region');
            regionEl.className = 'wavesurfer-region';
            regionEl.title = this.formatTime(this.start, this.end);
            regionEl.setAttribute('data-id', this.id);

            for (var attrname in this.attributes) {
                regionEl.setAttribute('data-region-' + attrname, this.attributes[attrname]);
            }

            var width = this.wrapper.scrollWidth;
            this.style(regionEl, {
                position: 'absolute',
                zIndex: 2,
                height: '100%',
                top: '0px'
            });

            /* Resize handles */
            if (this.resize) {
                var handleLeft = regionEl.appendChild(document.createElement('handle'));
                var handleRight = regionEl.appendChild(document.createElement('handle'));
                handleLeft.className = 'wavesurfer-handle wavesurfer-handle-start';
                handleRight.className = 'wavesurfer-handle wavesurfer-handle-end';
                var css = {
                    cursor: 'col-resize',
                    position: 'absolute',
                    left: '0px',
                    top: '0px',
                    width: '1%',
                    maxWidth: '4px',
                    height: '100%'
                };
                this.style(handleLeft, css);
                this.style(handleRight, css);
                this.style(handleRight, {
                    left: '100%'
                });
            }

            this.element = this.wrapper.appendChild(regionEl);
            this.updateRender();
            this.bindEvents(regionEl);
        }
    }, {
        key: 'formatTime',
        value: function formatTime(start, end) {
            return (start == end ? [start] : [start, end]).map(function (time) {
                return [Math.floor(time % 3600 / 60), // minutes
                ('00' + Math.floor(time % 60)).slice(-2) // seconds
                ].join(':');
            }).join('-');
        }

        /* Update element's position, width, color. */

    }, {
        key: 'updateRender',
        value: function updateRender(pxPerSec) {
            var dur = this.wavesurfer.getDuration();
            var width = void 0;
            if (pxPerSec) {
                width = Math.round(this.wavesurfer.getDuration() * pxPerSec);
            } else {
                width = this.wrapper.scrollWidth;
            }

            if (this.start < 0) {
                this.start = 0;
                this.end = this.end - this.start;
            }
            if (this.end > dur) {
                this.end = dur;
                this.start = dur - (this.end - this.start);
            }

            if (this.minLength != null) {
                this.end = Math.max(this.start + this.minLength, this.end);
            }

            if (this.maxLength != null) {
                this.end = Math.min(this.start + this.maxLength, this.end);
            }

            if (this.element != null) {
                // Calculate the left and width values of the region such that
                // no gaps appear between regions.
                var left = Math.round(this.start / dur * width);
                var regionWidth = Math.round(this.end / dur * width) - left;

                this.style(this.element, {
                    left: left + 'px',
                    width: regionWidth + 'px',
                    backgroundColor: this.color,
                    cursor: this.drag ? 'move' : 'default'
                });

                for (var attrname in this.attributes) {
                    this.element.setAttribute('data-region-' + attrname, this.attributes[attrname]);
                }

                this.element.title = this.formatTime(this.start, this.end);
            }
        }

        /* Bind audio events. */

    }, {
        key: 'bindInOut',
        value: function bindInOut() {
            var _this4 = this;

            this.firedIn = false;
            this.firedOut = false;

            var onProcess = function onProcess(time) {
                if (!_this4.firedOut && _this4.firedIn && (_this4.start >= Math.round(time * 100) / 100 || _this4.end <= Math.round(time * 100) / 100)) {
                    _this4.firedOut = true;
                    _this4.firedIn = false;
                    _this4.fireEvent('out');
                    _this4.wavesurfer.fireEvent('region-out', _this4);
                }
                if (!_this4.firedIn && _this4.start <= time && _this4.end > time) {
                    _this4.firedIn = true;
                    _this4.firedOut = false;
                    _this4.fireEvent('in');
                    _this4.wavesurfer.fireEvent('region-in', _this4);
                }
            };

            this.wavesurfer.backend.on('audioprocess', onProcess);

            this.on('remove', function () {
                _this4.wavesurfer.backend.un('audioprocess', onProcess);
            });

            /* Loop playback. */
            this.on('out', function () {
                if (_this4.loop) {
                    _this4.wavesurfer.play(_this4.start);
                }
            });
        }

        /* Bind DOM events. */

    }, {
        key: 'bindEvents',
        value: function bindEvents() {
            var _this5 = this;

            this.element.addEventListener('mouseenter', function (e) {
                _this5.fireEvent('mouseenter', e);
                _this5.wavesurfer.fireEvent('region-mouseenter', _this5, e);
            });

            this.element.addEventListener('mouseleave', function (e) {
                _this5.fireEvent('mouseleave', e);
                _this5.wavesurfer.fireEvent('region-mouseleave', _this5, e);
            });

            this.element.addEventListener('click', function (e) {
                e.preventDefault();
                _this5.fireEvent('click', e);
                _this5.wavesurfer.fireEvent('region-click', _this5, e);
            });

            this.element.addEventListener('dblclick', function (e) {
                e.stopPropagation();
                e.preventDefault();
                _this5.fireEvent('dblclick', e);
                _this5.wavesurfer.fireEvent('region-dblclick', _this5, e);
            });

            /* Drag or resize on mousemove. */
            (this.drag || this.resize) && function () {
                var duration = _this5.wavesurfer.getDuration();
                var startTime = void 0;
                var touchId = void 0;
                var drag = void 0;
                var resize = void 0;

                var onDown = function onDown(e) {
                    if (e.touches && e.touches.length > 1) {
                        return;
                    }
                    touchId = e.targetTouches ? e.targetTouches[0].identifier : null;

                    e.stopPropagation();
                    startTime = _this5.wavesurfer.drawer.handleEvent(e, true) * duration;

                    if (e.target.tagName.toLowerCase() == 'handle') {
                        if (e.target.classList.contains('wavesurfer-handle-start')) {
                            resize = 'start';
                        } else {
                            resize = 'end';
                        }
                    } else {
                        drag = true;
                        resize = false;
                    }
                };
                var onUp = function onUp(e) {
                    if (e.touches && e.touches.length > 1) {
                        return;
                    }

                    if (drag || resize) {
                        drag = false;
                        resize = false;

                        _this5.fireEvent('update-end', e);
                        _this5.wavesurfer.fireEvent('region-update-end', _this5, e);
                    }
                };
                var onMove = function onMove(e) {
                    if (e.touches && e.touches.length > 1) {
                        return;
                    }
                    if (e.targetTouches && e.targetTouches[0].identifier != touchId) {
                        return;
                    }

                    if (drag || resize) {
                        var time = _this5.wavesurfer.drawer.handleEvent(e) * duration;
                        var delta = time - startTime;
                        startTime = time;

                        // Drag
                        if (_this5.drag && drag) {
                            _this5.onDrag(delta);
                        }

                        // Resize
                        if (_this5.resize && resize) {
                            _this5.onResize(delta, resize);
                        }
                    }
                };

                _this5.element.addEventListener('mousedown', onDown);
                _this5.element.addEventListener('touchstart', onDown);

                _this5.wrapper.addEventListener('mousemove', onMove);
                _this5.wrapper.addEventListener('touchmove', onMove);

                document.body.addEventListener('mouseup', onUp);
                document.body.addEventListener('touchend', onUp);

                _this5.on('remove', function () {
                    document.body.removeEventListener('mouseup', onUp);
                    document.body.removeEventListener('touchend', onUp);
                    _this5.wrapper.removeEventListener('mousemove', onMove);
                    _this5.wrapper.removeEventListener('touchmove', onMove);
                });

                _this5.wavesurfer.on('destroy', function () {
                    document.body.removeEventListener('mouseup', onUp);
                    document.body.removeEventListener('touchend', onUp);
                });
            }();
        }
    }, {
        key: 'onDrag',
        value: function onDrag(delta) {
            var maxEnd = this.wavesurfer.getDuration();
            if (this.end + delta > maxEnd || this.start + delta < 0) {
                return;
            }

            this.update({
                start: this.start + delta,
                end: this.end + delta
            });
        }
    }, {
        key: 'onResize',
        value: function onResize(delta, direction) {
            if (direction == 'start') {
                this.update({
                    start: Math.min(this.start + delta, this.end),
                    end: Math.max(this.start + delta, this.end)
                });
            } else {
                this.update({
                    start: Math.min(this.end + delta, this.start),
                    end: Math.max(this.end + delta, this.start)
                });
            }
        }
    }]);

    return Region;
}();

/**
 * @typedef {Object} RegionsPluginParams
 * @property {?boolean} dragSelection Enable creating regions by dragging wih
 * the mouse
 * @property {?RegionParams[]} regions Regions that should be added upon
 * initialisation
 * @property {number} slop=2 The sensitivity of the mouse dragging
 * @property {?boolean} deferInit Set to true to manually call
 * `initPlugin('regions')`
 */

/**
 * @typedef {Object} RegionParams
 * @desc The parameters used to describe a region.
 * @example wavesurfer.addRegion(regionParams);
 * @property {string} id=→random The id of the region
 * @property {number} start=0 The start position of the region (in seconds).
 * @property {number} end=0 The end position of the region (in seconds).
 * @property {?boolean} loop Whether to loop the region when played back.
 * @property {boolean} drag=true Allow/dissallow dragging the region.
 * @property {boolean} resize=true Allow/dissallow resizing the region.
 * @property {string} [color='rgba(0, 0, 0, 0.1)'] HTML color code.
 */

/**
 * Regions are visual overlays on waveform that can be used to play and loop
 * portions of audio. Regions can be dragged and resized.
 *
 * Visual customization is possible via CSS (using the selectors
 * `.wavesurfer-region` and `.wavesurfer-handle`).
 *
 * @implements {PluginClass}
 * @extends {Observer}
 *
 * @example
 * // es6
 * import RegionsPlugin from 'wavesurfer.regions.js';
 *
 * // commonjs
 * var RegionsPlugin = require('wavesurfer.regions.js');
 *
 * // if you are using <script> tags
 * var RegionsPlugin = window.WaveSurfer.regions;
 *
 * // ... initialising wavesurfer with the plugin
 * var wavesurfer = WaveSurfer.create({
 *   // wavesurfer options ...
 *   plugins: [
 *     RegionsPlugin.create({
 *       // plugin options ...
 *     })
 *   ]
 * });
 */


var RegionsPlugin = function () {
    _createClass(RegionsPlugin, null, [{
        key: 'create',

        /**
         * Regions plugin definition factory
         *
         * This function must be used to create a plugin definition which can be
         * used by wavesurfer to correctly instantiate the plugin.
         *
         * @param {RegionsPluginParams} params parameters use to initialise the plugin
         * @return {PluginDefinition} an object representing the plugin
         */
        value: function create(params) {
            return {
                name: 'regions',
                deferInit: params && params.deferInit ? params.deferInit : false,
                params: params,
                staticProps: {
                    initRegions: function initRegions() {
                        console.warn('Deprecated initRegions! Use wavesurfer.initPlugins("regions") instead!');
                        this.initPlugin('regions');
                    },
                    addRegion: function addRegion(options) {
                        if (!this.initialisedPluginList.regions) {
                            this.initPlugin('regions');
                        }
                        this.regions.add(options);
                    },
                    clearRegions: function clearRegions() {
                        this.regions && this.regions.clear();
                    },
                    enableDragSelection: function enableDragSelection(options) {
                        if (!this.initialisedPluginList.regions) {
                            this.initPlugin('regions');
                        }
                        this.regions.enableDragSelection(options);
                    },
                    disableDragSelection: function disableDragSelection() {
                        this.regions.disableDragSelection();
                    }
                },
                instance: RegionsPlugin
            };
        }
    }]);

    function RegionsPlugin(params, ws) {
        var _this6 = this;

        _classCallCheck(this, RegionsPlugin);

        this.params = params;
        this.wavesurfer = ws;
        this.util = ws.util;

        // turn the plugin instance into an observer
        var observerPrototypeKeys = Object.getOwnPropertyNames(this.util.Observer.prototype);
        observerPrototypeKeys.forEach(function (key) {
            Region.prototype[key] = _this6.util.Observer.prototype[key];
        });
        this.wavesurfer.Region = Region;

        // Id-based hash of regions.
        this.list = {};
        this._onReady = function () {
            _this6.wrapper = _this6.wavesurfer.drawer.wrapper;
            if (_this6.params.regions) {
                _this6.params.regions.forEach(function (region) {
                    _this6.add(region);
                });
            }
            if (_this6.params.dragSelection) {
                _this6.enableDragSelection(_this6.params.dragSelection);
            }
        };
    }

    _createClass(RegionsPlugin, [{
        key: 'init',
        value: function init() {
            // Check if ws is ready
            if (this.wavesurfer.isReady) {
                this._onReady();
            }
            this.wavesurfer.on('ready', this._onReady);
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.wavesurfer.un('ready', this._onReady);
            this.disableDragSelection();
            this.clear();
        }
        /* Add a region. */

    }, {
        key: 'add',
        value: function add(params) {
            var _this7 = this;

            var region = new this.wavesurfer.Region(params, this.wavesurfer);

            this.list[region.id] = region;

            region.on('remove', function () {
                delete _this7.list[region.id];
            });

            return region;
        }

        /* Remove all regions. */

    }, {
        key: 'clear',
        value: function clear() {
            var _this8 = this;

            Object.keys(this.list).forEach(function (id) {
                _this8.list[id].remove();
            });
        }
    }, {
        key: 'enableDragSelection',
        value: function enableDragSelection(params) {
            var _this9 = this;

            var slop = params.slop || 2;
            var drag = void 0;
            var start = void 0;
            var region = void 0;
            var touchId = void 0;
            var pxMove = 0;

            var eventDown = function eventDown(e) {
                if (e.touches && e.touches.length > 1) {
                    return;
                }
                touchId = e.targetTouches ? e.targetTouches[0].identifier : null;

                drag = true;
                start = _this9.wavesurfer.drawer.handleEvent(e, true);
                region = null;
            };
            this.wrapper.addEventListener('mousedown', eventDown);
            this.wrapper.addEventListener('touchstart', eventDown);
            this.on('disable-drag-selection', function () {
                _this9.wrapper.removeEventListener('touchstart', eventDown);
                _this9.wrapper.removeEventListener('mousedown', eventDown);
            });

            var eventUp = function eventUp(e) {
                if (e.touches && e.touches.length > 1) {
                    return;
                }

                drag = false;
                pxMove = 0;

                if (region) {
                    region.fireEvent('update-end', e);
                    _this9.wavesurfer.fireEvent('region-update-end', region, e);
                }

                region = null;
            };
            this.wrapper.addEventListener('mouseup', eventUp);
            this.wrapper.addEventListener('touchend', eventUp);
            this.on('disable-drag-selection', function () {
                _this9.wrapper.removeEventListener('touchend', eventUp);
                _this9.wrapper.removeEventListener('mouseup', eventUp);
            });

            var eventMove = function eventMove(e) {
                if (!drag) {
                    return;
                }
                if (++pxMove <= slop) {
                    return;
                }

                if (e.touches && e.touches.length > 1) {
                    return;
                }
                if (e.targetTouches && e.targetTouches[0].identifier != touchId) {
                    return;
                }

                if (!region) {
                    region = _this9.add(params || {});
                }

                var duration = _this9.wavesurfer.getDuration();
                var end = _this9.wavesurfer.drawer.handleEvent(e);
                region.update({
                    start: Math.min(end * duration, start * duration),
                    end: Math.max(end * duration, start * duration)
                });
            };
            this.wrapper.addEventListener('mousemove', eventMove);
            this.wrapper.addEventListener('touchmove', eventMove);
            this.on('disable-drag-selection', function () {
                _this9.wrapper.removeEventListener('touchmove', eventMove);
                _this9.wrapper.removeEventListener('mousemove', eventMove);
            });
        }
    }, {
        key: 'disableDragSelection',
        value: function disableDragSelection() {
            this.fireEvent('disable-drag-selection');
        }
    }]);

    return RegionsPlugin;
}();

exports.default = RegionsPlugin;
module.exports = exports['default'];

/***/ })

/******/ });
});
//# sourceMappingURL=wavesurfer.regions.js.map