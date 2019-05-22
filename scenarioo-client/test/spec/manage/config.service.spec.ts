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
import {IConfiguration} from '../../../app/generated-types/backend-types';

declare var angular: angular.IAngularStatic;

describe('ConfigService', () => {

    const BUILD_STATE_FAILED = 'failed',
        BUILD_STATE_SUCCESS = 'success',
        BUILD_STATE_WARNING = 'warning',
        DUMMY_CONFIG_RESPONSE: IConfiguration = {
            aliasForLastSuccessfulBuild: '',
            aliasForMostRecentBuild: '',
            buildStatusForSuccessfulBuilds: '',
            branchAliases: [],
            comparisonConfigurations: [],
            labelConfigurations: undefined,
            customObjectTabs: [],
            elasticSearchEndpoint: '',
            elasticSearchClusterName: '',
            branchSelectionListOrder: '',
            diffImageColor: '',
            createLastSuccessfulScenarioBuild: false,
            expandPagesInScenarioOverview: false,
            applicationName: '',
            defaultBuildName: 'current',
            scenarioPropertiesInOverview: 'userProfile, configuration',
            applicationInformation: 'This is my personal copy of Scenarioo :-)',
            buildstates: {
                BUILD_STATE_FAILED: 'label-important',
                BUILD_STATE_SUCCESS: 'label-success',
                BUILD_STATE_WARNING: 'label-warning'
            },
            defaultBranchName: 'trunk'
        };
    const ConfigResourceMock = {
        get: () => of<IConfiguration>(angular.copy(DUMMY_CONFIG_RESPONSE))
    };

    beforeEach(angular.mock.module('scenarioo.services', ($provide) => {
        // TODO: Remove after AngularJS Migration.
        $provide.value("ConfigResource", ConfigResourceMock);
    }));

    it('should inject ConfigService', inject(ConfigService => {
        expect(ConfigService).not.toBeUndefined();
    }));

    it('should be able to load config from server', inject((ConfigService, $rootScope) => {
        spyOn($rootScope, '$broadcast').and.callThrough();

        loadConfigFromService(ConfigService);

        expect($rootScope.$broadcast).toHaveBeenCalledWith(ConfigService.CONFIG_LOADED_EVENT);

        expect(ConfigService.scenarioPropertiesInOverview()).toBeDefined();
        expect(ConfigService.applicationInformation()).toBe(DUMMY_CONFIG_RESPONSE.applicationInformation);
    }));

    it('contains build state to css class mapping as a map', inject((ConfigService) => {
        loadConfigFromService(ConfigService);

        const buildStateToClassMapping = ConfigService.buildStateToClassMapping();

        expect(buildStateToClassMapping).toBeDefined();
        expect(getSize(buildStateToClassMapping)).toBe(3);
        expect(buildStateToClassMapping[BUILD_STATE_FAILED]).toBe(DUMMY_CONFIG_RESPONSE.buildstates[BUILD_STATE_FAILED]);
        expect(buildStateToClassMapping[BUILD_STATE_WARNING]).toBe(DUMMY_CONFIG_RESPONSE.buildstates[BUILD_STATE_WARNING]);
        expect(buildStateToClassMapping[BUILD_STATE_SUCCESS]).toBe(DUMMY_CONFIG_RESPONSE.buildstates[BUILD_STATE_SUCCESS]);
    }));

    it('contains additional columns for scenario overview', inject((ConfigService) => {
        loadConfigFromService(ConfigService);

        const columns = ConfigService.scenarioPropertiesInOverview();

        expect(columns).toBeDefined();
        expect(getSize(columns)).toBe(2);
        expect(columns[0]).toBe('userProfile');
        expect(columns[1]).toBe('configuration');
    }));

    function loadConfigFromService(ConfigService) {
        spyOn(ConfigResourceMock, "get").and.returnValue(of(DUMMY_CONFIG_RESPONSE));
        ConfigService.load();
    }

    function getSize(object) {
        let size = 0, key;
        for (key in object) {
            if (object.hasOwnProperty(key)) {
                size++;
            }
        }
        return size;
    }

});
