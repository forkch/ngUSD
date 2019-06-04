/* scenarioo-server
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

package org.scenarioo.model.docu.aggregates.objects;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LongObjectNamesResolverTest {
	
	private LongObjectNamesResolver resolver;
	
	@BeforeEach
	void setUp() {
		resolver = new LongObjectNamesResolver();
	}
	
	@Test
	void testSmallNamesJustPass() {
		// Given:
		String shortName = "aShortName";
		// When:
		String resolvedFileName = resolver.resolveObjectFileName(shortName);
		// Then:
		assertEquals(shortName, resolvedFileName);
	}
	
	@Test
	void testLongNameIsShortened() {
		// Given:
		String longObjectName = "veryVeryVeryLongNameThatIsLongerThan100CharactersIsExpectedToBeShortenedByLongObjectNamesResolverSuchThatFileNamesDoNotBecomeTooLong";
		// When:
		String resolvedFileName = resolver.resolveObjectFileName(longObjectName);
		// Then:
		assertEquals(
			"veryVeryVeryLongNameThatIsLongerThan100CharactersIsExpectedToBeShortenedByLongObjectNamesResolverSuc-0",
				resolvedFileName, "Expected shortened name with suffix of collision index (0 for no collision yet)");
	}
	
	@Test
	void testLongNamesResolvedCorrectly() {
		// Given: two long names
		String longObjectName1 = "veryVeryVeryLongNameThatIsLongerThan100CharactersIsExpectedToBeShortenedByLongObjectNamesResolverSuchThatFileNamesDoNotBecomeTooLongOne";
		String longObjectName2 = "veryVeryVeryLongNameThatIsLongerThan100CharactersIsExpectedToBeShortenedByLongObjectNamesResolverSuchThatFileNamesDoNotBecomeTooLongTwo";
		
		// When: reolving the same names more than once
		String resolvedFileName1_firstCall = resolver.resolveObjectFileName(longObjectName1);
		String resolvedFileName2_firstCall = resolver.resolveObjectFileName(longObjectName2);
		String resolvedFileName1_secondCall = resolver.resolveObjectFileName(longObjectName1);
		String resolvedFileName2_secondCall = resolver.resolveObjectFileName(longObjectName2);
		
		// Then: the same correct shortened names are returned
		assertEquals(
			"veryVeryVeryLongNameThatIsLongerThan100CharactersIsExpectedToBeShortenedByLongObjectNamesResolverSuc-0",
				resolvedFileName1_firstCall, "Expected shortened name with suffix of collision index (0 for no collision yet)");
		assertEquals(
			"veryVeryVeryLongNameThatIsLongerThan100CharactersIsExpectedToBeShortenedByLongObjectNamesResolverSuc-1",
				resolvedFileName2_firstCall, "Expected shortened name with suffix of collision index (1 for first collision)");
		assertEquals(
			resolvedFileName1_firstCall,
				resolvedFileName1_secondCall, "Expected same shortened name for calling resolver twice for same long name.");
		assertEquals(
			resolvedFileName2_firstCall,
				resolvedFileName2_secondCall, "Expected same shortened name for calling resolver twice for same long name.");
	}
	
}
