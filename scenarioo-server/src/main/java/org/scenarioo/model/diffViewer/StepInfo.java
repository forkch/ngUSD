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

package org.scenarioo.model.diffViewer;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;

import org.scenarioo.model.docu.aggregates.steps.StepLink;
import org.scenarioo.model.docu.entities.StepDescription;

@XmlAccessorType(XmlAccessType.FIELD)
public class StepInfo {

	private StepLink stepLink;
	
	private StepDescription stepDescription;

	public StepLink getStepLink() {
		return stepLink;
	}

	public void setStepLink(final StepLink stepLink) {
		this.stepLink = stepLink;
	}

	public StepDescription getStepDescription() {
		return stepDescription;
	}

	public void setStepDescription(final StepDescription stepDescription) {
		this.stepDescription = stepDescription;
	}

}
