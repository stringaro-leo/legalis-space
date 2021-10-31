package space.legalis.app.service;

import java.util.List;
import java.util.Optional;
import space.legalis.app.domain.Statement;

/**
 * Service Interface for managing {@link Statement}.
 */
public interface StatementService {
    /**
     * Save a statement.
     *
     * @param statement the entity to save.
     * @return the persisted entity.
     */
    Statement save(Statement statement);

    /**
     * Partially updates a statement.
     *
     * @param statement the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Statement> partialUpdate(Statement statement);

    /**
     * Get all the statements.
     *
     * @return the list of entities.
     */
    List<Statement> findAll();

    /**
     * Get the "id" statement.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Statement> findOne(String id);

    /**
     * Delete the "id" statement.
     *
     * @param id the id of the entity.
     */
    void delete(String id);
}
