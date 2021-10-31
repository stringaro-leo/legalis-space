package space.legalis.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Law.
 */
@Document(collection = "law")
public class Law implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("description")
    private String description;

    @Field("name")
    private String name;

    @Field("publication_date")
    private LocalDate publicationDate;

    @Field("effective_date")
    private LocalDate effectiveDate;

    @DBRef
    @Field("translation")
    @JsonIgnoreProperties(value = { "language", "law", "treaty" }, allowSetters = true)
    private Set<Translation> translations = new HashSet<>();

    @DBRef
    @Field("treaty")
    @JsonIgnoreProperties(value = { "statements", "translations", "countries", "law" }, allowSetters = true)
    private Set<Treaty> treaties = new HashSet<>();

    @DBRef
    @Field("law")
    @JsonIgnoreProperties(value = { "translations", "treaties", "laws", "country", "ref" }, allowSetters = true)
    private Set<Law> laws = new HashSet<>();

    @DBRef
    @Field("country")
    @JsonIgnoreProperties(value = { "laws", "statements", "ratifiedCountries" }, allowSetters = true)
    private Country country;

    @DBRef
    @Field("ref")
    @JsonIgnoreProperties(value = { "translations", "treaties", "laws", "country", "ref" }, allowSetters = true)
    private Law ref;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Law id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDescription() {
        return this.description;
    }

    public Law description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getName() {
        return this.name;
    }

    public Law name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getPublicationDate() {
        return this.publicationDate;
    }

    public Law publicationDate(LocalDate publicationDate) {
        this.setPublicationDate(publicationDate);
        return this;
    }

    public void setPublicationDate(LocalDate publicationDate) {
        this.publicationDate = publicationDate;
    }

    public LocalDate getEffectiveDate() {
        return this.effectiveDate;
    }

    public Law effectiveDate(LocalDate effectiveDate) {
        this.setEffectiveDate(effectiveDate);
        return this;
    }

    public void setEffectiveDate(LocalDate effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public Set<Translation> getTranslations() {
        return this.translations;
    }

    public void setTranslations(Set<Translation> translations) {
        if (this.translations != null) {
            this.translations.forEach(i -> i.setLaw(null));
        }
        if (translations != null) {
            translations.forEach(i -> i.setLaw(this));
        }
        this.translations = translations;
    }

    public Law translations(Set<Translation> translations) {
        this.setTranslations(translations);
        return this;
    }

    public Law addTranslation(Translation translation) {
        this.translations.add(translation);
        translation.setLaw(this);
        return this;
    }

    public Law removeTranslation(Translation translation) {
        this.translations.remove(translation);
        translation.setLaw(null);
        return this;
    }

    public Set<Treaty> getTreaties() {
        return this.treaties;
    }

    public void setTreaties(Set<Treaty> treaties) {
        if (this.treaties != null) {
            this.treaties.forEach(i -> i.setLaw(null));
        }
        if (treaties != null) {
            treaties.forEach(i -> i.setLaw(this));
        }
        this.treaties = treaties;
    }

    public Law treaties(Set<Treaty> treaties) {
        this.setTreaties(treaties);
        return this;
    }

    public Law addTreaty(Treaty treaty) {
        this.treaties.add(treaty);
        treaty.setLaw(this);
        return this;
    }

    public Law removeTreaty(Treaty treaty) {
        this.treaties.remove(treaty);
        treaty.setLaw(null);
        return this;
    }

    public Set<Law> getLaws() {
        return this.laws;
    }

    public void setLaws(Set<Law> laws) {
        if (this.laws != null) {
            this.laws.forEach(i -> i.setRef(null));
        }
        if (laws != null) {
            laws.forEach(i -> i.setRef(this));
        }
        this.laws = laws;
    }

    public Law laws(Set<Law> laws) {
        this.setLaws(laws);
        return this;
    }

    public Law addLaw(Law law) {
        this.laws.add(law);
        law.setRef(this);
        return this;
    }

    public Law removeLaw(Law law) {
        this.laws.remove(law);
        law.setRef(null);
        return this;
    }

    public Country getCountry() {
        return this.country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

    public Law country(Country country) {
        this.setCountry(country);
        return this;
    }

    public Law getRef() {
        return this.ref;
    }

    public void setRef(Law law) {
        this.ref = law;
    }

    public Law ref(Law law) {
        this.setRef(law);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Law)) {
            return false;
        }
        return id != null && id.equals(((Law) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Law{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            ", name='" + getName() + "'" +
            ", publicationDate='" + getPublicationDate() + "'" +
            ", effectiveDate='" + getEffectiveDate() + "'" +
            "}";
    }
}
