/* scenarioo-server
 * Copyright (C) 2015, scenarioo.org Development Team
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * As a special exception, the copyright holders of this library give you
 * permission to link this library with independent modules, according
 * to the GNU General Public License with "Classpath" exception as provided
 * in the LICENSE file that accompanied this code.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package org.scenarioo.dao.design.entities;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.NumberFormat;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.scenarioo.api.util.files.FilesUtil;
import org.scenarioo.api.util.xml.ScenarioDocuXMLFileUtil;
import org.scenarioo.dao.design.aggregates.IssueAggregationDAO;
import org.scenarioo.model.design.entities.Issue;
import org.scenarioo.model.design.entities.SketchStep;

/**
 * Represents the file structure of the design domain.
 */
public class DesignFiles {

	private static final Logger LOGGER = Logger.getLogger(IssueAggregationDAO.class);

	private static final String DIRECTORY_NAME_PROPOSAL_ORIGINALSCREENSHOTS = "screenshots";

	private static final String DIRECTORY_NAME_PROPOSAL_SKETCHSTEPS = "sketchSteps";

	private static final String DIRECTORY_NAME_SKETCHSTEP_SVG = "svg";

	private static final String FILE_NAME_PROPOSAL = "proposal.xml";

	private static final String FILE_NAME_ISSUE = "issue.xml";

	private static final String FILE_NAME_BRANCH = "branch.xml";

	private static NumberFormat THREE_DIGIT_NUM_FORMAT = createNumberFormatWithMinimumIntegerDigits(3);

	private final File rootDirectory;

	public DesignFiles(final File rootDirectory) {
		this.rootDirectory = rootDirectory;
	}

	public void assertRootDirectoryExists() {
		if (!rootDirectory.exists()) {
			throw new IllegalArgumentException("Directory for design storage does not exist: "
					+ rootDirectory.getAbsolutePath());
		}
	}

	public File getRootDirectory() {
		return rootDirectory;
	}

	public File getBranchDirectory(final String branchName) {
		File branchDirectory = new File(rootDirectory, FilesUtil.encodeName(branchName));
		return branchDirectory;
	}

	public File getBranchFile(final String branchName) {
		return new File(getBranchDirectory(branchName), FILE_NAME_BRANCH);
	}

	public List<File> getBranchFiles() {
		return FilesUtil.getListOfFilesFromSubdirs(rootDirectory, FILE_NAME_BRANCH);
	}

	public File getIssueDirectory(final String branchName, final String issueName) {
		File branchDirectory = new File(getBranchDirectory(branchName), FilesUtil.encodeName(issueName));
		return branchDirectory;
	}

	public File getIssueFile(final String branchName, final String issueName) {
		return new File(getIssueDirectory(branchName, issueName), FILE_NAME_ISSUE);
	}

	public List<File> getIssueFiles(final String branchName) {
		return FilesUtil.getListOfFilesFromSubdirs(getBranchDirectory(branchName), FILE_NAME_ISSUE);
	}

	public File getProposalDirectory(final String branchName, final String issueName, final String proposalName) {
		File branchDirectory = new File(getIssueDirectory(branchName, issueName), FilesUtil.encodeName(proposalName));
		return branchDirectory;
	}

	public File getProposalFile(final String branchName, final String issueName, final String proposalName) {
		return new File(getProposalDirectory(branchName, issueName, proposalName), FILE_NAME_PROPOSAL);
	}

	public List<File> getProposalFiles(final String branchName, final String issueName) {
		return FilesUtil.getListOfFilesFromSubdirs(getIssueDirectory(branchName, issueName), FILE_NAME_PROPOSAL);
	}

	public File getSketchStepsDirectory(final String branchName, final String issueName, final String proposalName) {
		File sketchStepsDirectory = new File(getProposalDirectory(branchName, issueName, proposalName),
				DIRECTORY_NAME_PROPOSAL_SKETCHSTEPS);
		return sketchStepsDirectory;
	}

	public File getSketchStepFile(final String branchName, final String issueName, final String proposalName,
			final int sketchStepIndex) {
		return new File(getSketchStepsDirectory(branchName, issueName, proposalName),
				THREE_DIGIT_NUM_FORMAT.format(sketchStepIndex) + ".xml");
	}

	public File getSVGDirectory(final String branchName, final String issueName, final String proposalName) {
		File svgDirectory = new File(getSketchStepsDirectory(branchName, issueName, proposalName),
				DIRECTORY_NAME_SKETCHSTEP_SVG);
		return svgDirectory;
	}

	public File getSVGFile(final String branchName, final String issueName, final String proposalName,
			final String svgFilename) {
		return new File(getSVGDirectory(branchName, issueName, proposalName), svgFilename);
	}

	public List<File> getSketchStepFiles(final String branchName, final String issueName, final String proposalName) {
		return FilesUtil.getListOfFiles(getSketchStepsDirectory(branchName, issueName, proposalName));
	}

