package com.eeccare;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class EecCareApplication {

	public static void main(String[] args) {
		SpringApplication.run(EecCareApplication.class, args);
	}

}
