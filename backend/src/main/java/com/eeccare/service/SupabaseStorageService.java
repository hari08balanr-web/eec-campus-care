package com.eeccare.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@Slf4j
public class SupabaseStorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service.key}")
    private String supabaseKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String BUCKET_NAME = "complaints";

    public String uploadFile(MultipartFile file, String prefix) {
        try {
            String extension = getExtension(file.getOriginalFilename());
            String fileName = prefix + "_" + UUID.randomUUID().toString().substring(0, 8) + extension;
            
            String uploadUrl = String.format("%s/storage/v1/object/%s/%s", supabaseUrl, BUCKET_NAME, fileName);
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + supabaseKey);
            headers.set("apikey", supabaseKey);
            
            String contentType = file.getContentType();
            if (contentType == null || contentType.isBlank()) {
                contentType = fileName.endsWith(".jpg") || fileName.endsWith(".jpeg") ? "image/jpeg" 
                            : (fileName.endsWith(".webm") ? "video/webm" : "application/octet-stream");
            }
            headers.setContentType(MediaType.parseMediaType(contentType));
            
            HttpEntity<byte[]> requestEntity = new HttpEntity<>(file.getBytes(), headers);
            
            ResponseEntity<String> response = restTemplate.exchange(uploadUrl, HttpMethod.POST, requestEntity, String.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                return String.format("%s/storage/v1/object/public/%s/%s", supabaseUrl, BUCKET_NAME, fileName);
            } else {
                log.error("Failed to upload file to Supabase: {}", response.getBody());
                return null;
            }
        } catch (Exception e) {
            log.error("Exception during file upload", e);
            return null;
        }
    }

    private String getExtension(String filename) {
        if (filename == null) return "";
        int lastIndex = filename.lastIndexOf(".");
        return (lastIndex != -1) ? filename.substring(lastIndex) : "";
    }
}
