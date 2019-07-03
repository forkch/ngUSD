/* scenarioo-client
 * Copyright (C) 2014, scenarioo.org Development Team
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

angular
    .module('scenarioo.directives')
    .component('scDiffInfoIcon', {
        bindings: {
            diffInfo: '<',
            elementType: '@',
            childElementType: '@',
        },
        controller: diffInfoIconController,
        template: require('./diffInfoIcon.html'),
    });

function diffInfoIconController($scope, $sce, $filter) {
    const vm = this;
    vm.changedPercentage = '';
    vm.addedPercentage = '';
    vm.removedPercentage = '';
    vm.unchangedPercentage = '';
    vm.displayPercentageChanged = displayPercentageChanged;

    this.$onChanges = (changes) => {
        if (changes.diffInfo) {
            initValues(vm);
        }
    };

    // Avoids showing "NaN" while the diffInfo is being loaded
    function displayPercentageChanged() {
        if (!vm.diffInfo || vm.diffInfo.isAdded || vm.diffInfo.isRemoved) {
            return false;
        }
        return true;
    }

    function initValues(vm) {
        if (vm.diffInfo) {
            vm.changedPercentage = 0 + '%';
            vm.addedPercentage = 0 + '%';
            vm.removedPercentage = 0 + '%';
            vm.unchangedPercentage = 0 + '%';
            const roundedChangeRate = Math.ceil(vm.diffInfo.changeRate);

            if (vm.diffInfo.isAdded) {
                vm.addedPercentage = 100 + '%';
                vm.infoText = $sce.trustAsHtml('This ' + vm.elementType + ' has been added');
            } else if (vm.diffInfo.isRemoved) {
                vm.removedPercentage = 100 + '%';
                vm.infoText = $sce.trustAsHtml('This ' + vm.elementType + ' has been removed');
            } else if (roundedChangeRate === 0) {
                vm.unchangedPercentage = 100 + '%';
                vm.infoText = $sce.trustAsHtml('This ' + vm.elementType + ' has no changes');
            } else {
                const totalChangedChildElements = vm.diffInfo.added + vm.diffInfo.removed + vm.diffInfo.changed;
                if (totalChangedChildElements && totalChangedChildElements > 0) {
                    const addedPercentage = (vm.diffInfo.added / totalChangedChildElements) * roundedChangeRate;
                    const removedPercentage = (vm.diffInfo.removed / totalChangedChildElements) * roundedChangeRate;
                    const changedPercentage = roundedChangeRate - addedPercentage - removedPercentage;

                    vm.changedPercentage = changedPercentage + '%';
                    vm.addedPercentage = addedPercentage + '%';
                    vm.removedPercentage = removedPercentage + '%';
                    vm.unchangedPercentage = 100 - changedPercentage - addedPercentage - removedPercentage + '%';
                }

                const changedInfoText = buildChangedInfoText(vm.diffInfo, vm.elementType, vm.childElementType);
                vm.infoText = $sce.trustAsHtml(changedInfoText);
            }
        }
    }

    function buildChangedInfoText(diffInfo, elementType, childElementType) {
        let changedInfoText = $filter('scRoundUp')(diffInfo.changeRate) + '% of this ' + elementType + ' has changed:';
        if (diffInfo.changed > 0) {
            changedInfoText += '<br />';
            changedInfoText += '<span class="square changed"></span>';
            changedInfoText += diffInfo.changed + ' ' + childElementType + (diffInfo.changed === 1 ? '' : 's') + ' changed';
        }
        if (diffInfo.added > 0) {
            changedInfoText += '<br />';
            changedInfoText += '<span class="square added"></span>';
            changedInfoText += diffInfo.added + ' ' + childElementType + (diffInfo.added === 1 ? '' : 's') + ' added';
        }
        if (diffInfo.removed > 0) {
            changedInfoText += '<br />';
            changedInfoText += '<span class="square removed"></span>';
            changedInfoText += diffInfo.removed + ' ' + childElementType + (diffInfo.removed === 1 ? '' : 's') + ' removed';
        }
        return changedInfoText;
    }
}
