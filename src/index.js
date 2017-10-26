import $ from 'jquery';

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
    modifierKey: {
        shift: 'shift',
        ctrl: 'ctrl'
    },
    directions: {
        top: 'TOP',
        bottom: 'BOTTOM'
    }
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
    var mashedConfig = $.extend( {}, defaults, option);
    var mashedConfig = $.extend( mashedConfig, dataAttributeBasedConfig(mashedConfig, containerEl))
    var mashedConfig = $.extend( mashedConfig, formatConfig(mashedConfig));
    return mashedConfig;
}

function updateState (argsJson, newState) {
    $.extend(argsJson.state, newState);
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
    var containerEl = argsJson.containerEl;
    var config = argsJson.config;
    updateState(argsJson, newState);
    updateUi(argsJson, newUi);
    containerEl.trigger(config.eventType.toggleSelection,
                        [ $(newUi.rowsToSelect), $(newUi.rowsToDeselect), getSelectedRows(argsJson) ]);
}

function computeState (argsJson, currentRow, modifierKey) {
    var config = argsJson.config;
    var state = argsJson.state;
    var newState = {};
    var rIndex = $(state.recentRowElected).index();
    var cIndex = currentRow.index();
    newState.recentRowElected = currentRow.get(0);
    newState.pastRowElected = state.pastRowElected ? state.recentRowElected : currentRow.get(0);
    if (state.pastRowElected) {
        if (modifierKey === state.recentModifierKey) {
            newState.pastRowElected = state.pastRowElected;
        } else {
            newState.pastRowElected = state.recentRowElected;
        }
    } else {
        newState.pastRowElected = currentRow.get(0);
    }
    if (state.recentRowElected) {
        newState.recentDirection = rIndex > cIndex ? config.directions.top : config.directions.bottom;
        newState.pastDirection = state.recentDirection ? state.recentDirection : newState.recentDirection;
    }
    newState.recentModifierKey = modifierKey;
    return newState;
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
    var rIndex = $(state.recentRowElected).index();
    var cIndex = currentRow.index();
    var firstRow = rowGroup[0];
    var lastRow = rowGroup[rowGroup.length-1];
    var r1;
    var r2;

    if (rIndex > cIndex) {
        r1 = $().add(firstRow).add($(firstRow).nextUntil(state.pastRowElected))
        r2 = $().add(lastRow).add($(lastRow).prevUntil(state.pastRowElected))
    } else {
        r1 = $().add(lastRow).add($(lastRow).prevUntil(state.pastRowElected))
        r2 = $().add(firstRow).add($(firstRow).nextUntil(state.pastRowElected))
    }
    return {
        r1: r1,
        r2: r2
    }
}

function getCurrentSelectionDirection (argsJson, currentRow) {
    var config = argsJson.config;
    var state = argsJson.state;
    var rIndex = $(state.recentRowElected).index();
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

function doesCurrentRowSelectionLieWithInPastElectedRow (argsJson, currentRow) {
    var config = argsJson.config;
    var state = argsJson.state;
    var currentSelectionDirection = getCurrentSelectionDirection(argsJson, currentRow);
    var pIndex = $(state.pastRowElected).index();
    var cIndex = currentRow.index();
    if (currentSelectionDirection === config.directions.top) {
        return pIndex < cIndex
    } else if (currentSelectionDirection === config.directions.bottom) {
        return cIndex < pIndex;
    }
}

function getRecentRowElectedUpToCurrentRow (argsJson, currentRow) {
    var config = argsJson.config;
    var state = argsJson.state;
    var currentSelectionDirection = getCurrentSelectionDirection(argsJson, currentRow);
    var rows = $();
    if (currentSelectionDirection === config.directions.top) {
        rows = rows.add(state.recentRowElected).add($(state.recentRowElected).prevUntil(currentRow.get(0)));
    } else if (currentSelectionDirection === config.directions.bottom) {
        rows = rows.add(state.recentRowElected).add(currentRow.prevUntil(state.recentRowElected));
    }
    return rows;
}

function isCurrentRowBetweenRecentAndPastElectedRow (argsJson, currentRow) {
    var state = argsJson.state;
    var rIndex = $(state.recentRowElected).index();
    var pIndex = $(state.pastRowElected).index();
    var cIndex = currentRow.index();

    if (state.recentRowElected && state.pastRowElected) {
        return Math.min(rIndex, pIndex) >= cIndex >= Math.max(rIndex, pIndex);
    }
}

function isTargetClickable (e, argsJson) {
    var config = argsJson.config;
    var clickedAllowed = true;
    if (config.selectRowIfTargetIs.length > 0) {
        clickedAllowed = $(e.target).is(config.selectRowIfTargetIs.join(" ,"));
    } else if (config.selectRowIfTargetIsNot.length > 0) {
        clickedAllowed = !$(e.target).is(config.selectRowIfTargetIsNot.join(" ,"));
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
        rowsToSelect: $(),
        rowsToDeselect: $()
    };
    var isSelectionDirectionInverted = findIfSelectionDirectionInverted(argsJson, currentRow);
    var isCurrentRowBoundToRecentAndPastElectedRow = isCurrentRowBetweenRecentAndPastElectedRow(argsJson, currentRow);
    var isCurrentRowBoundToPastElectedRow = doesCurrentRowSelectionLieWithInPastElectedRow(argsJson, currentRow)
    var isCurrentRowThePastElectedRow = state.pastRowElected === currentRow.get(0);
    var rowGroup;
    var splitRowSet = {};
    var isAllRowsInRowGroupSelected;

    if (currentRow.get(0) === state.recentRowElected) {
        return;
    }

    rowGroup = filterSelection(argsJson, createRowGroup (argsJson, $(state.recentRowElected), currentRow));

    if (!(rowGroup && rowGroup.length)) {
        return;
    }
    if (isSelectionDirectionInverted &&
        !isCurrentRowBoundToRecentAndPastElectedRow &&
        !isCurrentRowBoundToPastElectedRow &&
        state.recentModifierKey === config.modifierKey.shift) {
        splitRowSet = splitRowGroupByPastRowElected(argsJson, currentRow, rowGroup);
        newUi.rowsToSelect = splitRowSet.r1.filter(':not(".' + config.selectedRowClass + '")');
        newUi.rowsToDeselect = splitRowSet.r2.filter('.' + config.selectedRowClass)
    } else if (!isCurrentRowBoundToRecentAndPastElectedRow &&
               !isCurrentRowBoundToPastElectedRow) {
        newUi.rowsToSelect = rowGroup.filter(':not(".' + config.selectedRowClass + '")');
    } else if (!isCurrentRowBoundToRecentAndPastElectedRow &&
                isCurrentRowBoundToPastElectedRow ){
        newUi.rowsToDeselect = getRecentRowElectedUpToCurrentRow(argsJson, currentRow);
    }

    newState = computeState(argsJson, currentRow, config.modifierKey.shift);
    return update(argsJson, newState, newUi);

}

function handleEvents (argsJson) {
    var config = argsJson.config;
    var state = argsJson.state;
    var containerEl = argsJson.containerEl;

    $(document).on('keydown.' + config.eventNs, function(e) {
        if (containerEl.hasClass(config.containerHoverClass) && e.shiftKey || e.ctrlKey || e.metaKey) {
          containerEl.addClass(config.disableTextSelectionClass);
        }
    });

    $(document).on('keyup.' + config.eventNs, function(e) {
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
        manageClick(e, argsJson,  $(this));
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
        $(document).off('.'+config.eventNs);
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

$.fn.uiSelectableRow = function (option) {
    'use strict';
    var containerEl = $(this);
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
