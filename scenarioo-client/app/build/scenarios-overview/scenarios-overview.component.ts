import {AfterViewChecked, Component, HostListener, Input} from '@angular/core';
import {SelectedBranchAndBuildService} from '../../shared/navigation/selectedBranchAndBuild.service';
import {BranchesAndBuildsService} from '../../shared/navigation/branchesAndBuilds.service';
import {ScenarioResource} from '../../shared/services/scenarioResource.service';
import {LabelConfigurationMap, LabelConfigurationsResource} from '../../shared/services/labelConfigurationsResource.service';
import {SelectedComparison} from '../../diffViewer/selectedComparison.service';
import {LocationService} from '../../shared/location.service';
import {LabelConfigurationService} from '../../services/label-configuration.service';
import {IScenario, IScenarioSummary, IUseCaseScenarios} from '../../generated-types/backend-types';
import {ConfigurationService} from '../../services/configuration.service';
import {downgradeComponent} from '@angular/upgrade/static';
import {OrderPipe} from 'ngx-order-pipe';
import {forkJoin} from 'rxjs';
import {UseCaseDiffInfoService} from '../../diffViewer/services/use-case-diff-info.service';
import {ScenarioDiffInfosService} from '../../diffViewer/services/scenario-diff-infos.service';
import {DiffInfoService} from '../../diffViewer/diffInfo.service';
import {MetadataTreeCreatorPipe} from '../../pipes/metadataTreeCreator.pipe';
import {ScenariooResourceNewService} from '../../shared/services/scenariooResourceNew.service';

@Component({
    selector: 'sc-scenarios-overview',
    template: require('./scenarios-overview.component.html'),
    styles: [require('./scenarios-overview.component.css').toString()],
})

export class ScenariosComponent implements AfterViewChecked {

    @Input()
    useCaseName: string;

    scenarios: IScenarioSummary[] = [];
    scenario: IScenario[] = [];
    propertiesToShow: any[];

    searchTerm: string;

    order: string = 'name';
    sortedScenarios: any[];
    reverse: boolean = false;

    arrowkeyLocation: number = 0;

    labelConfigurations: LabelConfigurationMap = undefined;
    labelConfig = undefined;

    getStatusStyleClass = undefined;
    comparisonExisting = undefined;

    isPanelCollapsed: boolean;

    usecaseInformationTree = {};
    metadataInformationTree = {};
    relatedIssues = {};
    labels = {};

    constructor(private selectedBranchAndBuildService: SelectedBranchAndBuildService,
                private branchesAndBuildsService: BranchesAndBuildsService,
                private scenarioResource: ScenarioResource,
                private labelConfigurationService: LabelConfigurationService,
                private selectedComparison: SelectedComparison,
                private locationService: LocationService,
                private configurationService: ConfigurationService,
                private orderPipe: OrderPipe,
                private useCaseDiffInfoService: UseCaseDiffInfoService,
                private scenarioDiffInfosService: ScenarioDiffInfosService,
                private diffInfoService: DiffInfoService,
                private metadataTreeCreatorPipe: MetadataTreeCreatorPipe,
                private labelConfigurationsResource: LabelConfigurationsResource,
                private scenariooResourceNewService: ScenariooResourceNewService) {
    }

    ngOnInit(): void {

    }

    // TODO: Find a better solution to get the name of the use case
    ngAfterViewChecked() {

        this.selectedBranchAndBuildService.callOnSelectionChange((selection) => {

            this.scenarioResource.getUseCaseScenarios({
                    branchName: selection.branch,
                    buildName: selection.build,
                },
                this.useCaseName,
            ).subscribe((useCaseScenarios: IUseCaseScenarios) => {

                if (this.comparisonExisting) {
                    this.loadDiffInfoData(useCaseScenarios.scenarios, selection.branch, selection.build, this.selectedComparison.selected(), this.useCaseName);
                } else {
                    this.scenarios = useCaseScenarios.scenarios;
                }

                this.usecaseInformationTree = this.createUseCaseInformationTree(useCaseScenarios.useCase);
                this.metadataInformationTree = this.metadataTreeCreatorPipe.transform(useCaseScenarios.useCase.details);
                this.labels = useCaseScenarios.useCase.labels.labels;

                /*
                this.scenariooResourceNewService.query({
                    branchName: selection.branch,
                    buildName: selection.build,
                    useCaseName: useCaseScenarios.useCase.name,
                }, (result) => {
                    this.relatedIssues = result;
                });
                */
            });

        });

        this.labelConfigurationsResource.query()
            .subscribe(((labelConfigurations) => {
                this.labelConfigurations = labelConfigurations;
            }));

        this.getStatusStyleClass = (state) => this.configurationService.getStatusStyleClass(state);

        this.sortedScenarios = this.orderPipe.transform(this.scenarios, this.order);

        this.comparisonExisting = this.selectedComparison.isDefined();
    }

    loadDiffInfoData(scenarios, baseBranchName: string, baseBuildName: string, comparisonName: any, useCaseName: string) {
        if (scenarios && baseBranchName && baseBuildName && useCaseName) {
            forkJoin([
                this.useCaseDiffInfoService.get(baseBranchName, baseBuildName, comparisonName, useCaseName),
                this.scenarioDiffInfosService.get(baseBranchName, baseBuildName, comparisonName, useCaseName),
            ])
                .subscribe(([useCaseDiffInfo, scenarioDiffInfos]) => {
                    this.scenarios = this.diffInfoService.getElementsWithDiffInfos(scenarios, useCaseDiffInfo.removedElements, scenarioDiffInfos, 'scenario.name');
                }, () => {
                    this.scenarios = this.diffInfoService.getElementsWithDiffInfos(scenarios, [], [], 'scenario.name');
                });
        }
    }

    resetSearchField() {
        this.searchTerm = '';
    }

    setOrder(value: string) {
        if (this.order === value) {
            this.reverse = !this.reverse;
        }
        this.order = value;
    }

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        switch (event.code) {
            case 'ArrowDown':
                this.arrowkeyLocation++;
                break;
            case 'ArrowUp':
                this.arrowkeyLocation--;
                break;
            case 'Enter':
                this.goToScenario(this.useCaseName, this.scenario[this.arrowkeyLocation].name);
                break;
        }
    }

    goToScenario(useCaseName, scenarioName) {
        const params = this.locationService.path('/scenario/' + useCaseName + '/' + scenarioName);
    }

    getLabelStyle(labelName) {
        if (this.labelConfigurations) {
            this.labelConfig = this.labelConfigurations[labelName];
            if (this.labelConfig) {
                return {
                    'background-color': this.labelConfig.backgroundColor,
                    'color': this.labelConfig.foregroundColor,
                };
            }
        }
    }

    collapsePanel(event) {
        this.isPanelCollapsed = event;
    }

    createUseCaseInformationTree(usecase) {
        const usecaseInformationTree: any = {};
        usecaseInformationTree['Use Case'] = usecase.name;
        if (usecase.description) {
            usecaseInformationTree.Description = usecase.description;
        }
        usecaseInformationTree.Status = usecase.status;
        return this.metadataTreeCreatorPipe.transform(usecaseInformationTree);
    }
}

angular.module('scenarioo.directives')
    .directive('scScenariosOverview',
        downgradeComponent({component: ScenariosComponent}) as angular.IDirectiveFactory);
