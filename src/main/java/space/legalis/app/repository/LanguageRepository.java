package space.legalis.app.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import space.legalis.app.domain.Language;

/**
 * Spring Data MongoDB repository for the Language entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LanguageRepository extends MongoRepository<Language, String> {}
