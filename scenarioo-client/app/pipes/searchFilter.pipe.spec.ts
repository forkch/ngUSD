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

import {ScSearchFilterPipe} from './searchFilter.pipe';

describe('Pipe: scSearchFilter', () => {
    let scSearchFilter: ScSearchFilterPipe;

    const MODEL = [
        {
            test: 'test',
            something: 'else',
            odd: {
                weird: 'things',
            },
        },
        {
            test: 'hi',
            something: 'there',
            odd: {
                weird: 'things',
            },
        },
    ];

    const MODEL_FILTERED = [
        {
            test: 'test',
            something: 'else',
            odd: {
                weird: 'things',
            },
        },
    ];

    beforeEach(() => {
        scSearchFilter = new ScSearchFilterPipe();
    });

    it('Should return the original model when search text is empty', async () => {
        // Act
        const output = scSearchFilter.transform(MODEL, '');
        // Assert
        await expect(output).toEqual(MODEL);
    });

    it('Should filter the model when search text is a normal string', async () => {
        // Act
        const output = scSearchFilter.transform(MODEL, 'test');
        // Assert
        await expect(output).toEqual(MODEL_FILTERED);
    });

    it('Should filter the model, regarding search is not case sensitive', async () => {
        // Act
        const output = scSearchFilter.transform(MODEL, 'TEST');
        // Assert
        await expect(output).toEqual(MODEL_FILTERED);
    });

    describe('when search text consists of multiple words, ', () => {
        it('keeps all objects in the model, that contain both words', async () => {
            // Act
            const output = scSearchFilter.transform(MODEL, 'test else');
            // Assert
            await expect(output).toEqual(MODEL_FILTERED);
        });

        it('filters out all objects that miss one or more words', async () => {
            // Act
            const output = scSearchFilter.transform(MODEL, 'test weirdthing');
            // Assert
            await expect(output).toEqual([]);
        });

        it('keeps the object if the search words were found internally on different levels', async () => {
            // Act
            const output = scSearchFilter.transform(MODEL, 'test THINGS');
            // Assert
            await expect(output).toEqual(MODEL_FILTERED);
        });

    });

});
