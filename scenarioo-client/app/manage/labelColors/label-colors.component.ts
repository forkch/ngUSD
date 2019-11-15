import {Component, OnInit} from '@angular/core';
import {LabelConfigurationsListResource} from '../../shared/services/labelConfigurationsListResource.service';
import {LabelConfigurationsResource} from '../../shared/services/labelConfigurationsResource.service';
import {AvailableColor} from './available-color';
import {LabelConfiguration} from './label-configuration';

@Component({
    selector: 'sc-label-colors',
    template: require('./label-colors.component.html'),
    styles: [require('./label-colors.component.css').toString()],
})
export class LabelColorsComponent implements OnInit {
    availableColors: AvailableColor[] = [
        new AvailableColor('#e11d21', '#FFFFFF'),
        new AvailableColor('#eb6420', '#FFFFFF'),
        new AvailableColor('#fbca04', '#000000'),
        new AvailableColor('#009800', '#FFFFFF'),
        new AvailableColor('#006b75', '#FFFFFF'),
        new AvailableColor('#207de5', '#FFFFFF'),
        new AvailableColor('#0052cc', '#FFFFFF'),
        new AvailableColor('#5319e7', '#FFFFFF'),
    ];

    labelConfigurations: LabelConfiguration[] = [];
    successfullyUpdatedLabelConfigurations = false;

    constructor(private labelConfigurationsListResource: LabelConfigurationsListResource,
                private labelConfigurationsResource: LabelConfigurationsResource) {
    }

    ngOnInit(): void {
        this.loadLabelConfigurations();
    }

    onDelete(configurationToDelete) {
        this.labelConfigurations = this.labelConfigurations
            .filter((configuration) => configuration.name !== configurationToDelete.name);
    }

    onLabelNameChanged() {
        const lastLabelInList = this.labelConfigurations[this.labelConfigurations.length - 1];
        if (!lastLabelInList.isEmpty()) {
            this.labelConfigurations.push(LabelConfiguration.empty());
        }
    }

    onReset() {
        this.loadLabelConfigurations();
    }

    onSave() {
        if (this.allConfigurationsAreValid()) {
            this.labelConfigurationsResource.save(this.mapLabelConfigurations())
                .subscribe(() => {
                    this.successfullyUpdatedLabelConfigurations = true;
                });
        }
    }

    onColorSelected(labelConfiguration: LabelConfiguration, color: AvailableColor) {
        labelConfiguration.backgroundColor = color.backgroundColor;
        labelConfiguration.foregroundColor = color.foregroundColor;
    }

    private loadLabelConfigurations() {
        this.labelConfigurationsListResource.query()
            .subscribe((labelConfigurations) => {
                this.labelConfigurations = [
                    ...labelConfigurations.map(LabelConfiguration.fromFlatLabelConfiguration),
                    LabelConfiguration.empty()];
            });
    }

    private allConfigurationsAreValid() {
        return this.labelConfigurations.every((value) => value.isValid());
    }

    private mapLabelConfigurations() {
        const labelConfigurationsAsMap = {};
        for (const labelConfiguration of this.labelConfigurations) {
            if (!labelConfiguration.isEmpty()) {
                labelConfigurationsAsMap[labelConfiguration.name] = {
                    backgroundColor: labelConfiguration.backgroundColor,
                    foregroundColor: labelConfiguration.foregroundColor,
                };
            }
        }
        return labelConfigurationsAsMap;
    }
}
