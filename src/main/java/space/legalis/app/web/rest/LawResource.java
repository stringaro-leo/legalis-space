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
import space.legalis.app.domain.Law;
import space.legalis.app.repository.LawRepository;
import space.legalis.app.service.LawService;
import space.legalis.app.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link space.legalis.app.domain.Law}.
 */
@RestController
@RequestMapping("/api")
public class LawResource {

    private final Logger log = LoggerFactory.getLogger(LawResource.class);

    private static final String ENTITY_NAME = "law";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LawService lawService;

    private final LawRepository lawRepository;

    public LawResource(LawService lawService, LawRepository lawRepository) {
        this.lawService = lawService;
        this.lawRepository = lawRepository;
    }

    /**
     * {@code POST  /laws} : Create a new law.
     *
     * @param law the law to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new law, or with status {@code 400 (Bad Request)} if the law has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/laws")
    public ResponseEntity<Law> createLaw(@RequestBody Law law) throws URISyntaxException {
        log.debug("REST request to save Law : {}", law);
        if (law.getId() != null) {
            throw new BadRequestAlertException("A new law cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Law result = lawService.save(law);
        return ResponseEntity
            .created(new URI("/api/laws/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /laws/:id} : Updates an existing law.
     *
     * @param id the id of the law to save.
     * @param law the law to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated law,
     * or with status {@code 400 (Bad Request)} if the law is not valid,
     * or with status {@code 500 (Internal Server Error)} if the law couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/laws/{id}")
    public ResponseEntity<Law> updateLaw(@PathVariable(value = "id", required = false) final String id, @RequestBody Law law)
        throws URISyntaxException {
        log.debug("REST request to update Law : {}, {}", id, law);
        if (law.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, law.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lawRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Law result = lawService.save(law);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, law.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /laws/:id} : Partial updates given fields of an existing law, field will ignore if it is null
     *
     * @param id the id of the law to save.
     * @param law the law to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated law,
     * or with status {@code 400 (Bad Request)} if the law is not valid,
     * or with status {@code 404 (Not Found)} if the law is not found,
     * or with status {@code 500 (Internal Server Error)} if the law couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/laws/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Law> partialUpdateLaw(@PathVariable(value = "id", required = false) final String id, @RequestBody Law law)
        throws URISyntaxException {
        log.debug("REST request to partial update Law partially : {}, {}", id, law);
        if (law.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, law.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lawRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Law> result = lawService.partialUpdate(law);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, law.getId()));
    }

    /**
     * {@code GET  /laws} : get all the laws.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of laws in body.
     */
    @GetMapping("/laws")
    public List<Law> getAllLaws() {
        log.debug("REST request to get all Laws");
        return lawService.findAll();
    }

    /**
     * {@code GET  /laws/:id} : get the "id" law.
     *
     * @param id the id of the law to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the law, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/laws/{id}")
    public ResponseEntity<Law> getLaw(@PathVariable String id) {
        log.debug("REST request to get Law : {}", id);
        Optional<Law> law = lawService.findOne(id);
        return ResponseUtil.wrapOrNotFound(law);
    }

    /**
     * {@code DELETE  /laws/:id} : delete the "id" law.
     *
     * @param id the id of the law to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/laws/{id}")
    public ResponseEntity<Void> deleteLaw(@PathVariable String id) {
        log.debug("REST request to delete Law : {}", id);
        lawService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
