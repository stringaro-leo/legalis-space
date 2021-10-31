package space.legalis.app.service;

import java.util.List;
import java.util.Optional;
import space.legalis.app.domain.Law;

/**
 * Service Interface for managing {@link Law}.
 */
public interface LawService {
    /**
     * Save a law.
     *
     * @param law the entity to save.
     * @return the persisted entity.
     */
    Law save(Law law);

    /**
     * Partially updates a law.
     *
     * @param law the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Law> partialUpdate(Law law);

    /**
     * Get all the laws.
     *
     * @return the list of entities.
     */
    List<Law> findAll();

    /**
     * Get the "id" law.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Law> findOne(String id);

    /**
     * Delete the "id" law.
     *
     * @param id the id of the entity.
     */
    void delete(String id);
}
