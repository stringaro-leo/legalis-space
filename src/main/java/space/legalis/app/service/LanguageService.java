package space.legalis.app.service;

import java.util.List;
import java.util.Optional;
import space.legalis.app.domain.Language;

/**
 * Service Interface for managing {@link Language}.
 */
public interface LanguageService {
    /**
     * Save a language.
     *
     * @param language the entity to save.
     * @return the persisted entity.
     */
    Language save(Language language);

    /**
     * Partially updates a language.
     *
     * @param language the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Language> partialUpdate(Language language);

    /**
     * Get all the languages.
     *
     * @return the list of entities.
     */
    List<Language> findAll();
    /**
     * Get all the Language where Translation is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<Language> findAllWhereTranslationIsNull();

    /**
     * Get the "id" language.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Language> findOne(String id);

    /**
     * Delete the "id" language.
     *
     * @param id the id of the entity.
     */
    void delete(String id);
}
