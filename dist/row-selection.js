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
        selectableRow: 'data-ui-selectable-row',
        shiftSelectable: 'data-shift-selectable',
        ctrlSelectable: 'data-ctrl-selectable',
        toggleOnClick: 'data-toggle-on-click',
        selectedRowClass: 'data-selected-class'
    },
    isDisabled: false,
    isShiftSelectable: true,
    isCtrlSelectable: true,
    toggleOnClick: false,
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
    toggleOnClick: containerEl.attr(attr.toggleOnClick),
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
    newState.recentModifierKey = modifierKey ? modifierKey : null;
    return customState !== undefined ? __WEBPACK_IMPORTED_MODULE_0_jquery___default.a.extend(newState, customState) : newState;
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

function createRowGroup (argsJson, row1, row2) {
    var containerEl = argsJson.containerEl;
    var row1Index = row1.index();
    var row2Index = row2.index();
    if (row1Index === row2Index || row1Index === -1 || row2Index === -1) {
        return row1.length ? row1 : row2.length ? row2 : null;
    } else if (row1.index() > row2.index()) {
        return row2.add(containerEl.find(row2).nextUntil(row1)).add(row1);
    } else {
        return row1.add(containerEl.find(row1).nextUntil(row2)).add(row2);
    }
}

function splitRowGroupByPastRowElected (argsJson, currentRow, rowGroup) {
    var state = argsJson.state;
    var rIndex = __WEBPACK_IMPORTED_MODULE_0_jquery___default()(state.recentRowElected).index();
    var cIndex = currentRow.index();
    var firstRow = rowGroup[0];
    var lastRow = rowGroup[rowGroup.length-1];
    var rowGroup1;
    var rowGroup2;
    if (rIndex > cIndex) {
        rowGroup1 = __WEBPACK_IMPORTED_MODULE_0_jquery___default()().add(firstRow).add(__WEBPACK_IMPORTED_MODULE_0_jquery___default()(firstRow).nextUntil(state.pastRowElected))
        rowGroup2 = __WEBPACK_IMPORTED_MODULE_0_jquery___default()().add(lastRow).add(__WEBPACK_IMPORTED_MODULE_0_jquery___default()(lastRow).prevUntil(state.pastRowElected))
    } else {
        rowGroup1 = __WEBPACK_IMPORTED_MODULE_0_jquery___default()().add(lastRow).add(__WEBPACK_IMPORTED_MODULE_0_jquery___default()(lastRow).prevUntil(state.pastRowElected))
        rowGroup2 = __WEBPACK_IMPORTED_MODULE_0_jquery___default()().add(firstRow).add(__WEBPACK_IMPORTED_MODULE_0_jquery___default()(firstRow).nextUntil(state.pastRowElected))
    }
    return {
        group1: rowGroup1,
        group2: rowGroup2
    }
}

function getCurrentSelectionDirection (argsJson, currentRow) {
    var config = argsJson.config;
    var state = argsJson.state;
    var rIndex = __WEBPACK_IMPORTED_MODULE_0_jquery___default()(state.recentRowElected).index();
    var cIndex = currentRow.index();
    if (rIndex === cIndex) {
        return null;
    } else if (state.recentRowElected) {
        return rIndex > cIndex ? config.directions.top : config.directions.bottom;
    }
}

