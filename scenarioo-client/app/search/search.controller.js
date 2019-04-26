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

import {_throw, catchError} from 'rxjs';

angular.module('scenarioo.controllers').controller('SearchController', function ($routeParams, $location, FullTextSearchService,
                                                                                 SelectedBranchAndBuildService, ReferenceTreeNavigationService, LocalStorageService) {
    const LOCAL_STORAGE_KEY_INCLUDE_HTML = 'scenarioo-searchIncludeHtml';

    const vm = this;

    vm.results = {resultSet: []};
    vm.errorMessage = '';

    // to also support slashes in search terms in angular routes we have to encode twice and decode manually, see https://github.com/angular/angular.js/issues/10479
    vm.searchTerm = decodeURIComponent($routeParams.searchTerm);

    vm.includeHtml = LocalStorageService.get(LOCAL_STORAGE_KEY_INCLUDE_HTML) || 'false';
    vm.treemodel = [];
    vm.showSearchFailed = false;
    vm.goToRelatedView = goToRelatedView;
    vm.changeIncludeHtml = changeIncludeHtml;

    doSearch();

    function doSearch() {
        const selected = SelectedBranchAndBuildService.selected();

        FullTextSearchService
            .search(
                {
                    buildName: selected.build,
                    branchName: selected.branch
                },
                vm.searchTerm,
                vm.includeHtml
            )
            .pipe(catchError(e => {
                vm.showSearchFailed = true;
                return _throw(e);
            }))
            .subscribe(response => {
                if (response.errorMessage) {
                    vm.showSearchFailed = true;
                    vm.errorMessage = response.errorMessage;
                } else {
                    vm.results.resultSet = response.searchTree.results;
                    vm.hits = response.searchTree.hits;
                    vm.totalHits = response.searchTree.totalHits;
                }
            })


    }

    function changeIncludeHtml() {
        LocalStorageService.set(LOCAL_STORAGE_KEY_INCLUDE_HTML, vm.includeHtml);
        doSearch();
    }

    // Entry point when a tree entry is clicked
    function goToRelatedView(nodeElement) {
        $location.path(ReferenceTreeNavigationService.goToRelatedView(nodeElement, vm.treemodel));
    }
});
