package space.legalis.app.service;

import java.util.List;
import java.util.Optional;
import space.legalis.app.domain.Treaty;

/**
 * Service Interface for managing {@link Treaty}.
 */
public interface TreatyService {
    /**
     * Save a treaty.
     *
     * @param treaty the entity to save.
     * @return the persisted entity.
     */
    Treaty save(Treaty treaty);

    /**
     * Partially updates a treaty.
     *
     * @param treaty the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Treaty> partialUpdate(Treaty treaty);

    /**
     * Get all the treaties.
     *
     * @return the list of entities.
     */
    List<Treaty> findAll();

    /**
     * Get the "id" treaty.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Treaty> findOne(String id);

    /**
     * Delete the "id" treaty.
     *
     * @param id the id of the entity.
     */
    void delete(String id);
}
