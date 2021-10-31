package space.legalis.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import space.legalis.app.IntegrationTest;
import space.legalis.app.domain.Law;
import space.legalis.app.repository.LawRepository;

/**
 * Integration tests for the {@link LawResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LawResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_PUBLICATION_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_PUBLICATION_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_EFFECTIVE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_EFFECTIVE_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/laws";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private LawRepository lawRepository;

    @Autowired
    private MockMvc restLawMockMvc;

    private Law law;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Law createEntity() {
        Law law = new Law()
            .description(DEFAULT_DESCRIPTION)
            .name(DEFAULT_NAME)
            .publicationDate(DEFAULT_PUBLICATION_DATE)
            .effectiveDate(DEFAULT_EFFECTIVE_DATE);
        return law;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Law createUpdatedEntity() {
        Law law = new Law()
            .description(UPDATED_DESCRIPTION)
            .name(UPDATED_NAME)
            .publicationDate(UPDATED_PUBLICATION_DATE)
            .effectiveDate(UPDATED_EFFECTIVE_DATE);
        return law;
    }

    @BeforeEach
    public void initTest() {
        lawRepository.deleteAll();
        law = createEntity();
    }

    @Test
    void createLaw() throws Exception {
        int databaseSizeBeforeCreate = lawRepository.findAll().size();
        // Create the Law
        restLawMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(law)))
            .andExpect(status().isCreated());

        // Validate the Law in the database
        List<Law> lawList = lawRepository.findAll();
        assertThat(lawList).hasSize(databaseSizeBeforeCreate + 1);
        Law testLaw = lawList.get(lawList.size() - 1);
        assertThat(testLaw.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testLaw.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testLaw.getPublicationDate()).isEqualTo(DEFAULT_PUBLICATION_DATE);
        assertThat(testLaw.getEffectiveDate()).isEqualTo(DEFAULT_EFFECTIVE_DATE);
    }

    @Test
    void createLawWithExistingId() throws Exception {
        // Create the Law with an existing ID
        law.setId("existing_id");

        int databaseSizeBeforeCreate = lawRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLawMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(law)))
            .andExpect(status().isBadRequest());

        // Validate the Law in the database
        List<Law> lawList = lawRepository.findAll();
        assertThat(lawList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllLaws() throws Exception {
        // Initialize the database
        lawRepository.save(law);

        // Get all the lawList
        restLawMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(law.getId())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].publicationDate").value(hasItem(DEFAULT_PUBLICATION_DATE.toString())))
            .andExpect(jsonPath("$.[*].effectiveDate").value(hasItem(DEFAULT_EFFECTIVE_DATE.toString())));
    }

    @Test
    void getLaw() throws Exception {
        // Initialize the database
        lawRepository.save(law);

        // Get the law
        restLawMockMvc
            .perform(get(ENTITY_API_URL_ID, law.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(law.getId()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.publicationDate").value(DEFAULT_PUBLICATION_DATE.toString()))
            .andExpect(jsonPath("$.effectiveDate").value(DEFAULT_EFFECTIVE_DATE.toString()));
    }

    @Test
    void getNonExistingLaw() throws Exception {
        // Get the law
        restLawMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putNewLaw() throws Exception {
        // Initialize the database
        lawRepository.save(law);

        int databaseSizeBeforeUpdate = lawRepository.findAll().size();

        // Update the law
        Law updatedLaw = lawRepository.findById(law.getId()).get();
        updatedLaw
            .description(UPDATED_DESCRIPTION)
            .name(UPDATED_NAME)
            .publicationDate(UPDATED_PUBLICATION_DATE)
            .effectiveDate(UPDATED_EFFECTIVE_DATE);

        restLawMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLaw.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLaw))
            )
            .andExpect(status().isOk());

        // Validate the Law in the database
        List<Law> lawList = lawRepository.findAll();
        assertThat(lawList).hasSize(databaseSizeBeforeUpdate);
        Law testLaw = lawList.get(lawList.size() - 1);
        assertThat(testLaw.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testLaw.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testLaw.getPublicationDate()).isEqualTo(UPDATED_PUBLICATION_DATE);
        assertThat(testLaw.getEffectiveDate()).isEqualTo(UPDATED_EFFECTIVE_DATE);
    }

    @Test
    void putNonExistingLaw() throws Exception {
        int databaseSizeBeforeUpdate = lawRepository.findAll().size();
        law.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLawMockMvc
            .perform(
                put(ENTITY_API_URL_ID, law.getId()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(law))
            )
            .andExpect(status().isBadRequest());

        // Validate the Law in the database
        List<Law> lawList = lawRepository.findAll();
        assertThat(lawList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchLaw() throws Exception {
        int databaseSizeBeforeUpdate = lawRepository.findAll().size();
        law.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLawMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(law))
            )
            .andExpect(status().isBadRequest());

        // Validate the Law in the database
        List<Law> lawList = lawRepository.findAll();
        assertThat(lawList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamLaw() throws Exception {
        int databaseSizeBeforeUpdate = lawRepository.findAll().size();
        law.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLawMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(law)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Law in the database
        List<Law> lawList = lawRepository.findAll();
        assertThat(lawList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateLawWithPatch() throws Exception {
        // Initialize the database
        lawRepository.save(law);

        int databaseSizeBeforeUpdate = lawRepository.findAll().size();

        // Update the law using partial update
        Law partialUpdatedLaw = new Law();
        partialUpdatedLaw.setId(law.getId());

        partialUpdatedLaw.name(UPDATED_NAME).publicationDate(UPDATED_PUBLICATION_DATE).effectiveDate(UPDATED_EFFECTIVE_DATE);

        restLawMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLaw.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLaw))
            )
            .andExpect(status().isOk());

        // Validate the Law in the database
        List<Law> lawList = lawRepository.findAll();
        assertThat(lawList).hasSize(databaseSizeBeforeUpdate);
        Law testLaw = lawList.get(lawList.size() - 1);
        assertThat(testLaw.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testLaw.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testLaw.getPublicationDate()).isEqualTo(UPDATED_PUBLICATION_DATE);
        assertThat(testLaw.getEffectiveDate()).isEqualTo(UPDATED_EFFECTIVE_DATE);
    }

    @Test
    void fullUpdateLawWithPatch() throws Exception {
        // Initialize the database
        lawRepository.save(law);

        int databaseSizeBeforeUpdate = lawRepository.findAll().size();

        // Update the law using partial update
        Law partialUpdatedLaw = new Law();
        partialUpdatedLaw.setId(law.getId());

        partialUpdatedLaw
            .description(UPDATED_DESCRIPTION)
            .name(UPDATED_NAME)
            .publicationDate(UPDATED_PUBLICATION_DATE)
            .effectiveDate(UPDATED_EFFECTIVE_DATE);

        restLawMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLaw.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLaw))
            )
            .andExpect(status().isOk());

        // Validate the Law in the database
        List<Law> lawList = lawRepository.findAll();
        assertThat(lawList).hasSize(databaseSizeBeforeUpdate);
        Law testLaw = lawList.get(lawList.size() - 1);
        assertThat(testLaw.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testLaw.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testLaw.getPublicationDate()).isEqualTo(UPDATED_PUBLICATION_DATE);
        assertThat(testLaw.getEffectiveDate()).isEqualTo(UPDATED_EFFECTIVE_DATE);
    }

    @Test
    void patchNonExistingLaw() throws Exception {
        int databaseSizeBeforeUpdate = lawRepository.findAll().size();
        law.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLawMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, law.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(law))
            )
            .andExpect(status().isBadRequest());

        // Validate the Law in the database
        List<Law> lawList = lawRepository.findAll();
        assertThat(lawList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchLaw() throws Exception {
        int databaseSizeBeforeUpdate = lawRepository.findAll().size();
        law.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLawMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(law))
            )
            .andExpect(status().isBadRequest());

        // Validate the Law in the database
        List<Law> lawList = lawRepository.findAll();
        assertThat(lawList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamLaw() throws Exception {
        int databaseSizeBeforeUpdate = lawRepository.findAll().size();
        law.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLawMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(law)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Law in the database
        List<Law> lawList = lawRepository.findAll();
        assertThat(lawList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteLaw() throws Exception {
        // Initialize the database
        lawRepository.save(law);

        int databaseSizeBeforeDelete = lawRepository.findAll().size();

        // Delete the law
        restLawMockMvc.perform(delete(ENTITY_API_URL_ID, law.getId()).accept(MediaType.APPLICATION_JSON)).andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Law> lawList = lawRepository.findAll();
        assertThat(lawList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
