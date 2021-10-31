package space.legalis.app.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import space.legalis.app.domain.Translation;

/**
 * Spring Data MongoDB repository for the Translation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TranslationRepository extends MongoRepository<Translation, String> {}
