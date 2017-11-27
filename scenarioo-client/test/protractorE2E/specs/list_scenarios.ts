'use strict';
import {scenario, step, useCase} from "scenarioo-js";

var scenarioo = require('scenarioo-js');
var pages = require('./../webPages');
var NUMBER_OF_USE_CASES = 4;
var NUMBER_OF_SCENARIOS = 4;
var COMPARISON_PROJECTSTART = 'To Projectstart';
var COMPARISON_DISABLE = 'Disable';
var SECOND_USE_CASE = 1;
var SCENARIO_WITH_HIGHEST_DIFF = 'Find page title unique directly';

useCase('List scenarios')
    .description('After clicking on a use case, the user is presented with a list of all scenarios in this use case.')
    .describe(function () {

        var homePage = new pages.homePage();
        var useCasePage = new pages.usecasePage();
        var scenarioPage = new pages.scenarioPage();
        var navigationPage = new pages.navigationPage();

        beforeEach(function () {
            new pages.homePage().initLocalStorage();
        });

        scenario('Expand all, collapse all on scenario page')
            .it(function () {
                homePage.goToPage();
                step('select a use case from the use case list');
                homePage.assertPageIsDisplayed();
                homePage.assertUseCasesShown(NUMBER_OF_USE_CASES);
                homePage.selectUseCase(SECOND_USE_CASE);
                step('select a scenario in the scenario list');
                useCasePage.selectScenario(0);
                step('all pages are collapsed by default, "expand all" button is visible');
                scenarioPage.expectOnlyExpandAllButtonIsDisplayed();
                scenarioPage.toggleShowAllStepsOfPage(0);
                step('"expand all" button and "collapse all" button are both visible');
                scenarioPage.expectExpandAllAndCollapseAllButtonBothDisplayed();
                scenarioPage.toggleShowAllStepsOfPage(1);
                step('Only "collapse all" visible');
                scenarioPage.expectOnlyCollapseAllButtonIsDisplayed();
            });

        scenario('Display Diff-Information')
            .labels(['diff-viewer'])
            .it(function () {
                homePage.goToPage();
                step('display usecases on homepage');
                homePage.assertPageIsDisplayed();
                navigationPage.chooseComparison(COMPARISON_PROJECTSTART);
                step('To Projectstart comparison selected');
                homePage.selectUseCase(SECOND_USE_CASE);
                step('Use Case selected');

                useCasePage.assertNumberOfDiffInfos(NUMBER_OF_SCENARIOS);
                navigationPage.disableComparison();
            });

        scenario('Sort by Diff-Information')
            .labels(['diff-viewer'])
            .it(function () {
                homePage.goToPage();
                step('display usecases on homepage');
                homePage.assertPageIsDisplayed();
                navigationPage.chooseComparison('To Projectstart');
                step('To Projectstart comparison selected');
                homePage.selectUseCase(SECOND_USE_CASE);
                step('Use Case selected');

                useCasePage.sortByChanges();
                useCasePage.assertLastUseCase(SCENARIO_WITH_HIGHEST_DIFF);
                step('Diff Infos sorted ascending');

                useCasePage.sortByChanges();
                useCasePage.assertFirstUseCase(SCENARIO_WITH_HIGHEST_DIFF);
                step('Diff Infos sorted descending');
                navigationPage.disableComparison();
            });
    });
