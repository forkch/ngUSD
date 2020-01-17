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

package org.scenarioo.dao.search.elasticsearch;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import org.apache.log4j.Logger;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.xcontent.XContentType;
import org.scenarioo.dao.search.FullTextSearch;
import org.scenarioo.dao.search.model.SearchableScenario;
import org.scenarioo.dao.search.model.SearchableStep;
import org.scenarioo.dao.search.model.SearchableUseCase;
import org.scenarioo.model.docu.aggregates.steps.StepLink;
import org.scenarioo.model.docu.aggregates.usecases.ScenarioSummary;
import org.scenarioo.model.docu.aggregates.usecases.UseCaseScenarios;
import org.scenarioo.model.docu.aggregates.usecases.UseCaseScenariosList;
import org.scenarioo.model.docu.entities.Scenario;
import org.scenarioo.model.docu.entities.Step;
import org.scenarioo.model.docu.entities.UseCase;

import java.io.IOException;
import java.util.List;

class ElasticSearchIndexer {
	private final static Logger LOGGER = Logger.getLogger(ElasticSearchIndexer.class);

	private final TransportClient client;
	private final String indexName;

	ElasticSearchIndexer(final String indexName, final TransportClient client) {
		this.client = client;
		this.indexName = indexName;
	}

	void setupCleanIndex(final String indexName) {
		if (indexExists(indexName)) {
			client.admin().indices().prepareDelete(indexName).get();

			LOGGER.debug("Removed existing index " + indexName);
		}

		client.admin().indices().prepareCreate(indexName)
			.setSettings(Settings.builder()
				.put("index.number_of_shards", 1)
				.put("index.number_of_replicas", 1))
//			.addMapping(createMapping(), XContentType.JSON)
			.get();
		LOGGER.debug("Added new index " + indexName);
	}

	void indexUseCases(final UseCaseScenariosList useCaseScenariosList) {
		for (UseCaseScenarios useCaseScenarios : useCaseScenariosList.getUseCaseScenarios()) {
			indexUseCase(new SearchableUseCase(useCaseScenarios.getUseCase()));

			for (ScenarioSummary scenario : useCaseScenarios.getScenarios()) {
				indexScenario(new SearchableScenario(scenario.getScenario(), useCaseScenarios.getUseCase().getName()));
			}
		}
	}

	void indexSteps(final List<Step> stepsList, final List<StepLink> stepLinksList, final Scenario scenario, final UseCase usecase) {
		for (int i = 0; i < stepsList.size(); i++) {
			Step step = stepsList.get(i);
			StepLink link = stepLinksList.get(i);

			indexStep(new SearchableStep(step, link, scenario, usecase));
		}
	}

	private void indexUseCase(final SearchableUseCase searchableUseCase) {
		indexDocument(FullTextSearch.USECASE, searchableUseCase, searchableUseCase.getUseCase().getName());
	}

	private void indexScenario(final SearchableScenario scenariosearchDao) {
		indexDocument(FullTextSearch.SCENARIO, scenariosearchDao, scenariosearchDao.getScenario().getName());
	}

	private void indexStep(final SearchableStep stepSearchDao) {
		indexDocument(FullTextSearch.STEP, stepSearchDao, stepSearchDao.getStep().getStepDescription().getTitle());
	}

	private <T> void indexDocument(final String type, final T document, final String documentName) {
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			ObjectWriter writer = objectMapper.writer();

			client.prepareIndex(indexName, type).setSource(writer.writeValueAsBytes(document), XContentType.JSON).execute();

//            LOGGER.debug("Indexed use case " + documentName + " for index " + indexName);
		} catch (IOException e) {
			LOGGER.error("Could not index use case " + documentName + ". Will skip this one.", e);
		}
	}

	private boolean indexExists(final String indexName) {
		return client.admin().indices()
			.prepareExists(indexName)
			.execute().actionGet().isExists();
	}

	private String createMapping() {

		return "{" +
			"	\"mappings\":	{" +
			"		\"dynamic_templates\": [" +
			"			{" +
			"				\"ignore_meta_data\": {" +
			"					\"path_match\": \"SearchableObjectContext.*\"," +
			"					\"mapping\": {" +
			"						\"index\": \"no\"" +
			"					}" +
			"				}" +
			"			}" +
			"		]," +
			"		\"properties\": {" +
			"			\"step\": {" +
			"				\"properties\": {" +
			"					\"html\": {" +
			"						\"type\": \"object\"," +
			"						\"include_in_all\": false" +
			"					}" +
			"				}" +
			"			}" +
			"		}" +
			"	}" +
			"}";
	}
}
