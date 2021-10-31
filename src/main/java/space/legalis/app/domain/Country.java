package space.legalis.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Country.
 */
@Document(collection = "country")
public class Country implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("code")
    private String code;

    @Field("name")
    private String name;

    @DBRef
    @Field("law")
    @JsonIgnoreProperties(value = { "translations", "treaties", "laws", "country", "ref" }, allowSetters = true)
    private Set<Law> laws = new HashSet<>();

    @DBRef
    @Field("statement")
    @JsonIgnoreProperties(value = { "country", "treaty" }, allowSetters = true)
    private Set<Statement> statements = new HashSet<>();

    @DBRef
    @Field("ratifiedCountries")
    @JsonIgnoreProperties(value = { "statements", "translations", "countries", "law" }, allowSetters = true)
    private Treaty ratifiedCountries;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Country id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public Country code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return this.name;
    }

    public Country name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Law> getLaws() {
        return this.laws;
    }

    public void setLaws(Set<Law> laws) {
        if (this.laws != null) {
            this.laws.forEach(i -> i.setCountry(null));
        }
        if (laws != null) {
            laws.forEach(i -> i.setCountry(this));
        }
        this.laws = laws;
    }

    public Country laws(Set<Law> laws) {
        this.setLaws(laws);
        return this;
    }

    public Country addLaw(Law law) {
        this.laws.add(law);
        law.setCountry(this);
        return this;
    }

    public Country removeLaw(Law law) {
        this.laws.remove(law);
        law.setCountry(null);
        return this;
    }

    public Set<Statement> getStatements() {
        return this.statements;
    }

    public void setStatements(Set<Statement> statements) {
        if (this.statements != null) {
            this.statements.forEach(i -> i.setCountry(null));
        }
        if (statements != null) {
            statements.forEach(i -> i.setCountry(this));
        }
        this.statements = statements;
    }

    public Country statements(Set<Statement> statements) {
        this.setStatements(statements);
        return this;
    }

    public Country addStatement(Statement statement) {
        this.statements.add(statement);
        statement.setCountry(this);
        return this;
    }

    public Country removeStatement(Statement statement) {
        this.statements.remove(statement);
        statement.setCountry(null);
        return this;
    }

    public Treaty getRatifiedCountries() {
        return this.ratifiedCountries;
    }

    public void setRatifiedCountries(Treaty treaty) {
        this.ratifiedCountries = treaty;
    }

    public Country ratifiedCountries(Treaty treaty) {
        this.setRatifiedCountries(treaty);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Country)) {
            return false;
        }
        return id != null && id.equals(((Country) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Country{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", name='" + getName() + "'" +
            "}";
    }
}
