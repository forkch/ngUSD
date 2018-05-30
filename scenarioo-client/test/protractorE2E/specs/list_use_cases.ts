'use strict';

import { scenario, step, useCase } from "scenarioo-js";
import * as Utils from "../util/util";

var scenarioo = require('scenarioo-js');
var pages = require('./../webPages');

var NUMBER_OF_USE_CASES = 4;
var COMPARISON_PROJECTSTART = 'To Projectstart';
var USE_CASE_WITH_HIGHEST_DIFF = 'Donate';

useCase('List use cases')
    .description('As soon as a branch and a build are selected, a list of use cases is shown.')
    .describe(function () {

        var homePage = new pages.homePage();
        var navigationPage = new pages.navigationPage();

        beforeEach(async function () {
            await Utils.startScenariooRevisited();
        });

        scenario('Display and filter usecases')
            .it(async function () {
                Utils.navigateToRoute();
                homePage.assertUseCasesShown(NUMBER_OF_USE_CASES);
                step('display usecases on homepage');
                homePage.assertPageIsDisplayed();
                homePage.filterUseCases('notinlist');
                homePage.assertUseCasesShown(0);
                step('filter applied: no use cases shown');
                homePage.filterUseCases('find page');
                homePage.assertUseCasesShown(1);
                step('filter applied: one use case found');
                homePage.filterUseCases('user wants find page');
                homePage.assertUseCasesShown(1);
                step('other filter applied: one use case found');
            });

        scenario('Show and hide metadata')
            .it(async function () {
                Utils.navigateToRoute();
                step('display the homePage, metadata shown');
                homePage.assertPageIsDisplayed();
                homePage.assertMetaDataShown();
                homePage.hideMetaData();
                homePage.assertMetaDataHidden();
                step('metadata hidden');
                homePage.showMetaData();
                homePage.assertMetaDataShown();
                step('metadata shown');
            });

        scenario('Display Diff-Information')
            .labels(['diff-viewer'])
            .it(async function () {
                Utils.navigateToRoute();
                step('display usecases on homepage');
                navigationPage.chooseComparison(COMPARISON_PROJECTSTART);
                homePage.assertPageIsDisplayed();
                step('To Projectstart comparison selected');

                homePage.assertNumberOfDiffInfos(NUMBER_OF_USE_CASES);

                homePage.sortByChanges();
                homePage.assertLastUseCase(USE_CASE_WITH_HIGHEST_DIFF);
                step('Diff Infos sorted ascending');

                homePage.sortByChanges();
                homePage.assertFirstUseCase(USE_CASE_WITH_HIGHEST_DIFF);
                step('Diff Infos sorted descending');
                navigationPage.disableComparison();
            });
    });