	public File getOriginalScreenshotsDirectory(final String branchName, final String issueName,
			final String proposalName) {
		return new File(getProposalDirectory(branchName, issueName, proposalName), DIRECTORY_NAME_PROPOSAL_ORIGINALSCREENSHOTS);
	}

	/**
	 * @return A {@link File} object pointing to the PNG file of the step screenshot. The method does not care whether
	 *         the file actually exists.
	 */
	public File getOriginalScreenshotFile(final String branchName, final String issueName,
			final String proposalName, final int sketchStepIndex) {
		return new File(getOriginalScreenshotsDirectory(branchName, issueName, proposalName),
				THREE_DIGIT_NUM_FORMAT.format(sketchStepIndex) + ".png");
	}

	private static NumberFormat createNumberFormatWithMinimumIntegerDigits(
			final int minimumIntegerDigits) {
		final NumberFormat numberFormat = NumberFormat.getIntegerInstance();
		numberFormat.setMinimumIntegerDigits(minimumIntegerDigits);
		return numberFormat;
	}

	// TODO: Check if branch folder exists in documentation folder
	public boolean createIssueDirectory(final String branchName, final String issueName) {
		File issueDirectory = new File(getBranchDirectory(branchName), FilesUtil.encodeName(issueName));
		// mkdirs() guarantees that the branch directory is created too
		boolean isCreated = issueDirectory.mkdirs();
		if (!isCreated) {
			LOGGER.error("Issue directory not created.");
		}
		return isCreated;
	}

	public File createIssueFile(final String branchName, final String issueName) {
		File issueFile = new File(getIssueDirectory(branchName, issueName), FILE_NAME_ISSUE);
		try {
			issueFile.createNewFile();
			return issueFile;
		} catch (IOException e) {
			LOGGER.error("Issue file not created.");
		}
		return issueFile;
	}

	public void writeIssueToFile(final String branchName, final Issue issue) {
		createIssueDirectory(branchName, issue.getName());
		File destinationFile = createIssueFile(branchName, issue.getName());
		issue.setIssueStatus("Open");
		ScenarioDocuXMLFileUtil.marshal(issue, destinationFile);
	}

	public boolean createSketchStepDirectory(final String branchName, final String issueName,
			final String proposalName) {
		File sketchStepDir = getSketchStepsDirectory(branchName, issueName, proposalName);
		boolean isCreated = sketchStepDir.mkdirs();
		if (!isCreated) {
			LOGGER.error("SketchStep directory not created.");
		}
		return isCreated;
	}

	public File createSketchStepFile(final String branchName, final String issueName,
			final String proposalName, final int sketchStepIndex, final SketchStep sketchStep) {
		File sketchStepFile = new File(getSketchStepsDirectory(branchName, issueName, proposalName),
				THREE_DIGIT_NUM_FORMAT.format(sketchStepIndex) + ".xml");
		try {
			sketchStepFile.createNewFile();
			return sketchStepFile;
		} catch (IOException e) {
			LOGGER.error("SketchStep file not created.");
		}
		return sketchStepFile;
	}

	public void writeSketchStepToFile(final String branchName, final String issueName,
			final String proposalName, final SketchStep sketchStep) {
		createSketchStepDirectory(branchName, issueName, proposalName);
		File destinationFile = createSketchStepFile(branchName, issueName, proposalName,
				sketchStep.getSketchStepName(), sketchStep);
		ScenarioDocuXMLFileUtil.marshal(sketchStep, destinationFile);
	}

	public boolean createSketchStepSVGDirectory(final String branchName, final String issueName,
			final String proposalName) {
		File sketchStepSVGDir = new File(getSketchStepsDirectory(branchName, issueName, proposalName),
				DIRECTORY_NAME_SKETCHSTEP_SVG);
		boolean isCreated = sketchStepSVGDir.mkdirs();
		if (!isCreated) {
			LOGGER.error("SketchStep SVG directory not created.");
		}
		return isCreated;
	}

	public File getSketchStepsSVGDirectory(final String branchName, final String issueName,
			final String proposalName) {
		return new File(getSketchStepsDirectory(branchName, issueName, proposalName), DIRECTORY_NAME_SKETCHSTEP_SVG);
	}

	public void writeSVGToFile(final String branchName, final String issueName,
			final String proposalName, final SketchStep sketchStep) {
		createSketchStepSVGDirectory(branchName, issueName, proposalName);
		String svgFilename = (new Date()).getTime() + ".svg";
		File sketchStepSVGFile = new File(getSketchStepsSVGDirectory(branchName, issueName, proposalName),
				svgFilename);
		try {
			sketchStepSVGFile.createNewFile();
			FileWriter writer = new FileWriter(sketchStepSVGFile);
			writer.write(sketchStep.getSketch());
			writer.close();

			sketchStep.setSketchFileName(svgFilename);
			File destinationFile = getSketchStepFile(branchName, issueName, proposalName,
					sketchStep.getSketchStepName());
			ScenarioDocuXMLFileUtil.marshal(sketchStep, destinationFile);
		} catch (IOException e) {
			LOGGER.error("Could not write SVG file.");
		}


	}

}
