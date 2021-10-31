package space.legalis.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import space.legalis.app.web.rest.TestUtil;

class StatementTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Statement.class);
        Statement statement1 = new Statement();
        statement1.setId("id1");
        Statement statement2 = new Statement();
        statement2.setId(statement1.getId());
        assertThat(statement1).isEqualTo(statement2);
        statement2.setId("id2");
        assertThat(statement1).isNotEqualTo(statement2);
        statement1.setId(null);
        assertThat(statement1).isNotEqualTo(statement2);
    }
}
