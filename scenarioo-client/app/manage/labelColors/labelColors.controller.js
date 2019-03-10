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

angular.module('scenarioo.controllers').controller('LabelColorsController', LabelColorsController);

function LabelColorsController(LabelConfigurationsResource, LabelConfigurationsListResource) {

    var vm = this;
    vm.availableColors = [{'backgroundColor': '#e11d21', 'foregroundColor': '#FFFFFF'},
        {'backgroundColor': '#eb6420', 'foregroundColor': '#FFFFFF'},
        {'backgroundColor': '#fbca04', 'foregroundColor': '#000000'},
        {'backgroundColor': '#009800', 'foregroundColor': '#FFFFFF'},
        {'backgroundColor': '#006b75', 'foregroundColor': '#FFFFFF'},
        {'backgroundColor': '#207de5', 'foregroundColor': '#FFFFFF'},
        {'backgroundColor': '#0052cc', 'foregroundColor': '#FFFFFF'},
        {'backgroundColor': '#5319e7', 'foregroundColor': '#FFFFFF'}];
    vm.labelConfigurations = [];
    vm.colorMissing = [];
    vm.successfullyUpdatedLabelConfigurations = false;
    vm.deleteEntry = deleteEntry;
    vm.labelNameChanged = labelNameChanged;
    vm.reset = reset;
    vm.save = save;
    vm.selectColor = selectColor;

    activate();

    function activate() {
        loadLabelConfigurations();
    }

    function createEmptyLabelConfiguration() {
        return {'name': '', 'backgroundColor': '', 'foregroundColor': ''};
    }

    function deleteEntry(labelName) {
        if (labelName !== '') {
            var index;
            for (index = 0; index < vm.labelConfigurations.length; index++) {
                var labelConfiguration = vm.labelConfigurations[index];
                if (labelConfiguration.name === labelName) {
                    vm.labelConfigurations.splice(index, 1);
                    break;
                }
            }
        }
    }

    function labelNameChanged() {
        var labelName = vm.labelConfigurations[vm.labelConfigurations.length - 1].name;
        if (labelName !== '') {
            vm.labelConfigurations.push(createEmptyLabelConfiguration());
        }
    }

    function reset() {
        loadLabelConfigurations();
    }

    function save() {
        vm.colorMissing = [];
        var labelConfigurationsAsMap = {};
        var everythingIsValid = true;
        angular.forEach(vm.labelConfigurations, function (value, key) {
            if (value.name !== '') {
                if (!value.backgroundColor) {
                    everythingIsValid = false;
                    vm.colorMissing[key] = true;
                }
                labelConfigurationsAsMap[value.name] = {
                    'backgroundColor': value.backgroundColor,
                    'foregroundColor': value.foregroundColor
                };
            }
        });

        if (everythingIsValid) {
            LabelConfigurationsResource.save(labelConfigurationsAsMap)
                .subscribe(function () {
                    vm.successfullyUpdatedLabelConfigurations = true;
                });
        }
    }

    function loadLabelConfigurations() {
        LabelConfigurationsListResource.query()
            .subscribe(function (labelConfigurations) {
                labelConfigurations.push(createEmptyLabelConfiguration());
                vm.labelConfigurations = labelConfigurations;
            });
    }

    function selectColor(labelConfiguration, color) {
        labelConfiguration.backgroundColor = color.backgroundColor;
        labelConfiguration.foregroundColor = color.foregroundColor;
    }
}

