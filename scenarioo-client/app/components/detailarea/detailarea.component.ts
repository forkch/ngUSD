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

import {Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild} from '@angular/core';
import {ICustomObjectTabTree, ILabelConfiguration} from '../../generated-types/backend-types';
import {RelatedIssueSummary} from '../../shared/services/relatedIssueResource.service';

@Component({
    selector: 'sc-detailarea',
    template: require('./detailarea.component.html'),
    styles: [require('./detailarea.component.css').toString()],
})

export class DetailareaComponent {

    isPanelCollapsed: boolean = false;

    @Input()
    branchInformationTree: any;

    @Input()
    buildInformationTree: any;

    @Input()
    usecaseInformationTree: any;

    @Input()
    metadataInformationTree: ICustomObjectTabTree;

    @Input()
    relatedIssues: RelatedIssueSummary[];

    @Input()
    useCaseLabels: string[];

    @Input()
    labelConfigurations: ILabelConfiguration;

    @Output('valueChange')
    panelCollapsed: EventEmitter<boolean> = new EventEmitter<boolean>();

    valueChange() {
        this.isPanelCollapsed = this.isPanelCollapsed === false;
        this.panelCollapsed.emit(this.isPanelCollapsed);
    }

    isEmptyObject(obj) {
        return (obj && (Object.keys(obj).length === 0));
    }
}
