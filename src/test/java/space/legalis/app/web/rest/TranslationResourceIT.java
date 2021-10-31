package space.legalis.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.util.Base64Utils;
import space.legalis.app.IntegrationTest;
import space.legalis.app.domain.Translation;
import space.legalis.app.repository.TranslationRepository;

/**
 * Integration tests for the {@link TranslationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TranslationResourceIT {

    private static final String DEFAULT_NOTE = "AAAAAAAAAA";
    private static final String UPDATED_NOTE = "BBBBBBBBBB";

    private static final String DEFAULT_AUTHOR = "AAAAAAAAAA";
    private static final String UPDATED_AUTHOR = "BBBBBBBBBB";

    private static final String DEFAULT_SOURCE = "AAAAAAAAAA";
    private static final String UPDATED_SOURCE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_OFFICIAL = false;
    private static final Boolean UPDATED_OFFICIAL = true;

    private static final String DEFAULT_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_CONTENT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/translations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private TranslationRepository translationRepository;

    @Autowired
    private MockMvc restTranslationMockMvc;

    private Translation translation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Translation createEntity() {
        Translation translation = new Translation()
            .note(DEFAULT_NOTE)
            .author(DEFAULT_AUTHOR)
            .source(DEFAULT_SOURCE)
            .official(DEFAULT_OFFICIAL)
            .content(DEFAULT_CONTENT);
        return translation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Translation createUpdatedEntity() {
        Translation translation = new Translation()
            .note(UPDATED_NOTE)
            .author(UPDATED_AUTHOR)
            .source(UPDATED_SOURCE)
            .official(UPDATED_OFFICIAL)
            .content(UPDATED_CONTENT);
        return translation;
    }

    @BeforeEach
    public void initTest() {
        translationRepository.deleteAll();
        translation = createEntity();
    }

    @Test
    void createTranslation() throws Exception {
        int databaseSizeBeforeCreate = translationRepository.findAll().size();
        // Create the Translation
        restTranslationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(translation)))
            .andExpect(status().isCreated());

        // Validate the Translation in the database
        List<Translation> translationList = translationRepository.findAll();
        assertThat(translationList).hasSize(databaseSizeBeforeCreate + 1);
        Translation testTranslation = translationList.get(translationList.size() - 1);
        assertThat(testTranslation.getNote()).isEqualTo(DEFAULT_NOTE);
        assertThat(testTranslation.getAuthor()).isEqualTo(DEFAULT_AUTHOR);
        assertThat(testTranslation.getSource()).isEqualTo(DEFAULT_SOURCE);
        assertThat(testTranslation.getOfficial()).isEqualTo(DEFAULT_OFFICIAL);
        assertThat(testTranslation.getContent()).isEqualTo(DEFAULT_CONTENT);
    }

    @Test
    void createTranslationWithExistingId() throws Exception {
        // Create the Translation with an existing ID
        translation.setId("existing_id");

        int databaseSizeBeforeCreate = translationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTranslationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(translation)))
            .andExpect(status().isBadRequest());

        // Validate the Translation in the database
        List<Translation> translationList = translationRepository.findAll();
        assertThat(translationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllTranslations() throws Exception {
        // Initialize the database
        translationRepository.save(translation);

        // Get all the translationList
        restTranslationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(translation.getId())))
            .andExpect(jsonPath("$.[*].note").value(hasItem(DEFAULT_NOTE)))
            .andExpect(jsonPath("$.[*].author").value(hasItem(DEFAULT_AUTHOR)))
            .andExpect(jsonPath("$.[*].source").value(hasItem(DEFAULT_SOURCE)))
            .andExpect(jsonPath("$.[*].official").value(hasItem(DEFAULT_OFFICIAL.booleanValue())))
            .andExpect(jsonPath("$.[*].content").value(hasItem(DEFAULT_CONTENT.toString())));
    }

    @Test
    void getTranslation() throws Exception {
        // Initialize the database
        translationRepository.save(translation);

        // Get the translation
        restTranslationMockMvc
            .perform(get(ENTITY_API_URL_ID, translation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(translation.getId()))
            .andExpect(jsonPath("$.note").value(DEFAULT_NOTE))
            .andExpect(jsonPath("$.author").value(DEFAULT_AUTHOR))
            .andExpect(jsonPath("$.source").value(DEFAULT_SOURCE))
            .andExpect(jsonPath("$.official").value(DEFAULT_OFFICIAL.booleanValue()))
            .andExpect(jsonPath("$.content").value(DEFAULT_CONTENT.toString()));
    }

    @Test
    void getNonExistingTranslation() throws Exception {
        // Get the translation
        restTranslationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putNewTranslation() throws Exception {
        // Initialize the database
        translationRepository.save(translation);

        int databaseSizeBeforeUpdate = translationRepository.findAll().size();

        // Update the translation
        Translation updatedTranslation = translationRepository.findById(translation.getId()).get();
        updatedTranslation
            .note(UPDATED_NOTE)
            .author(UPDATED_AUTHOR)
            .source(UPDATED_SOURCE)
            .official(UPDATED_OFFICIAL)
            .content(UPDATED_CONTENT);

        restTranslationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTranslation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTranslation))
            )
            .andExpect(status().isOk());

        // Validate the Translation in the database
        List<Translation> translationList = translationRepository.findAll();
        assertThat(translationList).hasSize(databaseSizeBeforeUpdate);
        Translation testTranslation = translationList.get(translationList.size() - 1);
        assertThat(testTranslation.getNote()).isEqualTo(UPDATED_NOTE);
        assertThat(testTranslation.getAuthor()).isEqualTo(UPDATED_AUTHOR);
        assertThat(testTranslation.getSource()).isEqualTo(UPDATED_SOURCE);
        assertThat(testTranslation.getOfficial()).isEqualTo(UPDATED_OFFICIAL);
        assertThat(testTranslation.getContent()).isEqualTo(UPDATED_CONTENT);
    }

    @Test
    void putNonExistingTranslation() throws Exception {
        int databaseSizeBeforeUpdate = translationRepository.findAll().size();
        translation.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTranslationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, translation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(translation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Translation in the database
        List<Translation> translationList = translationRepository.findAll();
        assertThat(translationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchTranslation() throws Exception {
        int databaseSizeBeforeUpdate = translationRepository.findAll().size();
        translation.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTranslationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(translation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Translation in the database
        List<Translation> translationList = translationRepository.findAll();
        assertThat(translationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamTranslation() throws Exception {
        int databaseSizeBeforeUpdate = translationRepository.findAll().size();
        translation.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTranslationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(translation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Translation in the database
        List<Translation> translationList = translationRepository.findAll();
        assertThat(translationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateTranslationWithPatch() throws Exception {
        // Initialize the database
        translationRepository.save(translation);

        int databaseSizeBeforeUpdate = translationRepository.findAll().size();

        // Update the translation using partial update
        Translation partialUpdatedTranslation = new Translation();
        partialUpdatedTranslation.setId(translation.getId());

        partialUpdatedTranslation.author(UPDATED_AUTHOR).source(UPDATED_SOURCE).official(UPDATED_OFFICIAL);

        restTranslationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTranslation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTranslation))
            )
            .andExpect(status().isOk());

        // Validate the Translation in the database
        List<Translation> translationList = translationRepository.findAll();
        assertThat(translationList).hasSize(databaseSizeBeforeUpdate);
        Translation testTranslation = translationList.get(translationList.size() - 1);
        assertThat(testTranslation.getNote()).isEqualTo(DEFAULT_NOTE);
        assertThat(testTranslation.getAuthor()).isEqualTo(UPDATED_AUTHOR);
        assertThat(testTranslation.getSource()).isEqualTo(UPDATED_SOURCE);
        assertThat(testTranslation.getOfficial()).isEqualTo(UPDATED_OFFICIAL);
        assertThat(testTranslation.getContent()).isEqualTo(DEFAULT_CONTENT);
    }

    @Test
    void fullUpdateTranslationWithPatch() throws Exception {
        // Initialize the database
        translationRepository.save(translation);

        int databaseSizeBeforeUpdate = translationRepository.findAll().size();

        // Update the translation using partial update
        Translation partialUpdatedTranslation = new Translation();
        partialUpdatedTranslation.setId(translation.getId());

        partialUpdatedTranslation
            .note(UPDATED_NOTE)
            .author(UPDATED_AUTHOR)
            .source(UPDATED_SOURCE)
            .official(UPDATED_OFFICIAL)
            .content(UPDATED_CONTENT);

        restTranslationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTranslation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTranslation))
            )
            .andExpect(status().isOk());

        // Validate the Translation in the database
        List<Translation> translationList = translationRepository.findAll();
        assertThat(translationList).hasSize(databaseSizeBeforeUpdate);
        Translation testTranslation = translationList.get(translationList.size() - 1);
        assertThat(testTranslation.getNote()).isEqualTo(UPDATED_NOTE);
        assertThat(testTranslation.getAuthor()).isEqualTo(UPDATED_AUTHOR);
        assertThat(testTranslation.getSource()).isEqualTo(UPDATED_SOURCE);
        assertThat(testTranslation.getOfficial()).isEqualTo(UPDATED_OFFICIAL);
        assertThat(testTranslation.getContent()).isEqualTo(UPDATED_CONTENT);
    }

    @Test
    void patchNonExistingTranslation() throws Exception {
        int databaseSizeBeforeUpdate = translationRepository.findAll().size();
        translation.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTranslationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, translation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(translation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Translation in the database
        List<Translation> translationList = translationRepository.findAll();
        assertThat(translationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchTranslation() throws Exception {
        int databaseSizeBeforeUpdate = translationRepository.findAll().size();
        translation.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTranslationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(translation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Translation in the database
        List<Translation> translationList = translationRepository.findAll();
        assertThat(translationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamTranslation() throws Exception {
        int databaseSizeBeforeUpdate = translationRepository.findAll().size();
        translation.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTranslationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(translation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Translation in the database
        List<Translation> translationList = translationRepository.findAll();
        assertThat(translationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteTranslation() throws Exception {
        // Initialize the database
        translationRepository.save(translation);

        int databaseSizeBeforeDelete = translationRepository.findAll().size();

        // Delete the translation
        restTranslationMockMvc
            .perform(delete(ENTITY_API_URL_ID, translation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Translation> translationList = translationRepository.findAll();
        assertThat(translationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
