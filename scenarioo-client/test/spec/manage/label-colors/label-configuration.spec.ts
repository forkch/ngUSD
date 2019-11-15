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

'use strict';

import {LabelConfiguration} from '../../../../app/manage/labelColors/label-configuration';

describe('A LabelConfiguration', () => {

    it('is valid, when it is empty', () => {
        const emptyLabelConfiguration = LabelConfiguration.empty();

        expect(emptyLabelConfiguration.isValid()).toBe(true);
    });

    it('is not valid, when only the colors are set', () => {
        const labelConfiguration = LabelConfiguration.empty();
        labelConfiguration.backgroundColor = '#ffffff';
        labelConfiguration.foregroundColor = '#aaaaaa';

        expect(labelConfiguration.isValid()).toBe(false);
    });

    it('is not valid, when only the name is set', () => {
        const labelConfiguration = LabelConfiguration.empty();
        labelConfiguration.name = 'some label';

        expect(labelConfiguration.isValid()).toBe(false);
    });
});
