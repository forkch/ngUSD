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

import * as $ from "jquery"

declare var angular: angular.IAngularStatic;

angular.module('scenarioo.directives').directive('scBreadcrumbs', function ($routeParams, $location, $route, $compile,
                                                                            $filter, $sce, $uibModal, BreadcrumbsService,
                                                                            SharePagePopupService, SketcherLinkService) {
    const limit = 50;

    return {
        restrict: 'E',
        priority: 0,
        replace: true,
        template: require('./breadcrumbs.html'),
        link: function (scope: any) {

            scope.breadcrumbs = [];
            scope.sketcherLink = SketcherLinkService;
            scope.createComparison = createComparison;

            const breadcrumbId = $route.current.$$route.breadcrumbId;

            // Get all relevant scenarioo navigation artifacts (e.g. scenarioName, usecaseName, pageIndex, ...)
            const navParameters = getNavigationParameters();

            const navElements = BreadcrumbsService.getNavigationElements(breadcrumbId, navParameters);

            angular.forEach(navElements, function (breadcrumbItem) {

                // Create breadcrumb objects
                const isLabelTextShortened = breadcrumbItem.label.length > limit && !breadcrumbItem.isLastNavigationElement;
                const breadcrumbLabelText = getShortenedLabelText(breadcrumbItem, isLabelTextShortened);
                const breadcrumb = {
                    text: breadcrumbLabelText,
                    tooltip: breadcrumbItem.textForTooltip,
                    showTooltip: isLabelTextShortened,
                    href: '#' + breadcrumbItem.route,
                    isLast: breadcrumbItem.isLastNavigationElement
                };

                // make sure we can bind html to view
                breadcrumb.text = $sce.trustAsHtml(breadcrumb.text);
                scope.breadcrumbs.push(breadcrumb);
            });

            scope.email = {
                title: encodeURIComponent('Link to the User Scenario Documentation'),
                link: encodeURIComponent($location.absUrl())
            };

            scope.showStepLinks = function () {
                SharePagePopupService.showShareStepPopup();
            };

        }
    };

    function createComparison() {
        $uibModal.open({
            template: require('../../../manage/comparisons/createComparisonModal.html'),
            controller: 'CreateComparisonModalController',
            controllerAs: 'vm',
            windowClass: 'modal-small'
        });
    }

    function getShortenedLabelText(breadcrumbItem, isLabelTextShortened) {
        return isLabelTextShortened ? getShortenedText(breadcrumbItem.label) : breadcrumbItem.label;
    }

    function getNavigationParameters() {
        return {
            usecase: $routeParams.useCaseName,
            scenario: $routeParams.scenarioName,
            pageName: $routeParams.pageName,
            pageOccurrence: parseInt($routeParams.pageOccurrence, 10),
            stepInPageOccurrence: parseInt($routeParams.stepInPageOccurrence, 10),
            objectType: $routeParams.objectType,
            objectName: $routeParams.objectName,
            searchTerm: encodeURIComponent($('<div/>').text($routeParams.searchTerm).html())
        };
    }

    function getShortenedText(text) {
        if (text.length > limit) {
            const shortenedText = text.substr(0, limit);
            return shortenedText + '...';
        }
        return text;
    }
});
