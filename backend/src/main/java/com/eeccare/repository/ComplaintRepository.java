package com.eeccare.repository;

import com.eeccare.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, UUID> {
    List<Complaint> findByEmailOrderByCreatedAtDesc(String email);
    Optional<Complaint> findByTicketCode(String ticketCode);
    List<Complaint> findByCategoryOrderByCreatedAtDesc(String category);
    List<Complaint> findByStatusOrderByCreatedAtDesc(String status);
    List<Complaint> findByCategoryAndStatusOrderByCreatedAtDesc(String category, String status);
    List<Complaint> findAllByOrderByCreatedAtDesc();
    long countByStatus(String status);
    long countByCategory(String category);
    
    @Query("SELECT c.category, COUNT(c) FROM Complaint c GROUP BY c.category")
    List<Object[]> countByCategoryBreakdown();
    
    @Query("SELECT COUNT(c) FROM Complaint c WHERE EXTRACT(YEAR FROM c.createdAt) = ?1")
    long countByYear(int year);

    @Query("SELECT c FROM Complaint c WHERE UPPER(c.ticketCode) LIKE UPPER(CONCAT('%', ?1, '%')) ORDER BY c.createdAt DESC")
    List<Complaint> searchByTicketCode(String search);
}
