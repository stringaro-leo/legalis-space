package space.legalis.app.service.impl;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import space.legalis.app.domain.Statement;
import space.legalis.app.repository.StatementRepository;
import space.legalis.app.service.StatementService;

/**
 * Service Implementation for managing {@link Statement}.
 */
@Service
public class StatementServiceImpl implements StatementService {

    private final Logger log = LoggerFactory.getLogger(StatementServiceImpl.class);

    private final StatementRepository statementRepository;

    public StatementServiceImpl(StatementRepository statementRepository) {
        this.statementRepository = statementRepository;
    }

    @Override
    public Statement save(Statement statement) {
        log.debug("Request to save Statement : {}", statement);
        return statementRepository.save(statement);
    }

    @Override
    public Optional<Statement> partialUpdate(Statement statement) {
        log.debug("Request to partially update Statement : {}", statement);

        return statementRepository
            .findById(statement.getId())
            .map(existingStatement -> {
                if (statement.getDescription() != null) {
                    existingStatement.setDescription(statement.getDescription());
                }
                if (statement.getTitle() != null) {
                    existingStatement.setTitle(statement.getTitle());
                }

                return existingStatement;
            })
            .map(statementRepository::save);
    }

    @Override
    public List<Statement> findAll() {
        log.debug("Request to get all Statements");
        return statementRepository.findAll();
    }

    @Override
    public Optional<Statement> findOne(String id) {
        log.debug("Request to get Statement : {}", id);
        return statementRepository.findById(id);
    }

    @Override
    public void delete(String id) {
        log.debug("Request to delete Statement : {}", id);
        statementRepository.deleteById(id);
    }
}
