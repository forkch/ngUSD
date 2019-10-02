'use strict';

import {scenario, step, useCase} from 'scenarioo-js';
import * as Utils from '../util';
import BranchAliasesPage from '../pages/branchAliasesPage';

const NUMBER_OF_ALIASES_IN_CONFIG = 2;
const FIRST_TEST_ALIAS_INDEX = NUMBER_OF_ALIASES_IN_CONFIG;

useCase('Manage branch aliases')
    .description('Define new branch aliases, edit existing ones and delete them.')
    .describe(() => {

        beforeEach(async () => {
            await Utils.startScenariooRevisited();
        });

        scenario('Add and remove')
            .description('Branch aliases can be added and removed')
            .it(async () => {
                await BranchAliasesPage.goToPage();
                await step('display the manage branch aliases page');

                await BranchAliasesPage.assertNumberOfAliases(NUMBER_OF_ALIASES_IN_CONFIG);
                await BranchAliasesPage.enterAlias('Test Alias 1', 'wikipedia-docu-example', 'my description 1');
                await BranchAliasesPage.enterAlias('Test Alias 2', 'wikipedia-docu-example', 'my description 2');
                await BranchAliasesPage.saveAndAssertSuccessMessage();
                await step('saved build aliases');

                await BranchAliasesPage.reset();
                await BranchAliasesPage.assertNumberOfAliases(NUMBER_OF_ALIASES_IN_CONFIG + 2);
                await BranchAliasesPage.openBranchSelectionMenu();
                await step('open branch menu with aliases');
                await BranchAliasesPage.assertAliasesAreShownFirstInTheNavigationMenu();

                await BranchAliasesPage.deleteAlias(FIRST_TEST_ALIAS_INDEX);
                await BranchAliasesPage.saveAndAssertSuccessMessage();
                await BranchAliasesPage.assertNumberOfAliases(NUMBER_OF_ALIASES_IN_CONFIG + 1);
                await BranchAliasesPage.reset();
                await BranchAliasesPage.assertNumberOfAliases(NUMBER_OF_ALIASES_IN_CONFIG + 1);
                await step('removed first test alias');

                await BranchAliasesPage.updateAlias(FIRST_TEST_ALIAS_INDEX, 'updated alias', 'wikipedia-docu-example', 'updated description');
                await BranchAliasesPage.saveAndAssertSuccessMessage();
                await step('updated first test alias');

                await BranchAliasesPage.deleteAlias(FIRST_TEST_ALIAS_INDEX);
                await BranchAliasesPage.deleteAlias(FIRST_TEST_ALIAS_INDEX);
                await BranchAliasesPage.saveAndAssertSuccessMessage();
                await step('all test aliases removed');
            });

        scenario('Validation')
            .description('Saving is not possible if referenced branch is not selected')
            .it(async () => {
                await BranchAliasesPage.goToPage();
                await BranchAliasesPage.assertNumberOfAliases(NUMBER_OF_ALIASES_IN_CONFIG);
                await BranchAliasesPage.enterAliasWithoutReferenceBranch('Test', 'my description');
                await BranchAliasesPage.save();
                await BranchAliasesPage.assertRequiredFieldsError();
                await step('saving not possible because referenced branch is not selected');
            });

        scenario('Unique aliases')
            .description('Alias names have to be unique')
            .it(async () => {
                await BranchAliasesPage.goToPage();
                await BranchAliasesPage.assertNumberOfAliases(NUMBER_OF_ALIASES_IN_CONFIG);
                await BranchAliasesPage.enterAlias('duplicate', 'wikipedia-docu-example', 'duplicate alias name');
                await BranchAliasesPage.saveAndAssertSuccessMessage();
                await BranchAliasesPage.assertNumberOfAliases(NUMBER_OF_ALIASES_IN_CONFIG + 1);
                await BranchAliasesPage.enterAlias('duplicate', 'wikipedia-docu-example', 'duplicate alias name');
                await BranchAliasesPage.save();
                await BranchAliasesPage.assertDuplicateAliasError();
                await step('duplicate aliases are not allowed');

                await BranchAliasesPage.reset();
                await BranchAliasesPage.deleteAlias(FIRST_TEST_ALIAS_INDEX);
                await BranchAliasesPage.saveAndAssertSuccessMessage();
            });

    });
