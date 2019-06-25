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

angular.module('scenarioo.services')





    .factory('StepDiffInfoResource', function (ScenariooResource) {
        return ScenariooResource('/diffViewer/baseBranchName/:baseBranchName/baseBuildName/:baseBuildName/comparisonName/:comparisonName/useCaseName/:useCaseName/scenarioName/:scenarioName/stepIndex/:stepIndex/stepDiffInfo',
            {
                baseBranchName: '@baseBranchName',
                baseBuildName: '@baseBuildName',
                comparisonName: '@comparisonName',
                useCaseName: '@useCaseName',
                scenarioName: '@scenarioName',
                stepIndex: '@stepIndex'
            }, {});
    })

    .factory('StepDiffInfosResource', function (ScenariooResource) {
        return ScenariooResource('/diffViewer/baseBranchName/:baseBranchName/baseBuildName/:baseBuildName/comparisonName/:comparisonName/useCaseName/:useCaseName/scenarioName/:scenarioName/stepDiffInfos', {
            baseBranchName: '@baseBranchName',
            baseBuildName: '@baseBuildName',
            comparisonName: '@comparisonName',
            useCaseName: '@useCaseName',
            scenarioName: '@scenarioName'
        }, {});
    });
