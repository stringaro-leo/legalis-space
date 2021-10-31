package space.legalis.app.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import space.legalis.app.domain.Statement;

/**
 * Spring Data MongoDB repository for the Statement entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StatementRepository extends MongoRepository<Statement, String> {}
