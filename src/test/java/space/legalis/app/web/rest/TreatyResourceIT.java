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
import space.legalis.app.domain.Treaty;
import space.legalis.app.repository.TreatyRepository;

/**
 * Integration tests for the {@link TreatyResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TreatyResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_VOTE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_VOTE_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_EFFECTIVE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_EFFECTIVE_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/treaties";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private TreatyRepository treatyRepository;

    @Autowired
    private MockMvc restTreatyMockMvc;

    private Treaty treaty;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Treaty createEntity() {
        Treaty treaty = new Treaty()
            .description(DEFAULT_DESCRIPTION)
            .name(DEFAULT_NAME)
            .voteDate(DEFAULT_VOTE_DATE)
            .effectiveDate(DEFAULT_EFFECTIVE_DATE);
        return treaty;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Treaty createUpdatedEntity() {
        Treaty treaty = new Treaty()
            .description(UPDATED_DESCRIPTION)
            .name(UPDATED_NAME)
            .voteDate(UPDATED_VOTE_DATE)
            .effectiveDate(UPDATED_EFFECTIVE_DATE);
        return treaty;
    }

    @BeforeEach
    public void initTest() {
        treatyRepository.deleteAll();
        treaty = createEntity();
    }

    @Test
    void createTreaty() throws Exception {
        int databaseSizeBeforeCreate = treatyRepository.findAll().size();
        // Create the Treaty
        restTreatyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(treaty)))
            .andExpect(status().isCreated());

        // Validate the Treaty in the database
        List<Treaty> treatyList = treatyRepository.findAll();
        assertThat(treatyList).hasSize(databaseSizeBeforeCreate + 1);
        Treaty testTreaty = treatyList.get(treatyList.size() - 1);
        assertThat(testTreaty.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testTreaty.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testTreaty.getVoteDate()).isEqualTo(DEFAULT_VOTE_DATE);
        assertThat(testTreaty.getEffectiveDate()).isEqualTo(DEFAULT_EFFECTIVE_DATE);
    }

    @Test
    void createTreatyWithExistingId() throws Exception {
        // Create the Treaty with an existing ID
        treaty.setId("existing_id");

        int databaseSizeBeforeCreate = treatyRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTreatyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(treaty)))
            .andExpect(status().isBadRequest());

        // Validate the Treaty in the database
        List<Treaty> treatyList = treatyRepository.findAll();
        assertThat(treatyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllTreaties() throws Exception {
        // Initialize the database
        treatyRepository.save(treaty);

        // Get all the treatyList
        restTreatyMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(treaty.getId())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].voteDate").value(hasItem(DEFAULT_VOTE_DATE.toString())))
            .andExpect(jsonPath("$.[*].effectiveDate").value(hasItem(DEFAULT_EFFECTIVE_DATE.toString())));
    }

    @Test
    void getTreaty() throws Exception {
        // Initialize the database
        treatyRepository.save(treaty);

        // Get the treaty
        restTreatyMockMvc
            .perform(get(ENTITY_API_URL_ID, treaty.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(treaty.getId()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.voteDate").value(DEFAULT_VOTE_DATE.toString()))
            .andExpect(jsonPath("$.effectiveDate").value(DEFAULT_EFFECTIVE_DATE.toString()));
    }

    @Test
    void getNonExistingTreaty() throws Exception {
        // Get the treaty
        restTreatyMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putNewTreaty() throws Exception {
        // Initialize the database
        treatyRepository.save(treaty);

        int databaseSizeBeforeUpdate = treatyRepository.findAll().size();

        // Update the treaty
        Treaty updatedTreaty = treatyRepository.findById(treaty.getId()).get();
        updatedTreaty.description(UPDATED_DESCRIPTION).name(UPDATED_NAME).voteDate(UPDATED_VOTE_DATE).effectiveDate(UPDATED_EFFECTIVE_DATE);

        restTreatyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTreaty.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTreaty))
            )
            .andExpect(status().isOk());

        // Validate the Treaty in the database
        List<Treaty> treatyList = treatyRepository.findAll();
        assertThat(treatyList).hasSize(databaseSizeBeforeUpdate);
        Treaty testTreaty = treatyList.get(treatyList.size() - 1);
        assertThat(testTreaty.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testTreaty.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testTreaty.getVoteDate()).isEqualTo(UPDATED_VOTE_DATE);
        assertThat(testTreaty.getEffectiveDate()).isEqualTo(UPDATED_EFFECTIVE_DATE);
    }

    @Test
    void putNonExistingTreaty() throws Exception {
        int databaseSizeBeforeUpdate = treatyRepository.findAll().size();
        treaty.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTreatyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, treaty.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(treaty))
            )
            .andExpect(status().isBadRequest());

        // Validate the Treaty in the database
        List<Treaty> treatyList = treatyRepository.findAll();
        assertThat(treatyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchTreaty() throws Exception {
        int databaseSizeBeforeUpdate = treatyRepository.findAll().size();
        treaty.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTreatyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(treaty))
            )
            .andExpect(status().isBadRequest());

        // Validate the Treaty in the database
        List<Treaty> treatyList = treatyRepository.findAll();
        assertThat(treatyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamTreaty() throws Exception {
        int databaseSizeBeforeUpdate = treatyRepository.findAll().size();
        treaty.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTreatyMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(treaty)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Treaty in the database
        List<Treaty> treatyList = treatyRepository.findAll();
        assertThat(treatyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateTreatyWithPatch() throws Exception {
        // Initialize the database
        treatyRepository.save(treaty);

        int databaseSizeBeforeUpdate = treatyRepository.findAll().size();

        // Update the treaty using partial update
        Treaty partialUpdatedTreaty = new Treaty();
        partialUpdatedTreaty.setId(treaty.getId());

        partialUpdatedTreaty.voteDate(UPDATED_VOTE_DATE).effectiveDate(UPDATED_EFFECTIVE_DATE);

        restTreatyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTreaty.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTreaty))
            )
            .andExpect(status().isOk());

        // Validate the Treaty in the database
        List<Treaty> treatyList = treatyRepository.findAll();
        assertThat(treatyList).hasSize(databaseSizeBeforeUpdate);
        Treaty testTreaty = treatyList.get(treatyList.size() - 1);
        assertThat(testTreaty.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testTreaty.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testTreaty.getVoteDate()).isEqualTo(UPDATED_VOTE_DATE);
        assertThat(testTreaty.getEffectiveDate()).isEqualTo(UPDATED_EFFECTIVE_DATE);
    }

    @Test
    void fullUpdateTreatyWithPatch() throws Exception {
        // Initialize the database
        treatyRepository.save(treaty);

        int databaseSizeBeforeUpdate = treatyRepository.findAll().size();

        // Update the treaty using partial update
        Treaty partialUpdatedTreaty = new Treaty();
        partialUpdatedTreaty.setId(treaty.getId());

        partialUpdatedTreaty
            .description(UPDATED_DESCRIPTION)
            .name(UPDATED_NAME)
            .voteDate(UPDATED_VOTE_DATE)
            .effectiveDate(UPDATED_EFFECTIVE_DATE);

        restTreatyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTreaty.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTreaty))
            )
            .andExpect(status().isOk());

        // Validate the Treaty in the database
        List<Treaty> treatyList = treatyRepository.findAll();
        assertThat(treatyList).hasSize(databaseSizeBeforeUpdate);
        Treaty testTreaty = treatyList.get(treatyList.size() - 1);
        assertThat(testTreaty.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testTreaty.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testTreaty.getVoteDate()).isEqualTo(UPDATED_VOTE_DATE);
        assertThat(testTreaty.getEffectiveDate()).isEqualTo(UPDATED_EFFECTIVE_DATE);
    }

    @Test
    void patchNonExistingTreaty() throws Exception {
        int databaseSizeBeforeUpdate = treatyRepository.findAll().size();
        treaty.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTreatyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, treaty.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(treaty))
            )
            .andExpect(status().isBadRequest());

        // Validate the Treaty in the database
        List<Treaty> treatyList = treatyRepository.findAll();
        assertThat(treatyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchTreaty() throws Exception {
        int databaseSizeBeforeUpdate = treatyRepository.findAll().size();
        treaty.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTreatyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(treaty))
            )
            .andExpect(status().isBadRequest());

        // Validate the Treaty in the database
        List<Treaty> treatyList = treatyRepository.findAll();
        assertThat(treatyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamTreaty() throws Exception {
        int databaseSizeBeforeUpdate = treatyRepository.findAll().size();
        treaty.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTreatyMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(treaty)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Treaty in the database
        List<Treaty> treatyList = treatyRepository.findAll();
        assertThat(treatyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteTreaty() throws Exception {
        // Initialize the database
        treatyRepository.save(treaty);

        int databaseSizeBeforeDelete = treatyRepository.findAll().size();

        // Delete the treaty
        restTreatyMockMvc
            .perform(delete(ENTITY_API_URL_ID, treaty.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Treaty> treatyList = treatyRepository.findAll();
        assertThat(treatyList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
