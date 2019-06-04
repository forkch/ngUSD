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
package org.scenarioo.business.builds;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Arrays;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.scenarioo.model.configuration.Configuration;
import org.scenarioo.model.docu.entities.Build;
import org.scenarioo.repository.RepositoryLocator;

class BuildSorterTest {
	
	@BeforeEach
	void setUp() {
		RepositoryLocator.INSTANCE.initializeConfigurationRepositoryForUnitTest(null);
	}
	
	@Test
	void testSortingSomeBuilds() {
		
		// Given: Builds with Build aliases
		BuildLink build1 = createBuildSuccess("build1", 1);
		BuildLink build2 = createBuildSuccess("build2", 2);
		BuildLink build3 = createBuildFailed("build3", 3);
		BuildLink aliasCurrent = createBuildAlias(Configuration.DEFAULT_ALIAS_FOR_LAST_SUCCESSFUL_BUILD,
				build2.getBuild());
		BuildLink aliasLast = createBuildAlias(Configuration.DEFAULT_ALIAS_FOR_MOST_RECENT_BUILD, build3.getBuild());
		List<BuildLink> buildsList = Arrays.asList(build1, build2, build3, aliasCurrent, aliasLast);
		
		// When: sorting this builds
		BuildSorter.sort(buildsList);
		
		// Then: the sorted list is in expected order
		assertSame(aliasCurrent, buildsList.get(0), "default build alias 'current' expected as first element");
		assertSame(aliasLast, buildsList.get(1), "build alias 'last' expected as second element");
		assertSame(build3,
				buildsList.get(2), "build3 expected as first non-aliased build (builds sorted by dates decreasing)");
		assertSame(build1,
				buildsList.get(4), "build1 expected as last non-aliased build (builds sorted by dates decreasing)");
	}
	
	private BuildLink createBuildSuccess(final String name, final int minuteOfDate) {
		return createNewBuild(name, name, "succcess", minuteOfDate);
	}
	
	private BuildLink createBuildFailed(final String name, final int minuteOfDate) {
		return createNewBuild(name, name, "failed", minuteOfDate);
	}
	
	private BuildLink createBuildAlias(final String aliasName, final Build build) {
		return new BuildLink(build, aliasName);
	}
	
	/**
	 * Create a usual build containing a valid date.
	 */
	private BuildLink createNewBuild(final String aliasName, final String name, final String status,
			final int minuteOfDate) {
		Build build = new Build(name);
		BuildLink result = new BuildLink(build, aliasName);
		Calendar cal = new GregorianCalendar();
		cal.set(Calendar.MINUTE, minuteOfDate);
		build.setDate(cal.getTime());
		build.setRevision("1234");
		build.setStatus(status);
		return result;
	}
	
}
