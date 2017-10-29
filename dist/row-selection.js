/*! row-selection.js v1.0.0 | https://github.com/SanthoshBabuMR/row-selection.git *//******/ (function(modules) { // webpackBootstrap
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);


var constants = {
    modifierKey: {
        shift: 'shift',
        ctrl: 'ctrl'
    },
    directions: {
        top: 'TOP',
        bottom: 'BOTTOM'
    },
    selectionType: {
        select: 'select',
        deselect: 'deselect',
        toggle: 'toggle'
    }
};

var defaults = {
    rowIdentifier: 'tbody tr',
    selectRowIfTargetIs: [],
    selectRowIfTargetIsNot: [],
    eventNs: 'uiSelectableRow',
    eventType: {
        toggleSelection: 'toggle-selection',
        enable: 'enable',
        disable: 'disable',
        destroy: 'destroy',
        destroyed: 'destroyed',
        shiftSelectable: 'shift-selectable',
        ctrlSelectable: 'ctrl-selectable'
    },
    dataAttr: {
        rowIdentifier: 'data-row-identifier',
        selectRowIfTargetIs: 'data-select-row-if-target-is',
        selectRowIfTargetIsNot: 'data-select-row-if-target-is-not',
        disabled: 'data-disabled',
        shiftSelectable: 'data-shift-selectable',
        ctrlSelectable: 'data-ctrl-selectable',
        selectedRowClass: 'data-selected-class'
    },
    isDisabled: false,
    isShiftSelectable: true,
    isCtrlSelectable: true,
    selectedRowClass: 'ui-selectable-row-selected',
    containerHoverClass: 'ui-selectable-row-hover',
    disableTextSelectionClass : 'ui-selectable-row-disable-text-selection',
};

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function dataAttributeBasedConfig (config, containerEl) {
  var attr = config.dataAttr;
  return {
    rowIdentifier: containerEl.attr(attr.rowIdentifier),
    selectRowIfTargetIs: containerEl.attr(attr.selectRowIfTargetIs),
    selectRowIfTargetIsNot: containerEl.attr(attr.selectRowIfTargetIsNot),
    isDisabled: containerEl.attr(attr.disabled),
    isShiftSelectable: containerEl.attr(attr.shiftSelectable),
    isCtrlSelectable: containerEl.attr(attr.ctrlSelectable),
    selectedRowClass: containerEl.attr(attr.selectedRowClass)
  };
}

function formatConfig (config) {
    var  configuration = {};
    configuration.eventNs = config.eventNs + '-' + guid();
    if (!(config.selectRowIfTargetIs instanceof Array)) {
        configuration.selectRowIfTargetIs = [];
        console.log('\'selectRowIfTargetIs\' should be an array')
    }
    if (!(config.selectRowIfTargetIsNot instanceof Array)) {
        configuration.selectRowIfTargetIsNot = [];
        console.log('\'selectRowIfTargetIsNot\' should be an array')
    }
    return configuration;
}

function configure (option, containerEl) {
    var mashedConfig = __WEBPACK_IMPORTED_MODULE_0_jquery___default.a.extend( {}, defaults, option, constants);
    var mashedConfig = __WEBPACK_IMPORTED_MODULE_0_jquery___default.a.extend( mashedConfig, dataAttributeBasedConfig(mashedConfig, containerEl))
    var mashedConfig = __WEBPACK_IMPORTED_MODULE_0_jquery___default.a.extend( mashedConfig, formatConfig(mashedConfig));
    return mashedConfig;
}

function updateState (argsJson, newState) {
    __WEBPACK_IMPORTED_MODULE_0_jquery___default.a.extend(argsJson.state, newState);
}

function updateUi (argsJson, newUi) {
    var config = argsJson.config;
    if (newUi === undefined) {
        return;
    }
    if (newUi.rowsToSelect && newUi.rowsToSelect.length) {
        newUi.rowsToSelect.addClass(config.selectedRowClass);
    }
    if (newUi.rowsToDeselect && newUi.rowsToDeselect.length) {
        newUi.rowsToDeselect.removeClass(config.selectedRowClass);
    }
}

function update (argsJson, newState, newUi) {
    // console.log(newState);
    // console.log(newUi);
    var containerEl = argsJson.containerEl;
    var config = argsJson.config;
    updateState(argsJson, newState);
    updateUi(argsJson, newUi);
    containerEl.trigger(config.eventType.toggleSelection,
                        [ __WEBPACK_IMPORTED_MODULE_0_jquery___default()(newUi.rowsToSelect), __WEBPACK_IMPORTED_MODULE_0_jquery___default()(newUi.rowsToDeselect), getSelectedRows(argsJson) ]);
}

function computeState (argsJson, currentRow, modifierKey, customState) {
    var config = argsJson.config;
    var state = argsJson.state;
    var newState = {};
    var rIndex = __WEBPACK_IMPORTED_MODULE_0_jquery___default()(state.recentRowElected).index();
    var cIndex = currentRow.index();
    newState.recentRowElected = currentRow.get(0);
    newState.pastRowElected = state.pastRowElected ? state.recentRowElected : currentRow.get(0);
    newState.pastRowElected = state.pastRowElected ? state.recentRowElected : currentRow.get(0);
    if (state.recentRowElected) {
        newState.recentDirection = rIndex > cIndex ? config.directions.top : config.directions.bottom;
        newState.pastDirection = state.recentDirection ? state.recentDirection : newState.recentDirection;
    }
    newState.recentModifierKey = modifierKey;
    return customState ? __WEBPACK_IMPORTED_MODULE_0_jquery___default.a.extend(newState, customState) : newState;
}

function filterSelection (argsJson, rows) {
    var config = argsJson.config;
    if (typeof config.filterSelection === 'function') {
        if (rows && rows.length) {
            return rows.filter(function (index, row) {
                return config.filterSelection(index, row);
            });
        }
    }
    return rows;
}

function getSelectedRows (argsJson) {
    var config = argsJson.config;
    var containerEl = argsJson.containerEl;
    return containerEl.find('.'  + config.selectedRowClass);
}

function isRowSelected (argsJson, row) {
    var config = argsJson.config;
    if (row && row.length === 1) {
        return row.is('.'+ config.selectedRowClass);
    }
}

function createRowGroup (argsJson, r1, r2) {
    var containerEl = argsJson.containerEl;
    if (r1.index() > r2.index()) {
        return r2.add(containerEl.find(r2).nextUntil(r1)).add(r1);
    } else {
        return r1.add(containerEl.find(r1).nextUntil(r2)).add(r2);
    }
}

function splitRowGroupByPastRowElected (argsJson, currentRow, rowGroup) {
    var state = argsJson.state;
    var rIndex = __WEBPACK_IMPORTED_MODULE_0_jquery___default()(state.recentRowElected).index();
    var cIndex = currentRow.index();
    var firstRow = rowGroup[0];
    var lastRow = rowGroup[rowGroup.length-1];
    var r1;
    var r2;
    if (rIndex > cIndex) {
        r1 = __WEBPACK_IMPORTED_MODULE_0_jquery___default()().add(firstRow).add(__WEBPACK_IMPORTED_MODULE_0_jquery___default()(firstRow).nextUntil(state.pastRowElected))
        r2 = __WEBPACK_IMPORTED_MODULE_0_jquery___default()().add(lastRow).add(__WEBPACK_IMPORTED_MODULE_0_jquery___default()(lastRow).prevUntil(state.pastRowElected))
    } else {
        r1 = __WEBPACK_IMPORTED_MODULE_0_jquery___default()().add(lastRow).add(__WEBPACK_IMPORTED_MODULE_0_jquery___default()(lastRow).prevUntil(state.pastRowElected))
        r2 = __WEBPACK_IMPORTED_MODULE_0_jquery___default()().add(firstRow).add(__WEBPACK_IMPORTED_MODULE_0_jquery___default()(firstRow).nextUntil(state.pastRowElected))
    }
    return {
        r1: r1,
        r2: r2
    }
}

function getCurrentSelectionDirection (argsJson, currentRow) {
    var config = argsJson.config;
    var state = argsJson.state;
    var rIndex = __WEBPACK_IMPORTED_MODULE_0_jquery___default()(state.recentRowElected).index();
    var cIndex = currentRow.index();
    if (state.recentRowElected) {
        return rIndex > cIndex ? config.directions.top : config.directions.bottom;
    }
}

function findIfSelectionDirectionInverted (argsJson, currentRow) {
    var state = argsJson.state;
    var currentSelectionDirection = getCurrentSelectionDirection(argsJson, currentRow);
    if (typeof currentSelectionDirection === 'string' && typeof state.recentDirection === 'string') {
        return currentSelectionDirection !== state.recentDirection
    }
}

function getRecentRowElectedUpToCurrentRow (argsJson, currentRow) {
    var config = argsJson.config;
    var state = argsJson.state;
    var currentSelectionDirection = getCurrentSelectionDirection(argsJson, currentRow);
    var rows = __WEBPACK_IMPORTED_MODULE_0_jquery___default()();
    if (currentSelectionDirection === config.directions.top) {
        rows = rows.add(state.recentRowElected).add(__WEBPACK_IMPORTED_MODULE_0_jquery___default()(state.recentRowElected).prevUntil(currentRow.get(0)));
    } else if (currentSelectionDirection === config.directions.bottom) {
        rows = rows.add(state.recentRowElected).add(currentRow.prevUntil(state.recentRowElected));
    }
    return rows;
}

function isTargetClickable (e, argsJson) {
    var config = argsJson.config;
    var clickedAllowed = true;
    if (config.selectRowIfTargetIs.length > 0) {
        clickedAllowed = __WEBPACK_IMPORTED_MODULE_0_jquery___default()(e.target).is(config.selectRowIfTargetIs.join(" ,"));
    } else if (config.selectRowIfTargetIsNot.length > 0) {
        clickedAllowed = !__WEBPACK_IMPORTED_MODULE_0_jquery___default()(e.target).is(config.selectRowIfTargetIsNot.join(" ,"));
    }
    return clickedAllowed;
}

function manageClick (e, argsJson, currentRow ) {
    var config = argsJson.config;
    var state = argsJson.state;
    var containerEl = argsJson.containerEl;
    if (config.isDisabled || !isTargetClickable(e, argsJson)) {
        return;
    }
    var isMultiSelectable = config.isShiftSelectable || config.isCtrlSelectable;
    var modifierKey = e.shiftKey ? config.modifierKey.shift : (e.metaKey || e.ctrlKey ? config.modifierKey.ctrl : null);

    currentRow = filterSelection(argsJson, currentRow);

    if (!(currentRow && currentRow.length)) {
        return;
    }

    if (isMultiSelectable) {
        if (modifierKey === config.modifierKey.shift) {
            return shiftClick(argsJson, currentRow);
        } else if (modifierKey === config.modifierKey.ctrl) {
            return ctrlClick(argsJson, currentRow);
        } else {
            click(argsJson, currentRow);
        }
    } else {
        click(argsJson, currentRow);
    }
}

function determineShiftClickAction (argsJson, currentRow) {
    var config = argsJson.config;
    var state = argsJson.state;
    var pIndex = __WEBPACK_IMPORTED_MODULE_0_jquery___default()(state.pastRowElected).index();
    var rIndex = __WEBPACK_IMPORTED_MODULE_0_jquery___default()(state.recentRowElected).index();
    var cIndex = currentRow.index();
    var currentSelectionDirection = getCurrentSelectionDirection(argsJson, currentRow);
    var isSelectionDirectionInverted = findIfSelectionDirectionInverted(argsJson, currentRow);
    var isRecentModifierKeyShift = state.recentModifierKey === config.modifierKey.shift;
    var isCurrentRowThePastElectedRow = state.pastRowElected === currentRow.get(0);
    var isCurrentRowOutOfBounds = false;
    var action;

    if ((currentSelectionDirection === config.directions.bottom && pIndex > rIndex && pIndex < cIndex && rIndex < cIndex) ||
        (currentSelectionDirection === config.directions.top && pIndex < rIndex && pIndex > cIndex && rIndex > cIndex)) {
        isCurrentRowOutOfBounds = true;
    }

    if (isCurrentRowOutOfBounds &&
        isSelectionDirectionInverted &&
        isRecentModifierKeyShift) {
        action = config.selectionType.toggle;
    } else if ( currentSelectionDirection === config.directions.bottom) {
        if (isRecentModifierKeyShift) {
            action = ( pIndex <= rIndex && pIndex < cIndex ) ? config.selectionType.select : config.selectionType.deselect;
        } else {
            action = ( rIndex < cIndex ) ? config.selectionType.select : config.selectionType.deselect;
        }
    } else if ( currentSelectionDirection === config.directions.top) {
        if (isRecentModifierKeyShift) {
             action = ( pIndex >= rIndex && pIndex > cIndex ) ? config.selectionType.select : config.selectionType.deselect;
        } else {
            action = ( rIndex > cIndex ) ? config.selectionType.select : config.selectionType.deselect;
        }
    }

    if (!action) {
        if (!isRowSelected(argsJson, currentRow)) {
            action = config.selectionType.select;
        }
    }
    // console.log(action)
    return action;
}

function click (argsJson, currentRow) {
    var config = argsJson.config;
    var state = argsJson.state;
    var containerEl = argsJson.containerEl;
    var newState;
    var newUi = {};
    var isMultipleRowsSelected = getSelectedRows(argsJson).length > 1;

    if (!isMultipleRowsSelected && isRowSelected(argsJson, currentRow)) {
        newUi.rowsToDeselect = currentRow;
    } else {
        newUi.rowsToSelect = currentRow;
        newUi.rowsToDeselect = getSelectedRows(argsJson).not(currentRow);
    }

    newState = computeState(argsJson, currentRow);
    update(argsJson, newState, newUi);
}

function ctrlClick (argsJson, currentRow) {
    var config = argsJson.config;
    var state = argsJson.state;
    var containerEl = argsJson.containerEl;
    var newState;
    var newUi = {};

    if (currentRow.hasClass(config.selectedRowClass)) {
        newUi.rowsToDeselect = currentRow;
    } else {
        newUi.rowsToSelect = currentRow;
    }

    newState = computeState(argsJson, currentRow, config.modifierKey.ctrl);
    update(argsJson, newState, newUi);
}

function shiftClick (argsJson, currentRow) {
    var config = argsJson.config;
    var state = argsJson.state;
    var containerEl = argsJson.containerEl;
    var newState;
    var newUi = {
        rowsToSelect: __WEBPACK_IMPORTED_MODULE_0_jquery___default()(),
        rowsToDeselect: __WEBPACK_IMPORTED_MODULE_0_jquery___default()()
    };
    var customState = {};
    var rowGroup;
    var splitRowSet;
    var isRecentModifierKeyShift = state.recentModifierKey === config.modifierKey.shift;
    var isCurrentRowThePastElectedRow = state.pastRowElected === currentRow.get(0);

    if (currentRow.get(0) === state.recentRowElected) {
        return;
    }

    rowGroup = filterSelection(argsJson, createRowGroup (argsJson, __WEBPACK_IMPORTED_MODULE_0_jquery___default()(state.recentRowElected), currentRow));

    if (!(rowGroup && rowGroup.length)) {
        return;
    }

    var action = determineShiftClickAction(argsJson, currentRow);

    if(action === config.selectionType.toggle) {
        splitRowSet = splitRowGroupByPastRowElected(argsJson, currentRow, rowGroup);
        newUi.rowsToSelect = splitRowSet.r1.filter(':not(".' + config.selectedRowClass + '")');
        newUi.rowsToDeselect = splitRowSet.r2.filter('.' + config.selectedRowClass);
        customState.pastRowElected = state.pastRowElected;
    } else {
        if(action === config.selectionType.select) {
            newUi.rowsToSelect = rowGroup.filter(':not(".' + config.selectedRowClass + '")');
        } else if(action === config.selectionType.deselect) {
            newUi.rowsToDeselect = getRecentRowElectedUpToCurrentRow(argsJson, currentRow);
        }
        if(isRecentModifierKeyShift  && !isCurrentRowThePastElectedRow) customState.pastRowElected = state.pastRowElected;
        else if (isCurrentRowThePastElectedRow) customState.pastRowElected = currentRow.get(0);
    }

    newState = computeState(argsJson, currentRow, config.modifierKey.shift, customState);
    return update(argsJson, newState, newUi);

}

function handleEvents (argsJson) {
    var config = argsJson.config;
    var state = argsJson.state;
    var containerEl = argsJson.containerEl;

    __WEBPACK_IMPORTED_MODULE_0_jquery___default()(document).on('keydown.' + config.eventNs, function(e) {
        if (containerEl.hasClass(config.containerHoverClass) && e.shiftKey || e.ctrlKey || e.metaKey) {
          containerEl.addClass(config.disableTextSelectionClass);
        }
    });

    __WEBPACK_IMPORTED_MODULE_0_jquery___default()(document).on('keyup.' + config.eventNs, function(e) {
        if (containerEl.hasClass(config.containerHoverClass)) {
            containerEl.removeClass(config.disableTextSelectionClass);
        }
    });

    containerEl.on('mouseenter.' + config.eventNs, function (e) {
        containerEl.addClass(config.containerHoverClass);
    }).on('mouseleave.' + config.eventNs, function (e) {
        containerEl.removeClass(config.containerHoverClass);
    });

    containerEl.on('selectstart.' + config.eventNs, function (e) {
        if (containerEl.hasClass(config.disableTextSelectionClass)) {
            e.preventDefault();
        }
    });

    containerEl.on('click.' + config.eventNs, config.rowIdentifier, function (e) {
        manageClick(e, argsJson,  __WEBPACK_IMPORTED_MODULE_0_jquery___default()(this));
    });

    containerEl.on(config.eventType.shiftSelectable + '.' + config.eventNs, function (e, shiftSelectable) {
        if (typeof shiftSelectable === 'boolean') {
          state.isShiftSelectable = shiftSelectable
        }
    });

    containerEl.on(config.eventType.disable + '.' + config.eventNs, function (e, disabled) {
      config.isDisabled = typeof disabled === 'boolean' ? disabled : true;
    });

    containerEl.on(config.eventType.enable + '.' + config.eventNs, function (e, enabled) {
      config.isDisabled = typeof enabled === 'boolean' ? !enabled : false;
    });

    containerEl.on(config.eventType.destroy + '.' + config.eventNs, function (e) {
        containerEl.find(config.rowIdentifier).removeClass(config.selectedRowClass);
        containerEl.off('.'+config.eventNs);
        __WEBPACK_IMPORTED_MODULE_0_jquery___default()(document).off('.'+config.eventNs);
        containerEl.attr('data-ui-selectable-row', false);
        containerEl.trigger(config.eventType.destroyed);
    });
}

function init (config, state, containerEl) {
    if (containerEl.attr('data-ui-selectable-row') !== 'true') {
        handleEvents({
            config: config,
            state: state,
            containerEl: containerEl
        });
        containerEl.attr('data-ui-selectable-row', true);
    }
}

__WEBPACK_IMPORTED_MODULE_0_jquery___default.a.fn.uiSelectableRow = function (option) {
    'use strict';
    var containerEl = __WEBPACK_IMPORTED_MODULE_0_jquery___default()(this);
    var config;
    var state = {};

    if (containerEl.length) {
      config = configure(option, containerEl);
      state = {
        pastRowElected: undefined,
        recentRowElected: undefined,
        pastDirection: undefined,
        recentDirection: undefined,
        recentModifierKey: undefined
      };

      init (config, state, containerEl);
      return containerEl;
    }
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ })
/******/ ]);