function getRecentRowElectedUpToCurrentRow (argsJson, currentRow) {
    var config = argsJson.config;
    var state = argsJson.state;
    var currentSelectionDirection = getCurrentSelectionDirection(argsJson, currentRow);
    var rows = __WEBPACK_IMPORTED_MODULE_0_jquery___default()();
    if (currentRow.get(0) === state.recentRowElected) {
        rows = currentRow;
    } else if (currentSelectionDirection === config.directions.top) {
        rows = rows.add(state.recentRowElected).add(__WEBPACK_IMPORTED_MODULE_0_jquery___default()(state.recentRowElected).prevUntil(currentRow.get(0)));
        if (config.toggleOnClick) {
            rows = rows.add(currentRow.get(0))
        }
    } else if (currentSelectionDirection === config.directions.bottom) {
        rows = rows.add(state.recentRowElected).add(currentRow.prevUntil(state.recentRowElected));
        if (config.toggleOnClick) {
            rows = rows.add(currentRow.get(0))
        }
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
    debugger;
    if (config.isDisabled || !isTargetClickable(e, argsJson)) {
        return;
    }
    var modifierKey = e.shiftKey ? config.modifierKey.shift : (e.metaKey || e.ctrlKey ? config.modifierKey.ctrl : null);

    currentRow = config.toggleOnClick === false ? filterSelection(argsJson, currentRow) : currentRow;

    if (!(currentRow && currentRow.length)) {
        return;
    }

    if (config.isShiftSelectable && modifierKey === config.modifierKey.shift) {
        shiftClick(argsJson, currentRow);
    } else if (config.isCtrlSelectable && modifierKey === config.modifierKey.ctrl) {
        ctrlClick(argsJson, currentRow);
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
    var towardsBottom = currentSelectionDirection === config.directions.bottom;
    var towardsTop = currentSelectionDirection === config.directions.top;
    var isRecentModifierKeyShift = state.recentModifierKey === config.modifierKey.shift;
    var isCurrentRowThePastElectedRow = state.pastRowElected === currentRow.get(0);
    var isCurrentRowOutOfBounds = false;
    var action;

    if ((towardsBottom && pIndex > rIndex && pIndex < cIndex && rIndex < cIndex) ||
        (towardsTop && pIndex < rIndex && pIndex > cIndex && rIndex > cIndex)) {
        isCurrentRowOutOfBounds = true;
    }

    if (isCurrentRowOutOfBounds &&
        isRecentModifierKeyShift) {
        action = config.selectionType.toggle;
    } else if (towardsBottom) {
        if (isRecentModifierKeyShift) {
            action = ( pIndex <= rIndex && pIndex < cIndex ) ? config.selectionType.select : config.selectionType.deselect;
        } else {
            action = ( rIndex < cIndex ) ? config.selectionType.select : config.selectionType.deselect;
        }
    } else if (towardsTop) {
        if (isRecentModifierKeyShift) {
             action = ( pIndex >= rIndex && pIndex > cIndex ) ? config.selectionType.select : config.selectionType.deselect;
        } else {
            action = ( rIndex > cIndex ) ? config.selectionType.select : config.selectionType.deselect;
        }
    }

    if (!action) {
        if (!isRowSelected(argsJson, currentRow)) {
            action = config.selectionType.select;
        } else {
            action = config.selectionType.deselect;
        }
    }
    // console.log(action);
    return action;
}

function click (argsJson, currentRow) {
    var config = argsJson.config;
    var state = argsJson.state;
    var containerEl = argsJson.containerEl;
    var newState;
    var newUi = {};
    var isMultipleRowsSelected = getSelectedRows(argsJson).length > 1;
    var isCurrentRowSelected = isRowSelected(argsJson, currentRow);

    if (config.toggleOnClick) {
        if (isCurrentRowSelected) {
            newUi.rowsToDeselect = currentRow;
        } else {
            newUi.rowsToSelect = currentRow;
        }
    } else if (!isMultipleRowsSelected && isCurrentRowSelected) {
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
    var isCurrentRowSelected = isRowSelected(argsJson, currentRow);

    if (isCurrentRowSelected) {
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
    var isCurrentRowTheRecentElectedRow = state.recentRowElected === currentRow.get(0);

    if (!config.toggleOnClick && isCurrentRowTheRecentElectedRow) {
        return;
    }

    rowGroup = createRowGroup (argsJson, __WEBPACK_IMPORTED_MODULE_0_jquery___default()(state.recentRowElected), currentRow);
    rowGroup = config.toggleOnClick === false ? filterSelection(argsJson, rowGroup) : rowGroup;

    if (!(rowGroup && rowGroup.length)) {
        return;
    }

    var action = determineShiftClickAction(argsJson, currentRow);

    if(action === config.selectionType.toggle) {
        splitRowSet = splitRowGroupByPastRowElected(argsJson, currentRow, rowGroup);
        newUi.rowsToSelect = splitRowSet.group1.filter(':not(".' + config.selectedRowClass + '")');
        newUi.rowsToDeselect = splitRowSet.group2.filter('.' + config.selectedRowClass);
        customState.pastRowElected = state.pastRowElected;
    } else {
        if(action === config.selectionType.select) {
            newUi.rowsToSelect = rowGroup.filter(':not(".' + config.selectedRowClass + '")');
            newUi.rowsToSelect = config.toggleOnClick === false ? newUi.rowsToSelect : newUi.rowsToSelect.add(currentRow);
        } else if(action === config.selectionType.deselect) {
            newUi.rowsToDeselect = getRecentRowElectedUpToCurrentRow(argsJson, currentRow);
        }
        if (isRecentModifierKeyShift  && !isCurrentRowThePastElectedRow) customState.pastRowElected = state.pastRowElected;
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
        if (!config.isDisabled &&  (containerEl.hasClass(config.containerHoverClass) && (e.shiftKey || e.ctrlKey || e.metaKey))) {
          containerEl.addClass(config.disableTextSelectionClass);
        }
    });

    __WEBPACK_IMPORTED_MODULE_0_jquery___default()(document).on('keyup.' + config.eventNs, function(e) {
        if (!config.isDisabled && containerEl.hasClass(config.containerHoverClass)) {
            containerEl.removeClass(config.disableTextSelectionClass);
        }
    });

    containerEl.on('mouseenter.' + config.eventNs, function (e) {
        if (!config.isDisabled) {
            containerEl.addClass(config.containerHoverClass);
        }
    }).on('mouseleave.' + config.eventNs, function (e) {
        if (!config.isDisabled) {
            containerEl.removeClass(config.containerHoverClass);
        }
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
          config.isShiftSelectable = shiftSelectable
        }
    });

    containerEl.on(config.eventType.disable + '.' + config.eventNs, function (e, disabled) {
      config.isDisabled = typeof disabled === 'boolean' ? disabled : true;
    });

    containerEl.on(config.eventType.enable + '.' + config.eventNs, function (e, enabled) {
      config.isDisabled = typeof enabled === 'boolean' ? !enabled : false;
    });

    containerEl.on(config.eventType.destroy + '.' + config.eventNs, function (e) {
        __WEBPACK_IMPORTED_MODULE_0_jquery___default()(document).off('.'+config.eventNs);
        containerEl.removeClass(config.containerHoverClass + ' ' + config.disableTextSelectionClass)
                    .off('.'+config.eventNs)
                    .find(config.rowIdentifier)
                    .removeClass(config.selectedRowClass);

        containerEl.attr(config.dataAttr.selectableRow, false)
                    .trigger(config.eventType.destroyed);
    });
}

function init (config, state, containerEl) {
    if (containerEl.attr(config.dataAttr.selectableRow) !== 'true') {
        handleEvents({
            config: config,
            state: state,
            containerEl: containerEl
        });
        containerEl.attr(config.dataAttr.selectableRow, true);
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