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

package org.scenarioo.dao.search;

import org.scenarioo.dao.search.model.*;
import org.scenarioo.model.docu.entities.generic.ObjectReference;
import org.scenarioo.model.docu.entities.generic.ObjectTreeNode;
import org.scenarioo.rest.base.BuildIdentifier;
import org.scenarioo.rest.search.SearchRequest;

public class SearchTree {
	private final ObjectTreeNode<ObjectReference> results;
	private final long hits;
	private final long totalHits;
	private final SearchRequest searchRequest;

	public static SearchTree empty() {
		return new SearchTree(SearchResults.noHits(), new SearchRequest(new BuildIdentifier(), "", true));
	}

	public SearchTree(SearchResults searchResults, SearchRequest searchRequest) {
		this.hits = searchResults.getHits();
		this.totalHits = searchResults.getTotalHits();
		this.searchRequest = searchRequest;

		this.results = buildObjectTree(searchResults);
	}

	public ObjectTreeNode<ObjectReference> getResults() {
		return results;
	}

	public long getHits() {
		return hits;
	}

	public long getTotalHits() {
		return totalHits;
	}

	public SearchRequest getSearchRequest() {
		return searchRequest;
	}

	private ObjectTreeNode<ObjectReference> buildObjectTree(SearchResults searchResults) {
		ObjectTreeNode<ObjectReference> rootNode = new ObjectTreeNode<>(new ObjectReference("search", searchRequest.getQ()));
		for (SearchableObject entry : searchResults.getResults()) {
			addNode(rootNode, entry);
		}
		return rootNode;
	}

	private void addNode(ObjectTreeNode<ObjectReference> rootNode, SearchableObject entry) {
		if (entry instanceof SearchableUseCase) {
			putUseCase(rootNode, (SearchableUseCase) entry);

		} else if (entry instanceof SearchableScenario) {
			putScenario(rootNode, (SearchableScenario) entry);

		} else if (entry instanceof SearchableStep) {
			putStep(rootNode, (SearchableStep) entry);

		} else {
			throw new IllegalStateException("SearchTree does not support the node " + entry);
		}
	}

	private ObjectTreeNode<ObjectReference> findChild(String entry, ObjectTreeNode<ObjectReference> useCaseNode) {
		for (ObjectTreeNode<ObjectReference> scenario : useCaseNode.<ObjectReference>getChildren()) {
			if (scenario.getItem().getName().equals(entry)) {
				return scenario;
			}
		}

		return null;
	}

	private ObjectTreeNode<ObjectReference> getOrAddNode(ObjectTreeNode<ObjectReference> parentNode, String entry, String type) {
		ObjectTreeNode<ObjectReference> entryNode = findChild(entry, parentNode);

		if (entryNode != null) {
			return entryNode;
		}

		ObjectTreeNode<ObjectReference> scenarioNode = new ObjectTreeNode<ObjectReference>(new ObjectReference(type, entry));
		parentNode.addChild(scenarioNode);

		return scenarioNode;
	}

	private ObjectTreeNode<ObjectReference> getOrAddStep(ObjectTreeNode<ObjectReference> pageNode, String name) {
		return getOrAddNode(pageNode, name, FullTextSearch.STEP);
	}

	private ObjectTreeNode<ObjectReference> getOrAddScenario(ObjectTreeNode<ObjectReference> useCaseNode, String scenario) {
		return getOrAddNode(useCaseNode, scenario, FullTextSearch.SCENARIO);
	}

	private ObjectTreeNode<ObjectReference> getOrAddUseCase(ObjectTreeNode<ObjectReference> root, String usecase) {
		return getOrAddNode(root, usecase, FullTextSearch.USECASE);
	}

	private ObjectTreeNode<ObjectReference> putStep(ObjectTreeNode<ObjectReference> root, SearchableStep entry) {
		ObjectTreeNode<ObjectReference> useCaseNode = getOrAddUseCase(root, entry.getSearchableObjectContext().getUsecase());
		ObjectTreeNode<ObjectReference> scenarioNode = getOrAddScenario(useCaseNode, entry.getSearchableObjectContext().getScenario());

		return getOrAddStep(scenarioNode, String.format("%s/%s/%s", entry.getStep().getPage().getName(), entry.getSearchableObjectContext().getStepLink().getPageOccurrence(),
			entry.getSearchableObjectContext().getStepLink().getStepInPageOccurrence()));
	}

	private ObjectTreeNode<ObjectReference> putScenario(ObjectTreeNode<ObjectReference> root, SearchableScenario entry) {
		ObjectTreeNode<ObjectReference> useCaseNode = getOrAddUseCase(root, entry.getSearchableObjectContext().getUsecase());

		return getOrAddScenario(useCaseNode, entry.getScenario().getName());
	}

	private ObjectTreeNode<ObjectReference> putUseCase(ObjectTreeNode<ObjectReference> rootNode, SearchableUseCase entry) {
		return getOrAddUseCase(rootNode, entry.getUseCase().getName());
	}
}
