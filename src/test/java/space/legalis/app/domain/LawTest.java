package space.legalis.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import space.legalis.app.web.rest.TestUtil;

class LawTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Law.class);
        Law law1 = new Law();
        law1.setId("id1");
        Law law2 = new Law();
        law2.setId(law1.getId());
        assertThat(law1).isEqualTo(law2);
        law2.setId("id2");
        assertThat(law1).isNotEqualTo(law2);
        law1.setId(null);
        assertThat(law1).isNotEqualTo(law2);
    }
}
