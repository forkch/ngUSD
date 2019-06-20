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

package org.scenarioo.rest.application;

import org.apache.log4j.Logger;
import org.scenarioo.business.builds.ScenarioDocuBuildsManager;
import org.scenarioo.dao.context.ContextPathHolder;
import org.scenarioo.dao.version.ApplicationVersionHolder;
import org.scenarioo.model.configuration.Configuration;
import org.scenarioo.repository.ConfigurationRepository;
import org.scenarioo.repository.RepositoryLocator;
import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.core.env.Environment;

import javax.servlet.ServletContext;
import java.io.InputStream;
import java.util.Properties;

/**
 * Scenarioo REST Services Web Application context that initializes data on startup of server.
 */
public class ScenariooInitializer implements ServletContextInitializer {

	private static final Logger LOGGER = Logger.getLogger(ScenariooInitializer.class);
	private final ScenariooDataPathLogic scenariooDataPathLogic;

	public ScenariooInitializer(Environment environment) {
		SystemEnvironment systemEnvironment = new SystemEnvironment(environment);
		scenariooDataPathLogic = new ScenariooDataPathLogic(systemEnvironment);
	}

	@Override
	public void onStartup(ServletContext servletContext) {
		LOGGER.info("====================================================");
		LOGGER.info("Scenarioo Viewer is starting up ...");
		LOGGER.info("====================================================");

		try {
			initializeApplicationVersion(servletContext);
			loadConfiguration(servletContext);
			initializeContextPath(servletContext);

			LOGGER.info("  Updating documentation content directory (will be done asynchronously ...)");
			ScenarioDocuBuildsManager.getInstance().updateBuildsIfValidDirectoryConfigured();
		} catch(RuntimeException e) {
			LOGGER.error("====================================================");
			LOGGER.error("Error during Scenarioo startup", e);
			LOGGER.error("====================================================");
			throw e;
		}

		LOGGER.info("====================================================");
		LOGGER.info("Scenarioo Viewer started succesfully.");
		LOGGER.info("====================================================");
	}

	private void loadConfiguration(final ServletContext servletContext) {
		final String configurationDirectoryPath = scenariooDataPathLogic.getDataPath(servletContext);
		LOGGER.info("  Configured scenarioo data directory: " + configurationDirectoryPath);

		LOGGER.info("  Loading configuration ...");

		RepositoryLocator.INSTANCE.initializeConfigurationRepository(configurationDirectoryPath);

		final ConfigurationRepository configurationRepository = RepositoryLocator.INSTANCE.getConfigurationRepository();
		final Configuration configuration = configurationRepository.getConfiguration();

		LOGGER.info("  Configuration loaded.");
	}

	private void initializeApplicationVersion(final ServletContext servletContext) {
		final Properties properties = new Properties();

		final InputStream inputStream = servletContext.getResourceAsStream("/WEB-INF/classes/version.properties");
		if (inputStream == null) {
			LOGGER.warn("  version.properties not found, no version information available");
			ApplicationVersionHolder.INSTANCE.initialize("unknown", "unknown", "unknown", "unknown", "develop");
			return;
		}

		try {
			properties.load(inputStream);
			ApplicationVersionHolder.INSTANCE.initializeFromProperties(properties);
		} catch (final Exception e) {
			ApplicationVersionHolder.INSTANCE.initialize("unknown", "unknown", "unknown", "unknown", "develop");
			LOGGER.warn("  version.properties not found, no version information available", e);
		}

		LOGGER.info("  Version: " + ApplicationVersionHolder.INSTANCE.getApplicationVersion().getVersion());
		LOGGER.info("  Build date: " + ApplicationVersionHolder.INSTANCE.getApplicationVersion().getBuildDate());
	}

	private void initializeContextPath(ServletContext servletContext) {
		String contextPath = servletContext.getContextPath();

		LOGGER.info("  Real Context Path: " + contextPath);

		String sanitizedContextPath = sanitizeContextPath(contextPath);

		LOGGER.info("  Stored Context Path: " + sanitizedContextPath);

		ContextPathHolder.INSTANCE.setContextPath(sanitizedContextPath);
	}

	private String sanitizeContextPath(String contextPath) {
		if (contextPath == null || contextPath.length() == 0) {
			return "";
		} else if (contextPath.startsWith("/")) {
			return contextPath.substring(1);
		} else {
			return contextPath;
		}
	}
}
