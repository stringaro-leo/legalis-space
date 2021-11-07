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
public class TranslationExtendedRepository {

    private final Logger log = LoggerFactory.getLogger(TranslationExtendedRepository.class);

    private final MongoTemplate mongoTemplate;

    public TranslationExtendedRepository(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public List<Translation> searchTranslationsByTypeAndTypeId(String type, String typeId, String language) {
        Query query = new Query();
        /**
        if (type != null && !type.isEmpty()) {
            query.addCriteria(Criteria.where("type").is(type));
        }
        if (typeId != null && !typeId.isEmpty()) {
            query.addCriteria(Criteria.where("typeId").is(typeId));
        }
         */
        if (language != null && !language.isEmpty()) {
            //{ "$ref" : "employee", "id" : 1 }
            //Aggregation aggr = new Aggregation();
            //Criteria.matchingDocumentStructure()

            query.addCriteria(Criteria.where("language").is(language));
        }
        log.debug("Lang: {},Query: {}", language, query.getQueryObject());
        return mongoTemplate.find(query, Translation.class);
    }
}
