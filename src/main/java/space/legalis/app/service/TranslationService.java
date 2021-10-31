package space.legalis.app.service;

import java.util.List;
import java.util.Optional;
import space.legalis.app.domain.Translation;

/**
 * Service Interface for managing {@link Translation}.
 */
public interface TranslationService {
    /**
     * Save a translation.
     *
     * @param translation the entity to save.
     * @return the persisted entity.
     */
    Translation save(Translation translation);

    /**
     * Partially updates a translation.
     *
     * @param translation the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Translation> partialUpdate(Translation translation);

    /**
     * Get all the translations.
     *
     * @return the list of entities.
     */
    List<Translation> findAll();

    /**
     * Get the "id" translation.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Translation> findOne(String id);

    /**
     * Delete the "id" translation.
     *
     * @param id the id of the entity.
     */
    void delete(String id);
}
