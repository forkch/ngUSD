package org.scenarioo.dao.version;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
public class ApplicationVersion {

	public ApplicationVersion() {
		// For REST
	}

	public ApplicationVersion(final String version, final String buildDate, final String apiVersion,
			final String aggregatedDataFormatVersion, final String documentationVersion) {
		this.version = version;
		this.buildDate = buildDate;
		this.apiVersion = apiVersion;
		this.aggregatedDataFormatVersion = aggregatedDataFormatVersion;
		this.documentationVersion = documentationVersion;
	}

	private String version;
	private String buildDate;
	private String apiVersion;
	private String aggregatedDataFormatVersion;
	private String documentationVersion;

	public String getVersion() {
		return version;
	}

	public String getBuildDate() {
		return buildDate;
	}

	public String getApiVersion() {
		return apiVersion;
	}

	public String getAggregatedDataFormatVersion() {
		return aggregatedDataFormatVersion;
	}

	public String getDocumentationVersion() {
		return documentationVersion;
	}

}
