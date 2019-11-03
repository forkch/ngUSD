'use strict';

import { browser, by, element, $ } from 'protractor';
import * as Utils from '../util';

class HomePage {

    private path: string = '/';
    private useCasesSearchField = element(by.id('useCasesSearchField'));
    private aboutScenariooPopup = $('.modal.about-popup');
    private popupCloseButton = $('.modal-footer button.btn');
    private usecaseTable = $('table.usecase-table');
    private toggleMetaDataButton = element(by.id('sc-showHideDetailsButton'));
    private metaDataPanel = element(by.id('sc-metadata-panel'));
    private sketchesTab = element(by.id('sc-main-tab-sketches-link'));
    private pagesTab = element(by.id('sc-main-tab-pages-link'));

    async goToPage() {
        return Utils.navigateToRoute(this.path);
    }

    async assertPageIsDisplayed() {
        await Utils.assertPageIsDisplayed(this.path);
        return expect(this.useCasesSearchField.isDisplayed()).toBe(true);
    }

    async assertScenariooInfoDialogShown() {
        await expect(this.aboutScenariooPopup.isDisplayed()).toBe(true);
        return expect(this.popupCloseButton.isDisplayed()).toBe(true);
    }

    async assertScenariooInfoDialogNotShown() {
        return expect(this.aboutScenariooPopup.isPresent()).toBe(false);
    }

    async assertComparisonMenuNotShown() {
        return Utils.assertElementNotPresentInDom(by.id('#comparison-selection-dropdown'));
    }

    async closeScenariooInfoDialogIfOpen() {
        const present = await browser.isElementPresent(by.css('.modal-footer button.btn'));
        if (present) {
            await this.popupCloseButton.click();
        }
    }

    async filterUseCases(filterQuery) {
        await this.useCasesSearchField.clear();
        return this.useCasesSearchField.sendKeys(filterQuery);
    }

    async assertUseCasesShown(count) {
        if (count !== 0) {
            return this.usecaseTable.all(by.css('tbody tr')).then((elements) => {
                return expect(elements.length).toBe(count);
            });
        }
    }

    async selectUseCase(useCaseIndex) {
        return this.usecaseTable.all(by.css('tbody tr')).then((elements) => {
            return elements[useCaseIndex].click();
        });
    }

    async showMetaData() {
        return this.toggleMetaDataButton.click();
    }

    async assertMetaDataShown() {
        await expect(this.toggleMetaDataButton.getText()).toEqual('Hide details');
        return expect(this.metaDataPanel.isDisplayed()).toBe(true);
    }

    async assertMetaDataHidden() {
        await expect(this.toggleMetaDataButton.getText()).toEqual('Show details');
        return expect(this.metaDataPanel.isDisplayed()).toBe(false);
    }

    async hideMetaData() {
        return this.toggleMetaDataButton.click();
    }

    async sortByChanges() {
        return this.usecaseTable.$('th.sort-diff-info').click();
    }

    async assertNumberOfDiffInfos(count) {
        const elements = this.usecaseTable.all(by.css('.diff-info-wrapper'));
        return expect(elements.count()).toBe(count);
    }

    async assertLastUseCase(lastName) {
        return Utils.assertTextPresentInElement(this.usecaseTable.element(by.css('tr:last-of-type td:nth-of-type(2)')), lastName);
    }

    async assertFirstUseCase(firstName) {
        return Utils.assertTextPresentInElement(this.usecaseTable.element(by.css('tr:first-of-type td:nth-of-type(2)')), firstName);
    }

    async selectSketchesTab() {
        return this.sketchesTab.click();
    }

    async assertSketchesListContainsEntryWithSketchName(sketchName) {
        return Utils.assertTextPresentInElement(element(by.id('sc-sketches-list')), sketchName);
    }

    async selectPagesTab() {
        return this.pagesTab.click();
    }

    async assertPagesTabContainsPage(pageName) {
        return Utils.assertTextPresentInElement(element(by.id('treeviewtable')), pageName);
    }

    async filterPages(filterQuery) {
        const pagesSearchField = element(by.id('pagesSearchField'));
        await pagesSearchField.clear();
        return pagesSearchField.sendKeys(filterQuery);
    }

    async assertCustomTabEntriesShown(count) {
        const elements = element(by.id('treeviewtable')).all(by.css('tbody tr')).filter((e) => e.isDisplayed());
        // Not a great workaround, at the moment the filterable table header column is also a normal tr
        return expect(elements.count()).toBe(count);
    }

    async assertNoDiffInfoDisplayed() {
        return expect($('.sort-diff-info').isPresent()).toBeFalsy();
    }

}

export default new HomePage();
