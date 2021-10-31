package space.legalis.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Statement.
 */
@Document(collection = "statement")
public class Statement implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("description")
    private String description;

    @Field("title")
    private String title;

    @DBRef
    @Field("country")
    @JsonIgnoreProperties(value = { "laws", "statements", "ratifiedCountries" }, allowSetters = true)
    private Country country;

    @DBRef
    @Field("treaty")
    @JsonIgnoreProperties(value = { "statements", "translations", "countries", "law" }, allowSetters = true)
    private Treaty treaty;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Statement id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDescription() {
        return this.description;
    }

    public Statement description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTitle() {
        return this.title;
    }

    public Statement title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Country getCountry() {
        return this.country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

    public Statement country(Country country) {
        this.setCountry(country);
        return this;
    }

    public Treaty getTreaty() {
        return this.treaty;
    }

    public void setTreaty(Treaty treaty) {
        this.treaty = treaty;
    }

    public Statement treaty(Treaty treaty) {
        this.setTreaty(treaty);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Statement)) {
            return false;
        }
        return id != null && id.equals(((Statement) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Statement{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            ", title='" + getTitle() + "'" +
            "}";
    }
}
