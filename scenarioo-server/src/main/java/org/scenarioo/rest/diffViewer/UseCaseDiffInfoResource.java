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

package org.scenarioo.rest.diffViewer;

import org.apache.log4j.Logger;
import org.scenarioo.business.builds.ScenarioDocuBuildsManager;
import org.scenarioo.dao.diffViewer.DiffReader;
import org.scenarioo.dao.diffViewer.impl.DiffReaderXmlImpl;
import org.scenarioo.model.diffViewer.UseCaseDiffInfo;
import org.scenarioo.rest.base.BuildIdentifier;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/rest/diffViewer/baseBranchName/{baseBranchName}/baseBuildName/{baseBuildName}/comparisonName/{comparisonName}")
public class UseCaseDiffInfoResource {

	private static final Logger LOGGER = Logger.getLogger(UseCaseDiffInfoResource.class);

	private DiffReader diffReader = new DiffReaderXmlImpl();

	@GET
	@Produces("application/json")
	@Path("/useCaseName/{useCaseName}/useCaseDiffInfo")
	public UseCaseDiffInfo getUseCaseDiffInfo(@PathParam("baseBranchName") final String baseBranchName,
			@PathParam("baseBuildName") final String baseBuildName,
			@PathParam("comparisonName") final String comparisonName,
			@PathParam("useCaseName") final String useCaseName) {
		final BuildIdentifier buildIdentifier = ScenarioDocuBuildsManager.INSTANCE.resolveBranchAndBuildAliases(
				baseBranchName,
				baseBuildName);

		return diffReader.loadUseCaseDiffInfo(buildIdentifier.getBranchName(), buildIdentifier.getBuildName(),
				comparisonName, useCaseName);
	}

	@GET
	@Produces("application/json")
	@Path("/useCaseDiffInfos")
	public Map<String, UseCaseDiffInfo> getUseCaseDiffInfos(@PathParam("baseBranchName") final String baseBranchName,
			@PathParam("baseBuildName") final String baseBuildName,
			@PathParam("comparisonName") final String comparisonName) {
		final BuildIdentifier buildIdentifier = ScenarioDocuBuildsManager.INSTANCE
				.resolveBranchAndBuildAliases(baseBranchName, baseBuildName);

		final List<UseCaseDiffInfo> useCaseDiffInfos = diffReader.loadUseCaseDiffInfos(buildIdentifier.getBranchName(),
				buildIdentifier.getBuildName(), comparisonName);
		return getUseCaseDiffInfoMap(useCaseDiffInfos);
	}

	private Map<String, UseCaseDiffInfo> getUseCaseDiffInfoMap(final List<UseCaseDiffInfo> useCaseDiffInfos) {
		final Map<String, UseCaseDiffInfo> useCaseDiffInfoMap = new HashMap<String, UseCaseDiffInfo>();
		for (final UseCaseDiffInfo useCaseDiffInfo : useCaseDiffInfos) {
			useCaseDiffInfoMap.put(useCaseDiffInfo.getName(), useCaseDiffInfo);
		}
		return useCaseDiffInfoMap;
	}

}
