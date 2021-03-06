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

declare var angular: angular.IAngularStatic;

// Migration - do not invest much time in old tests
xdescribe('GeneralSettingsController', () => {

    let $rootScope, $controller, ConfigurationService, $httpBackend, $scope, ConfigCtrl, TestData;

    const BranchResourceMock = {
        query: () => {
        }
    };
    const SearchEngineStatusMock = {
        isSearchEngineRunning: () => {
        }
    };
    const ApplicationStatusMock = {
        getApplicationStatus: () => {
        }
    };
    const ConfigResourceMock = {
        get: () => {
        }
    };
    const ConfigurationServiceMock = {
        updateConfigurationCalled: false,
        getRawCopy: () => TestData.CONFIG,
        updateConfiguration: () => {
            ConfigurationServiceMock.updateConfigurationCalled = true;
            return of();
        }
    };


    beforeEach(angular.mock.module('scenarioo.controllers'));
    beforeEach(angular.mock.module('scenarioo.services', ($provide) => {
        // TODO: Remove after AngularJS Migration.

        $provide.value('BranchesResource', BranchResourceMock);

        $provide.value('SearchEngineStatusService', SearchEngineStatusMock);
        $provide.value('ApplicationStatusService', ApplicationStatusMock);
        $provide.value('ConfigResource', ConfigResourceMock);
        $provide.value('ConfigurationService', ConfigurationServiceMock);
    }));

    beforeEach(inject((_$rootScope_, _$controller_,
                       _SearchEngineStatusService_,
                       _ApplicationStatusService_,
                       _ConfigurationService_, _$httpBackend_, _TestData_) => {
            $rootScope = _$rootScope_;
            $controller = _$controller_;
            ConfigurationService = _ConfigurationService_;
            $httpBackend = _$httpBackend_;
            TestData = _TestData_;

            spyOn(BranchResourceMock, 'query')
                .and.returnValue(of(TestData.BRANCHES));
            spyOn(SearchEngineStatusMock, 'isSearchEngineRunning')
                .and.returnValue(of({'searchEngineRunning': false}));
            spyOn(ApplicationStatusMock, 'getApplicationStatus')
                .and.returnValue(of({
                'searchEngineRunning': false,
                'version': TestData.VERSION,
                'configuration': angular.copy(TestData.CONFIG)
            }));

            spyOn(ConfigResourceMock, 'get')
                .and.returnValue(of(angular.copy(TestData.CONFIG)));

            $httpBackend.whenGET('rest/version').respond(TestData.VERSION);
            $httpBackend.whenGET('rest/branch/branch_123/build/build_123/searchEngine').respond(404, false);

            $scope = $rootScope.$new();
            ConfigCtrl = $controller('GeneralSettingsController', {
                $scope: $scope,
                ConfigurationService: ConfigurationService
            });
        }
    ))
    ;

    describe('when page is loaded', () => {
        it('loads and displays the config from the server', () => {
            expect(ConfigCtrl).toBeDefined();

            expect(ConfigCtrl.configuration).toEqual(TestData.CONFIG);
        });

        it('loads all branches and builds', () => {
            expect(ConfigCtrl.branches.length).toEqual(3);
            expect(ConfigCtrl.configuredBranch.branch.name).toEqual('trunk');
        });
    });

    describe('when reset button is clicked', () =>
        it('resets the config to the loaded values', () => {
            changeAllValues();

            ConfigCtrl.resetConfiguration();

            expect(ConfigCtrl.configuration).toEqual(TestData.CONFIG);
        }));

    // TODO reactivate after AngularJS migration.
    // describe('when the save button is clicked', () => {
    //     it('saves the edited config', () => {
    //         spyOn(ConfigurationService, 'updateConfiguration');
    //
    //         changeAllValues();
    //
    //         ConfigCtrl.updateConfiguration();
    //
    //         expect(ConfigurationService.updateConfiguration).toHaveBeenCalled();
    //     });
    // });

    // TODO remove after AngularJS migration
    describe('when the save button is clicked', () =>
        it('saves the edited config', () => {
            changeAllValues();

            ConfigCtrl.updateConfiguration();

            expect(ConfigurationServiceMock.updateConfigurationCalled).toBeTruthy();
        }));

    function changeAllValues() {
        ConfigCtrl.configuration.defaultBuildName = 'new build';
        ConfigCtrl.configuration.defaultBranchName = 'new branch';
        ConfigCtrl.configuration.scenarioPropertiesInOverview = 'abc';
        ConfigCtrl.configuration.applicationInformation = 'new information';
        ConfigCtrl.configuration.testDocumentationDirPath = 'new path';
    }

});
