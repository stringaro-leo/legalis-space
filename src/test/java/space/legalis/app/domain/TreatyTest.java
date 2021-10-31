package space.legalis.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import space.legalis.app.web.rest.TestUtil;

class TreatyTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Treaty.class);
        Treaty treaty1 = new Treaty();
        treaty1.setId("id1");
        Treaty treaty2 = new Treaty();
        treaty2.setId(treaty1.getId());
        assertThat(treaty1).isEqualTo(treaty2);
        treaty2.setId("id2");
        assertThat(treaty1).isNotEqualTo(treaty2);
        treaty1.setId(null);
        assertThat(treaty1).isNotEqualTo(treaty2);
    }
}
