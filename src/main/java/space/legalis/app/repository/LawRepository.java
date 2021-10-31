package space.legalis.app.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import space.legalis.app.domain.Law;

/**
 * Spring Data MongoDB repository for the Law entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LawRepository extends MongoRepository<Law, String> {}
