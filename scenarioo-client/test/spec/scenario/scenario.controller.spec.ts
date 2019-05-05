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

'use strict';

import {of} from 'rxjs';
import {IConfiguration, IUseCaseScenarios} from '../../../app/generated-types/backend-types';

declare var angular: angular.IAngularStatic;

describe('ScenarioController', () => {

    let $scope, $httpBackend, $routeParams, ConfigService, TestData,
        ScenarioController, RelatedIssueResource, SelectedBranchAndBuildService;

    const ConfigResourceMock = {
        get: () => of(angular.copy(TestData.CONFIG))
    };
    const LabelConfigurationsResourceMock = {
        query: () => of({}),
    };
    const ScenarioResourceMock = {
        get: () => of(TestData.SCENARIO),
        getUseCaseScenarios: () => of<IUseCaseScenarios>({
            useCase: TestData.SCENARIO.useCase,
            scenarios: [TestData.SCENARIO.scenario]
        })
    };


    beforeEach(angular.mock.module('scenarioo.controllers'));

    beforeEach(angular.mock.module('scenarioo.services', ($provide) => {
        $provide.value("ConfigResource", ConfigResourceMock);
        $provide.value("LabelConfigurationsResource", LabelConfigurationsResourceMock);
        $provide.value("ScenarioResource", ScenarioResourceMock);
    }));


    beforeEach(inject(($rootScope, $controller, _$httpBackend_, _$routeParams_,
                       _TestData_, LocalStorageService, _RelatedIssueResource_,
                       _SelectedBranchAndBuildService_, _ConfigService_,
    ) => {
        $scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        $routeParams = _$routeParams_;
        TestData = _TestData_;
        RelatedIssueResource = _RelatedIssueResource_;
        ConfigService = _ConfigService_;

        SelectedBranchAndBuildService = _SelectedBranchAndBuildService_;

        $routeParams.useCaseName = 'SearchUseCase';
        $routeParams.scenarioName = 'NotFoundScenario';

        LocalStorageService.clearAll();

        ScenarioController = $controller('ScenarioController', {
            $scope: $scope
        });

        spyOn(RelatedIssueResource, 'query').and.callFake(queryRelatedIssuesFake());
    }));

    it('clears search field when resetSearchField() is called', () => {
        ScenarioController.searchFieldText = 'test';
        ScenarioController.resetSearchField();
        expect(ScenarioController.searchFieldText).toBe('');
    });

    it('creates the correct link to a step', () => {
        const link = ScenarioController.getLinkToStep('searchPage.html', 2, 0);
        expect(link).toBe('#/step/SearchUseCase/NotFoundScenario/searchPage.html/2/0');
    });

    it('creates empty image link, if branch and build selection is unknown', () => {
        const imageLink = ScenarioController.getScreenShotUrl('img.jpg');
        expect(imageLink).toBeUndefined();
    });

    it('creates the correct image link, if selected branch and build is known', () => {
        givenScenarioIsLoaded();

        const imageLink = ScenarioController.getScreenShotUrl('img.jpg');
        expect(imageLink).toBe('rest/branch/trunk/build/current/usecase/SearchUseCase/scenario/NotFoundScenario/image/img.jpg');
    });

    it('does not show all steps of a page by default', () => {
        expect(ScenarioController.showAllStepsForPage(0)).toBeFalsy();
        expect(ScenarioController.showAllStepsForPage(1)).toBeFalsy();
        expect(ScenarioController.showAllStepsForPage(2)).toBeFalsy();
    });

    it('can toggle the showPageForAllSteps property', () => {
        ScenarioController.toggleShowAllStepsForPage(5);
        expect(ScenarioController.showAllStepsForPage(5)).toBeTruthy();
        ScenarioController.toggleShowAllStepsForPage(5);
        expect(ScenarioController.showAllStepsForPage(5)).toBeFalsy();
    });

    it('hides the "expand all" button, if all expandable pages are already expanded', () => {
        givenScenarioIsLoaded();

        ScenarioController.toggleShowAllStepsForPage(0);
        ScenarioController.toggleShowAllStepsForPage(1);

        expect(ScenarioController.isExpandAllPossible()).toBeFalsy();
    });

    it('shows the "expand all" button, if at least one expandable page is collapsed', () => {
        givenScenarioIsLoaded();

        expect(ScenarioController.isExpandAllPossible()).toBeTruthy();
    });


    it('hides the "collapse all" button, if all pages are collapsed already', () => {
        givenScenarioIsLoaded();

        // all pages are collapsed by default

        expect(ScenarioController.isCollapseAllPossible()).toBeFalsy();
    });

    it('shows the "collapse all" button, if at least one collapsable page is expanded', () => {
        givenScenarioIsLoaded();

        ScenarioController.toggleShowAllStepsForPage(1);

        expect(ScenarioController.isCollapseAllPossible()).toBeTruthy();
    });

    it('collapses all pages if the user clicks "collapse all"', () => {
        ScenarioController.toggleShowAllStepsForPage(2);
        ScenarioController.toggleShowAllStepsForPage(5);
        ScenarioController.collapseAll();
        expect(ScenarioController.showAllStepsForPage(2)).toBeFalsy();
        expect(ScenarioController.showAllStepsForPage(5)).toBeFalsy();
    });


    it('expands all pages if the user clicks "expand all"', () => {
        givenScenarioIsLoaded();

        ScenarioController.expandAll();
        expectAllPagesAreExpanded();
    });

    it('expands all pages, if this is the default set in the config', () => {
        ConfigService.getRaw = true;

        givenScenarioIsLoaded(TestData.CONFIG_PAGES_EXPANDED);

        expectAllPagesAreExpanded();
    });

    function givenScenarioIsLoaded(config?: IConfiguration) {
        if (angular.isUndefined(config)) {
            config = TestData.CONFIG;
        }
        spyOn(ConfigResourceMock, "get").and.returnValue(of(config));
        spyOn(ScenarioResourceMock, "getUseCaseScenarios").and.returnValue(of(TestData.SCENARIO));

        ConfigService.load();
        $scope.$apply();

    }

    function expectAllPagesAreExpanded() {
        expect(ScenarioController.showAllStepsForPage(0)).toBeTruthy();
        expect(ScenarioController.showAllStepsForPage(1)).toBeTruthy();
        expect(ScenarioController.showAllStepsForPage(2)).toBeFalsy(); // Scenario has only 2 pages
    }

    function queryRelatedIssuesFake() {
        const DATA = {
            0:
                {
                    id: '1',
                    name: 'fakeTestingIssue',
                    firstScenarioSketchId: '1'
                }
        };

        return (params, onSuccess) => {
            onSuccess(DATA);
        };
    }

});
