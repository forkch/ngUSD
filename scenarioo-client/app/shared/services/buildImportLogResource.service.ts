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
import encodeUrl from '../utils/httpUrlEncoder';

declare var angular: angular.IAngularStatic;

@Injectable()
export class BuildImportLogResource {
    private url = 'rest/builds/importLogs/';

    constructor(private httpClient: HttpClient) {
    }

    get(branchName: string, buildName: string): Observable<string> {
        const urlWithBranchAndBuild = `${this.url}${encodeUrl([branchName, buildName])}`;
        return this.httpClient.get(urlWithBranchAndBuild,
            {
                headers: {Accept: 'text/plain'},
                responseType: 'text',
            });
    }
}

angular.module('scenarioo.services')
    .factory('BuildImportLogResource', downgradeInjectable(BuildImportLogResource));
