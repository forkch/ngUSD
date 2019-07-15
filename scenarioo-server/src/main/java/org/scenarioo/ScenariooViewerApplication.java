package org.scenarioo;

import com.thetransactioncompany.cors.CORSFilter;
import org.scenarioo.rest.application.ScenariooInitializer;
import org.scenarioo.rest.base.logging.RequestLoggingFilter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.config.annotation.*;

import javax.annotation.PostConstruct;
import java.util.Collections;

@Configuration
@SpringBootApplication
public class ScenariooViewerApplication extends SpringBootServletInitializer implements WebMvcConfigurer {

	public static void main(String[] args) {
		SpringApplication.run(ScenariooViewerApplication.class, args);
	}

	/**
	 * To prevent a race condition between Spring Boot and ElasticSearch both trying to configure Netty
	 * we have to disable this through a System Property.
	 * See: https://discuss.elastic.co/t/contradictory-and-sometimes-poor-advice-given-for-es-set-netty-runtime-available-processors/148014
	 */
	@PostConstruct
	private void setSystemPropertyForElasticSearch() {
		System.setProperty("es.set.netty.runtime.available.processors", Boolean.FALSE.toString());
	}

	@Bean
	public ServletContextInitializer createInitializer(Environment environment) {
		return new ScenariooInitializer(environment);
	}

	@Bean
	public FilterRegistrationBean<CORSFilter> corsFilter() {
		FilterRegistrationBean<CORSFilter> corsFilterBean = new FilterRegistrationBean<>(new CORSFilter());
		corsFilterBean.setUrlPatterns(Collections.singletonList("/rest/*"));
		return corsFilterBean;
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(new RequestLoggingFilter());
	}

	@Override
	public void configurePathMatch(PathMatchConfigurer configurer) {
		// turn off all suffix pattern matching
		configurer.setUseSuffixPatternMatch(false);
	}

	@Override
	public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
		configurer.favorPathExtension(false);
	}

	/**
	 * Spring Boot uses the StrictHttpFirewall. By default it blocks requests containing URL encoded percent signs.
	 * In the Scenarioo End to End Tests this occurs in the scenario "Use breadcrumbs > Tooltip in breadcrumbs".
	 * If this feature is not disabled then an Internal Server Error is shown to the user.
	 */
	@Bean
	public HttpFirewall allowUrlEncodedPercentHttpFirewall() {
		StrictHttpFirewall firewall = new StrictHttpFirewall();
		firewall.setAllowUrlEncodedPercent(true);
		return firewall;
	}
}
