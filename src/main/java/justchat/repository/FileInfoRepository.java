package justchat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import justchat.model.FileInfo;

import java.util.UUID;

@Repository
public interface FileInfoRepository extends JpaRepository<FileInfo, UUID> {
}
