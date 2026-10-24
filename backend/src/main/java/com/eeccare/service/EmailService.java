package com.eeccare.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Async
    public void sendComplaintConfirmation(String to, String name, String ticketCode) {
        try {
            Context context = new Context();
            context.setVariable("name", name);
            context.setVariable("ticketCode", ticketCode);
            
            String htmlContent = templateEngine.process("complaint-confirmation", context);
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject("EEC Care - Complaint Registered Successfully (" + ticketCode + ")");
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            log.info("Confirmation email sent successfully to {}", to);
        } catch (Exception e) {
            log.warn("Notice: Email confirmation not sent (Mail not configured or offline): {}", e.getMessage());
        }
    }

    @Async
    public void sendStatusUpdate(String to, String name, String ticketCode, String newStatus, String adminRemarks) {
        try {
            Context context = new Context();
            context.setVariable("name", name);
            context.setVariable("ticketCode", ticketCode);
            context.setVariable("newStatus", newStatus);
            context.setVariable("adminRemarks", adminRemarks != null ? adminRemarks : "None");
            
            String htmlContent = templateEngine.process("status-update", context);
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject("EEC Care - Complaint Status Updated (" + ticketCode + ")");
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            log.info("Status update email sent successfully to {}", to);
        } catch (Exception e) {
            log.warn("Notice: Status update email not sent (Mail not configured or offline): {}", e.getMessage());
        }
    }

    @Async
    public void sendAdminNewComplaintAlert(String toAdminEmail, com.eeccare.model.Complaint complaint) {
        try {
            Context context = new Context();
            context.setVariable("ticketCode", complaint.getTicketCode());
            context.setVariable("name", complaint.getName());
            context.setVariable("className", complaint.getClassName());
            context.setVariable("year", complaint.getYear());
            context.setVariable("email", complaint.getEmail());
            context.setVariable("mobile", complaint.getMobile());
            context.setVariable("category", complaint.getCategory());
            context.setVariable("block", complaint.getBlock());
            context.setVariable("floor", complaint.getFloor());
            context.setVariable("date", complaint.getComplaintDate() != null ? complaint.getComplaintDate().toString() : "");
            context.setVariable("time", complaint.getComplaintTime() != null ? complaint.getComplaintTime().toString() : "");
            context.setVariable("description", complaint.getDescription());
            context.setVariable("photoUrl", complaint.getPhotoUrl());
            context.setVariable("actionUrl", "http://localhost:5173/admin/complaints");
            
            String htmlContent = templateEngine.process("admin-complaint-notification", context);
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(toAdminEmail);
            helper.setSubject("🚨 [EEC Care Admin Alert] New Grievance - " + complaint.getTicketCode() + " (" + complaint.getCategory() + ")");
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            log.info("Admin complaint alert email sent successfully to {}", toAdminEmail);
        } catch (Exception e) {
            log.warn("Notice: Admin alert email to {} not sent (Mail not configured or offline): {}", toAdminEmail, e.getMessage());
        }
    }
}
