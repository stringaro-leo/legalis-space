package space.legalis.app.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import space.legalis.app.domain.Statement;
import space.legalis.app.repository.StatementRepository;
import space.legalis.app.service.StatementService;
import space.legalis.app.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link space.legalis.app.domain.Statement}.
 */
@RestController
@RequestMapping("/api")
public class StatementResource {

    private final Logger log = LoggerFactory.getLogger(StatementResource.class);

    private static final String ENTITY_NAME = "statement";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StatementService statementService;

    private final StatementRepository statementRepository;

    public StatementResource(StatementService statementService, StatementRepository statementRepository) {
        this.statementService = statementService;
        this.statementRepository = statementRepository;
    }

    /**
     * {@code POST  /statements} : Create a new statement.
     *
     * @param statement the statement to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new statement, or with status {@code 400 (Bad Request)} if the statement has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/statements")
    public ResponseEntity<Statement> createStatement(@RequestBody Statement statement) throws URISyntaxException {
        log.debug("REST request to save Statement : {}", statement);
        if (statement.getId() != null) {
            throw new BadRequestAlertException("A new statement cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Statement result = statementService.save(statement);
        return ResponseEntity
            .created(new URI("/api/statements/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /statements/:id} : Updates an existing statement.
     *
     * @param id the id of the statement to save.
     * @param statement the statement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated statement,
     * or with status {@code 400 (Bad Request)} if the statement is not valid,
     * or with status {@code 500 (Internal Server Error)} if the statement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/statements/{id}")
    public ResponseEntity<Statement> updateStatement(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Statement statement
    ) throws URISyntaxException {
        log.debug("REST request to update Statement : {}, {}", id, statement);
        if (statement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, statement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!statementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Statement result = statementService.save(statement);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, statement.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /statements/:id} : Partial updates given fields of an existing statement, field will ignore if it is null
     *
     * @param id the id of the statement to save.
     * @param statement the statement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated statement,
     * or with status {@code 400 (Bad Request)} if the statement is not valid,
     * or with status {@code 404 (Not Found)} if the statement is not found,
     * or with status {@code 500 (Internal Server Error)} if the statement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/statements/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Statement> partialUpdateStatement(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Statement statement
    ) throws URISyntaxException {
        log.debug("REST request to partial update Statement partially : {}, {}", id, statement);
        if (statement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, statement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!statementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Statement> result = statementService.partialUpdate(statement);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, statement.getId())
        );
    }

    /**
     * {@code GET  /statements} : get all the statements.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of statements in body.
     */
    @GetMapping("/statements")
    public List<Statement> getAllStatements() {
        log.debug("REST request to get all Statements");
        return statementService.findAll();
    }

    /**
     * {@code GET  /statements/:id} : get the "id" statement.
     *
     * @param id the id of the statement to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the statement, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/statements/{id}")
    public ResponseEntity<Statement> getStatement(@PathVariable String id) {
        log.debug("REST request to get Statement : {}", id);
        Optional<Statement> statement = statementService.findOne(id);
        return ResponseUtil.wrapOrNotFound(statement);
    }

    /**
     * {@code DELETE  /statements/:id} : delete the "id" statement.
     *
     * @param id the id of the statement to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/statements/{id}")
    public ResponseEntity<Void> deleteStatement(@PathVariable String id) {
        log.debug("REST request to delete Statement : {}", id);
        statementService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
