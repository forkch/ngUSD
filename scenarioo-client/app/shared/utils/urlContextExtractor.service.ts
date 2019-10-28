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

import {downgradeInjectable} from '@angular/upgrade/static';

declare var angular: angular.IAngularStatic;

export class UrlContextExtractorService {

    /**
     * Extract the context path where the app is running form any URL (without domain name, protocol, port or any hash or parameters behind)
     * @param url the current value of $location.absUrl()
     */
    getContextPathFromUrl(url: string): string {
        const urlWithoutParamsOrHash = this.before(this.before(url, '?'), '#');
        const contextPath = this.after(this.after(urlWithoutParamsOrHash, '//'), '/', '');
        return contextPath.replace(/(^\/)|(\/$)/g, '');  // trim leading or trailing slashes
    }

    before(string: string, separator: string, optionalNotFoundResult?: string): string {
        const index = string.indexOf(separator);
        if (index >= 0) {
            return string.substring(0, index);
        } else {
            return (optionalNotFoundResult !== undefined) ? optionalNotFoundResult : string;
        }
    }

    after(string: string, separator: string, optionalNotFoundResult?: string): string {
        const index = string.indexOf(separator);
        if (index >= 0) {
            return string.substring(index + separator.length, string.length);
        } else {
            return (optionalNotFoundResult !== undefined) ? optionalNotFoundResult : string;
        }
    }

}

angular.module('scenarioo.services')
    .factory('UrlContextExtractorService', downgradeInjectable(UrlContextExtractorService));
