package com.rikkeisoft.backend.model.entity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "collaborator_profile")
public class CollaboratorProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "account_id", nullable = false, unique = true)
    private Account account;

    @ManyToOne
    @JoinColumn(name = "managed_by_headhunter_id")
    private Account managedByHeadhunter;

    @Column(columnDefinition = "TEXT")
    private String bankInfo;

    private Double commissionRate;
}
