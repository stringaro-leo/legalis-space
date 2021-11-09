package space.legalis.app.repository.extended;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import space.legalis.app.domain.Translation;

/**
 * Spring Data MongoDB repository for the Translation Extended entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TranslationExtendedRepository extends MongoRepository<Translation, String> {
    List<Translation> findTranslationsByLaw_Id(String lawId);

    List<Translation> findTranslationsByTreaty_Id(String treatyId);
}
