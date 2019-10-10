package org.scenarioo.rest.step.logic;

import static com.google.common.base.Preconditions.*;

import java.util.LinkedList;
import java.util.List;

import org.apache.log4j.Logger;
import org.scenarioo.model.docu.aggregates.scenarios.PageSteps;
import org.scenarioo.model.docu.aggregates.scenarios.ScenarioPageSteps;
import org.scenarioo.model.docu.entities.StepDescription;
import org.scenarioo.rest.base.StepIdentifier;

public class StepIndexResolver {

	private static final Logger LOGGER = Logger.getLogger(StepIndexResolver.class);

	private static final String ENCODED_SPACE = "%20";
	private static final String SPACE = " ";

	/**
	 * Retrieves the overall index of a step in the scenario given a step identifier. Can do a fallback in case the
	 * requested step is not found in the scenario.
	 */
	public ResolveStepIndexResult resolveStepIndex(final ScenarioPageSteps scenarioPagesAndSteps,
			final StepIdentifier stepIdentifier) {
		checkNotNull(scenarioPagesAndSteps);
		checkNotNull(stepIdentifier);

		// Find other step in current page occurrence
		List<PageSteps> pageOccurrences = new LinkedList<PageSteps>();
		for (PageSteps pageWithSteps : scenarioPagesAndSteps.getPagesAndSteps()) {
			if (isCorrectPage(pageWithSteps, stepIdentifier.getPageName())) {
				if (pageOccurrences.size() == stepIdentifier.getPageOccurrence()) {
					return resolveStepInPageOccurrence(pageWithSteps, stepIdentifier);
				}
				pageOccurrences.add(pageWithSteps);
			}
		}

		// No page occurrence exists in this scenario
		if (pageOccurrences.size() == 0) {
			return ResolveStepIndexResult.noFallbackFound();
		}

		// Find ideal page occurrence and step in page occurrence using labels
		return findBestStepInEntireScenario(stepIdentifier, pageOccurrences);
	}

	private ResolveStepIndexResult resolveStepInPageOccurrence(final PageSteps pageWithSteps,
			final StepIdentifier stepIdentifier) {
		if (stepIdentifier.getStepInPageOccurrence() < pageWithSteps.getSteps().size()) {
			StepDescription stepDescription = pageWithSteps.getSteps().get(stepIdentifier.getStepInPageOccurrence());
			String screenshotFileName = stepDescription.getScreenshotFileName();
			int index = stepDescription.getIndex();
			return ResolveStepIndexResult.requestedIndexFound(index, screenshotFileName);
		} else {
			int redirectStepInPageOccurrence = getStepInPageOccurrenceWithMostMatchingLabels(pageWithSteps.getSteps(),
					stepIdentifier);
			StepDescription stepDescription = pageWithSteps.getSteps().get(redirectStepInPageOccurrence);
			int index = stepDescription.getIndex();
			StepIdentifier redirectStepIdentifier = StepIdentifier.withDifferentStepInPageOccurrence(stepIdentifier,
					redirectStepInPageOccurrence);

			LOGGER.warn("stepInPageOccurrence " + stepIdentifier.getStepInPageOccurrence() + " does not exist in "
					+ stepIdentifier + ". Redirecting to " + redirectStepIdentifier);

			return ResolveStepIndexResult.otherStepInPageOccurrenceFound(index, redirectStepIdentifier,
					stepDescription.getScreenshotFileName());
		}
	}

	private int getStepInPageOccurrenceWithMostMatchingLabels(final List<StepDescription> steps,
			final StepIdentifier stepIdentifier) {

		int mostMatchingLabels = 0;
		int indexOfBestStep = 0;

		int i = 0;
		for (StepDescription step : steps) {
			int matchingLabelsOfStep = StepCandidate.getMatchingLabelsCount(step.getLabels().getLabels(),
					stepIdentifier.getLabels());
			// We want to get the highest possible step that has the maximum of matching labels.
			// Therefore >= is used here.
			if (matchingLabelsOfStep >= mostMatchingLabels) {
				mostMatchingLabels = matchingLabelsOfStep;
				indexOfBestStep = i;
			}
			i++;
		}

		return indexOfBestStep;
	}

	private boolean isCorrectPage(final PageSteps pageWithSteps, final String pageName) {
		if(pageName.equals(pageWithSteps.getPage().getName())) {
			return true;
		}
		// Spring Boot automatically decodes all encoded spaces.
		// As a consequence we may not be able to find a file that contains an encoded space.
		// If we did not find a direct match we try again with all encoded spaces removed.
		String sanitizedPageName = pageName.replaceAll(ENCODED_SPACE, SPACE);
		String sanitizedPageWithStepsPageName =  pageWithSteps.getPage().getName().replaceAll(ENCODED_SPACE, SPACE);
		return sanitizedPageName.equals(sanitizedPageWithStepsPageName);
	}

	private ResolveStepIndexResult findBestStepInEntireScenario(final StepIdentifier stepIdentifier,
			final List<PageSteps> pageOccurrences) {
		StepIdentifier redirectStepIdentifier = getRedirectStepIdentifierForStepInAllPageOccurrences(stepIdentifier,
				pageOccurrences);
		StepDescription stepDescription = pageOccurrences.get(redirectStepIdentifier.getPageOccurrence()).getSteps()
				.get(redirectStepIdentifier.getStepInPageOccurrence());
		int redirectStepIndex = stepDescription.getIndex();

		LOGGER.warn("pageOccurrence " + stepIdentifier.getPageOccurrence() + " does not exist in "
				+ stepIdentifier.toString() + ". Redirecting to " + redirectStepIdentifier);

		return ResolveStepIndexResult.otherStepInPageOccurrenceFound(redirectStepIndex, redirectStepIdentifier,
				stepDescription.getScreenshotFileName());
	}

	private StepIdentifier getRedirectStepIdentifierForStepInAllPageOccurrences(final StepIdentifier stepIdentifier,
			final List<PageSteps> pageOccurrences) {

		int mostMatchingLabels = 0;
		int pageOccurrenceOfBestStep = 0;
		int stepInPageOccurrenceOfBestStep = 0;

		int pageOccurrence = 0;
		for (PageSteps pageOccurrenceWithSteps : pageOccurrences) {
			int stepInPageOccurrence = 0;
			for (StepDescription step : pageOccurrenceWithSteps.getSteps()) {
				int matchingLabelsOfStep = StepCandidate.getMatchingLabelsCount(step.getLabels().getLabels(),
						stepIdentifier.getLabels());
				// We want the first step in a page occurrence that has the highest number of matching labels.
				// Of all the page occurrences with the highest number of matching labels, we want the highest page
				// occurrence, because it is closest to page occurrence requested by the user.
				if (matchingLabelsOfStep > mostMatchingLabels
						|| (matchingLabelsOfStep == mostMatchingLabels && pageOccurrence > pageOccurrenceOfBestStep)) {
					mostMatchingLabels = matchingLabelsOfStep;
					pageOccurrenceOfBestStep = pageOccurrence;
					stepInPageOccurrenceOfBestStep = stepInPageOccurrence;
				}
				stepInPageOccurrence++;
			}
			pageOccurrence++;
		}

		return StepIdentifier
				.withDifferentIds(stepIdentifier, pageOccurrenceOfBestStep, stepInPageOccurrenceOfBestStep);
	}

}
