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
import space.legalis.app.IntegrationTest;
import space.legalis.app.domain.Statement;
import space.legalis.app.repository.StatementRepository;

/**
 * Integration tests for the {@link StatementResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class StatementResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/statements";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private StatementRepository statementRepository;

    @Autowired
    private MockMvc restStatementMockMvc;

    private Statement statement;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Statement createEntity() {
        Statement statement = new Statement().description(DEFAULT_DESCRIPTION).title(DEFAULT_TITLE);
        return statement;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Statement createUpdatedEntity() {
        Statement statement = new Statement().description(UPDATED_DESCRIPTION).title(UPDATED_TITLE);
        return statement;
    }

    @BeforeEach
    public void initTest() {
        statementRepository.deleteAll();
        statement = createEntity();
    }

    @Test
    void createStatement() throws Exception {
        int databaseSizeBeforeCreate = statementRepository.findAll().size();
        // Create the Statement
        restStatementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(statement)))
            .andExpect(status().isCreated());

        // Validate the Statement in the database
        List<Statement> statementList = statementRepository.findAll();
        assertThat(statementList).hasSize(databaseSizeBeforeCreate + 1);
        Statement testStatement = statementList.get(statementList.size() - 1);
        assertThat(testStatement.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testStatement.getTitle()).isEqualTo(DEFAULT_TITLE);
    }

    @Test
    void createStatementWithExistingId() throws Exception {
        // Create the Statement with an existing ID
        statement.setId("existing_id");

        int databaseSizeBeforeCreate = statementRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStatementMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(statement)))
            .andExpect(status().isBadRequest());

        // Validate the Statement in the database
        List<Statement> statementList = statementRepository.findAll();
        assertThat(statementList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllStatements() throws Exception {
        // Initialize the database
        statementRepository.save(statement);

        // Get all the statementList
        restStatementMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(statement.getId())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)));
    }

    @Test
    void getStatement() throws Exception {
        // Initialize the database
        statementRepository.save(statement);

        // Get the statement
        restStatementMockMvc
            .perform(get(ENTITY_API_URL_ID, statement.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(statement.getId()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE));
    }

    @Test
    void getNonExistingStatement() throws Exception {
        // Get the statement
        restStatementMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putNewStatement() throws Exception {
        // Initialize the database
        statementRepository.save(statement);

        int databaseSizeBeforeUpdate = statementRepository.findAll().size();

        // Update the statement
        Statement updatedStatement = statementRepository.findById(statement.getId()).get();
        updatedStatement.description(UPDATED_DESCRIPTION).title(UPDATED_TITLE);

        restStatementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedStatement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedStatement))
            )
            .andExpect(status().isOk());

        // Validate the Statement in the database
        List<Statement> statementList = statementRepository.findAll();
        assertThat(statementList).hasSize(databaseSizeBeforeUpdate);
        Statement testStatement = statementList.get(statementList.size() - 1);
        assertThat(testStatement.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testStatement.getTitle()).isEqualTo(UPDATED_TITLE);
    }

    @Test
    void putNonExistingStatement() throws Exception {
        int databaseSizeBeforeUpdate = statementRepository.findAll().size();
        statement.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStatementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, statement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(statement))
            )
            .andExpect(status().isBadRequest());

        // Validate the Statement in the database
        List<Statement> statementList = statementRepository.findAll();
        assertThat(statementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchStatement() throws Exception {
        int databaseSizeBeforeUpdate = statementRepository.findAll().size();
        statement.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStatementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(statement))
            )
            .andExpect(status().isBadRequest());

        // Validate the Statement in the database
        List<Statement> statementList = statementRepository.findAll();
        assertThat(statementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamStatement() throws Exception {
        int databaseSizeBeforeUpdate = statementRepository.findAll().size();
        statement.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStatementMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(statement)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Statement in the database
        List<Statement> statementList = statementRepository.findAll();
        assertThat(statementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateStatementWithPatch() throws Exception {
        // Initialize the database
        statementRepository.save(statement);

        int databaseSizeBeforeUpdate = statementRepository.findAll().size();

        // Update the statement using partial update
        Statement partialUpdatedStatement = new Statement();
        partialUpdatedStatement.setId(statement.getId());

        partialUpdatedStatement.title(UPDATED_TITLE);

        restStatementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStatement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStatement))
            )
            .andExpect(status().isOk());

        // Validate the Statement in the database
        List<Statement> statementList = statementRepository.findAll();
        assertThat(statementList).hasSize(databaseSizeBeforeUpdate);
        Statement testStatement = statementList.get(statementList.size() - 1);
        assertThat(testStatement.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testStatement.getTitle()).isEqualTo(UPDATED_TITLE);
    }

    @Test
    void fullUpdateStatementWithPatch() throws Exception {
        // Initialize the database
        statementRepository.save(statement);

        int databaseSizeBeforeUpdate = statementRepository.findAll().size();

        // Update the statement using partial update
        Statement partialUpdatedStatement = new Statement();
        partialUpdatedStatement.setId(statement.getId());

        partialUpdatedStatement.description(UPDATED_DESCRIPTION).title(UPDATED_TITLE);

        restStatementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStatement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStatement))
            )
            .andExpect(status().isOk());

        // Validate the Statement in the database
        List<Statement> statementList = statementRepository.findAll();
        assertThat(statementList).hasSize(databaseSizeBeforeUpdate);
        Statement testStatement = statementList.get(statementList.size() - 1);
        assertThat(testStatement.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testStatement.getTitle()).isEqualTo(UPDATED_TITLE);
    }

    @Test
    void patchNonExistingStatement() throws Exception {
        int databaseSizeBeforeUpdate = statementRepository.findAll().size();
        statement.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStatementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, statement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(statement))
            )
            .andExpect(status().isBadRequest());

        // Validate the Statement in the database
        List<Statement> statementList = statementRepository.findAll();
        assertThat(statementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchStatement() throws Exception {
        int databaseSizeBeforeUpdate = statementRepository.findAll().size();
        statement.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStatementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(statement))
            )
            .andExpect(status().isBadRequest());

        // Validate the Statement in the database
        List<Statement> statementList = statementRepository.findAll();
        assertThat(statementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamStatement() throws Exception {
        int databaseSizeBeforeUpdate = statementRepository.findAll().size();
        statement.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStatementMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(statement))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Statement in the database
        List<Statement> statementList = statementRepository.findAll();
        assertThat(statementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteStatement() throws Exception {
        // Initialize the database
        statementRepository.save(statement);

        int databaseSizeBeforeDelete = statementRepository.findAll().size();

        // Delete the statement
        restStatementMockMvc
            .perform(delete(ENTITY_API_URL_ID, statement.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Statement> statementList = statementRepository.findAll();
        assertThat(statementList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
