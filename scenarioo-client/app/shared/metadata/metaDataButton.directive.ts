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

angular.module('scenarioo.directives').directive('scMetaDataButton', ($window, LocalStorageService, GlobalHotkeysService) => {

    const STEP_METADATA_VISIBLE = 'scenarioo-metadataVisible-';
    function initMetadataVisibleFromLocalStorage(scope, key) {
        const metadataVisible = LocalStorageService.get(STEP_METADATA_VISIBLE + key);
        if (metadataVisible === 'true') {
            scope.linkingVariable = true;
        } else if (metadataVisible === 'false') {
            scope.linkingVariable = false;
        } else {
            // default
            scope.linkingVariable = $window.innerWidth > 800;
        }
    }

    return {
        restrict: 'E',
        scope: {
            linkingVariable: '=',
            localStorageKey: '@',
        },
        template: require('./metaDataButton.html'),
        link(scope: any) {
            GlobalHotkeysService.registerGlobalHotkey('d', () => {
                scope.toggleShowingMetadata();
            });
        },
        controller($scope, $route) {
            initMetadataVisibleFromLocalStorage($scope, $scope.localStorageKey);
            $scope.toggleShowingMetadata = () => {
                $scope.linkingVariable = !$scope.linkingVariable;
                LocalStorageService.set(STEP_METADATA_VISIBLE + $scope.localStorageKey, '' + $scope.linkingVariable);
                //reload the page to ensure that highlighted changes are properly aligned.
                $route.reload();
            };
        },
    };

});
