package space.legalis.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import space.legalis.app.web.rest.TestUtil;

class TranslationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Translation.class);
        Translation translation1 = new Translation();
        translation1.setId("id1");
        Translation translation2 = new Translation();
        translation2.setId(translation1.getId());
        assertThat(translation1).isEqualTo(translation2);
        translation2.setId("id2");
        assertThat(translation1).isNotEqualTo(translation2);
        translation1.setId(null);
        assertThat(translation1).isNotEqualTo(translation2);
    }
}
