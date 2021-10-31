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
 * A Treaty.
 */
@Document(collection = "treaty")
public class Treaty implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("description")
    private String description;

    @Field("name")
    private String name;

    @Field("vote_date")
    private LocalDate voteDate;

    @Field("effective_date")
    private LocalDate effectiveDate;

    @DBRef
    @Field("statement")
    @JsonIgnoreProperties(value = { "country", "treaty" }, allowSetters = true)
    private Set<Statement> statements = new HashSet<>();

    @DBRef
    @Field("translation")
    @JsonIgnoreProperties(value = { "language", "law", "treaty" }, allowSetters = true)
    private Set<Translation> translations = new HashSet<>();

    @DBRef
    @Field("country")
    @JsonIgnoreProperties(value = { "laws", "statements", "ratifiedCountries" }, allowSetters = true)
    private Set<Country> countries = new HashSet<>();

    @DBRef
    @Field("law")
    @JsonIgnoreProperties(value = { "translations", "treaties", "laws", "country", "ref" }, allowSetters = true)
    private Law law;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Treaty id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDescription() {
        return this.description;
    }

    public Treaty description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getName() {
        return this.name;
    }

    public Treaty name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getVoteDate() {
        return this.voteDate;
    }

    public Treaty voteDate(LocalDate voteDate) {
        this.setVoteDate(voteDate);
        return this;
    }

    public void setVoteDate(LocalDate voteDate) {
        this.voteDate = voteDate;
    }

    public LocalDate getEffectiveDate() {
        return this.effectiveDate;
    }

    public Treaty effectiveDate(LocalDate effectiveDate) {
        this.setEffectiveDate(effectiveDate);
        return this;
    }

    public void setEffectiveDate(LocalDate effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public Set<Statement> getStatements() {
        return this.statements;
    }

    public void setStatements(Set<Statement> statements) {
        if (this.statements != null) {
            this.statements.forEach(i -> i.setTreaty(null));
        }
        if (statements != null) {
            statements.forEach(i -> i.setTreaty(this));
        }
        this.statements = statements;
    }

    public Treaty statements(Set<Statement> statements) {
        this.setStatements(statements);
        return this;
    }

    public Treaty addStatement(Statement statement) {
        this.statements.add(statement);
        statement.setTreaty(this);
        return this;
    }

    public Treaty removeStatement(Statement statement) {
        this.statements.remove(statement);
        statement.setTreaty(null);
        return this;
    }

    public Set<Translation> getTranslations() {
        return this.translations;
    }

    public void setTranslations(Set<Translation> translations) {
        if (this.translations != null) {
            this.translations.forEach(i -> i.setTreaty(null));
        }
        if (translations != null) {
            translations.forEach(i -> i.setTreaty(this));
        }
        this.translations = translations;
    }

    public Treaty translations(Set<Translation> translations) {
        this.setTranslations(translations);
        return this;
    }

    public Treaty addTranslation(Translation translation) {
        this.translations.add(translation);
        translation.setTreaty(this);
        return this;
    }

    public Treaty removeTranslation(Translation translation) {
        this.translations.remove(translation);
        translation.setTreaty(null);
        return this;
    }

    public Set<Country> getCountries() {
        return this.countries;
    }

    public void setCountries(Set<Country> countries) {
        if (this.countries != null) {
            this.countries.forEach(i -> i.setRatifiedCountries(null));
        }
        if (countries != null) {
            countries.forEach(i -> i.setRatifiedCountries(this));
        }
        this.countries = countries;
    }

    public Treaty countries(Set<Country> countries) {
        this.setCountries(countries);
        return this;
    }

    public Treaty addCountry(Country country) {
        this.countries.add(country);
        country.setRatifiedCountries(this);
        return this;
    }

    public Treaty removeCountry(Country country) {
        this.countries.remove(country);
        country.setRatifiedCountries(null);
        return this;
    }

    public Law getLaw() {
        return this.law;
    }

    public void setLaw(Law law) {
        this.law = law;
    }

    public Treaty law(Law law) {
        this.setLaw(law);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Treaty)) {
            return false;
        }
        return id != null && id.equals(((Treaty) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Treaty{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            ", name='" + getName() + "'" +
            ", voteDate='" + getVoteDate() + "'" +
            ", effectiveDate='" + getEffectiveDate() + "'" +
            "}";
    }
}
