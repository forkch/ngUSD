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

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {downgradeInjectable} from '@angular/upgrade/static';
import {IApplicationStatus} from '../../generated-types/backend-types';

declare var angular: angular.IAngularStatic;

@Injectable()
export class ApplicationStatusService {
    constructor(private httpClient: HttpClient) {

    }

    getApplicationStatus(): Observable<IApplicationStatus> {
        return this.httpClient.get<IApplicationStatus>('rest/configuration/applicationStatus');
    }
}

angular.module('scenarioo.services')
    .factory('ApplicationStatusService', downgradeInjectable(ApplicationStatusService));
