package space.legalis.app.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import space.legalis.app.domain.Treaty;

/**
 * Spring Data MongoDB repository for the Treaty entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TreatyRepository extends MongoRepository<Treaty, String> {}
